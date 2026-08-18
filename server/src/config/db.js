import mongoose from "mongoose";

export async function connectDB(){

    const  uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interview-prep-room";

    try{
        await mongoose.connect(uri);
        console.log("[db] connected:",uri);
    }
    catch(err){
        console.error("[db] conection failed: ",err.message);
        console.error("[DB] server will keep running, but rooms/history won't persist until Mongo is reachable.");
    }
}