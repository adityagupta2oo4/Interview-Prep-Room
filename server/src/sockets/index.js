import { nanoid } from "nanoid";
import Room from "../models/Room.js";
import {enqueue, removeFromQueue, tryMatch } from "../matchmaking/queue.js";
import { application } from "express";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export function registerSocketHandler(io){
    io.on("connection",(socket) => {
        console.log("[socket] connected: ",socket.id);
        
        // match - making

        socket.on("find_match" , async ({name, track = "mixed"})=>{
            socket.data.name = name || "Anonymous"; // intially socket.data ={} , provided by the socket.io
            
            enqueue(track , socket.id,socket.data.name);

            const pair = tryMatch(track);

            if(!pair){
                socket.emit("match_status" ,{status: "waiting"});
                return;
            }

            const [userA,userB] = pair;
            const roomCode = nanoid(8);

            // assigning roles randomle 50-50

            const [interviewer , interviewee] = Math.random() > 0.5 ? [userA, userB] : [userB,userA];

            const room  =  await Room.create({
                roomCode,
                track,
                status : "active",
                startedAt : new Date(),
                participants: [
                    {socketId: interviewer.socketId, name: interviewer.name, role: "interviewer"},
                    {socketId: interviewee.socketId, name: interviewee.name, role: "interviewee"},
                ],
                }).catch((err)=>{
                    console.warn("[socket] could not persist room contniouing without DB:",err.message);
                    return null;
            });

            for(const [user,role] of [
                [interviewer , "interviewer"],
                [interviewee , "interviewee"],
            ])
            {
                const s = io.sockets.sockets.get(user.socketId);
                if(!s) continue;

                s.join(roomCode);
                s.data.roomCode = roomCode;
                s.emit("match_found" ,{
                    roomCode,
                    role,
                    track,
                    partnerName : role === "interviewer" ? interviewee.name : interviewer.name,
                });
            }
        });
        socket.on("cancel_search" , () => {
            removeFromQueue(socket.id);
        });

        //room - code sync

        socket.on("code_change" , ({roomCode , content}) =>{
            
            socket.to(roomCode).emit("code_update" , {content});
            Room.updateOne({roomCode} , {codeContent : content}).catch(()=>{});

        });

        socket.on("language_change" , ({roomCode , language}) => {
            socket.to(roomCode).emit("language_update" , {language});
            Room.updateOne({roomCode},{language}).catch(()=> {});
        });

        // room-chat

        socket.on("chat_message" , ({roomCode , message}) => {
            // sendging our own object to front-end later it will process it and display
            const payload ={
                from: socket.data.name || "Anonymous",
                message,
                at : new Date().toISOString(),
            };
            io.to(roomCode).emit("chat_message",payload);
        })

        // room - AI-question

        socket.on("request_question" , async ({roomCode ,category , difficulty ,topic}) => {
            try{
                const response = await fetch(`${AI_SERVICE_URL}/generate-question`,
                    {
                        method : "POST",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify({category , difficulty,topic}),
                        signal : AbortSignal.timeout(5000),
                    }
                );
                const data = await response.json();
                io.to(roomCode).emit("new_question" ,data);
                Room.updateOne(
                    {roomCode},
                    {$push : {questions : {category ,difficulty,text : data.text}}}

                ).catch(()=>{});

            } 
            catch(err){
                io.to(roomCode).emit("new_question" , {
                    category,
                    difficulty,
                    text : "Couldn't reach the AI service — check that ai-service is running on port 8000.",
                    error : true,
                });
            }
        });

        // clean-up

        socket.on("leave_room" , ({roomCode})=>{
            socket.leave(roomCode);
            socket.to(roomCode).emit("partner-left");
            Room.updateOne({roomCode} , {status : "ended" , endedAt : new Date()}).catch(()=>{});
        });

        socket.on("disconnect",()=>{
            removeFromQueue(socket.id);
            if (socket.data.roomCode) {
                socket.to(socket.data.roomCode).emit("partner_left");
            }
            console.log("[socket] disconnected:", socket.id);

        });


    });
}