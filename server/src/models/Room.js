import mongoose from "mongoose";

const questionLogSchema = new mongoose.Schema(
    {
        category: {type: String , enum : ["dsa","hr"],required:true},
        difficulty: {type: String, enum : ["easy","medium","hard"], default : "medium"},
        text: {type : String , required : true},
        askedAt : {type : Date , default:Date.now()},

    },
    {_id : false}
);

const roomSchema = new mongoose.Schema(
    {
        roomCode: { type: String, required: true, unique: true, index: true },
        participants: [
            {
                socketId: String,
                name: String,
                role : {type: String ,enum: ["interviewer","interviewee"]},

            },
        ],
        track: {type: String, enum: ["dsa","hr","mixed"],default:"mixed"},
        codeContent: {type:String,default:"//Start coding here\n"},
        language: { type : String , default: "javascript"},
        questions: [questionLogSchema],
        status: {type : String , enum: ["waiting","active","ended"],default:"waiting"},
        startedAt: Date,
        endedAt: Date,
    },
    { timestamps : true}
);

export default mongoose.model("Room",roomSchema );