import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";
import questionsRouter from "./routes/questions.js";
import { registerSocketHandlers } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;
const CLIENT_URL  = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();
app.use(cors({origin: CLIENT_URL}));
app.use(express.json());

app.get("/health",(_req,res) => res.json({ok: true}));
app.use("/api/questions",questionsRouter);

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin : CLIENT_URL ,
        methods : ["GET","POST"]
    },
});

registerSocketHandlers(io);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`[server] listening on http://localhost:${PORT}`);
    });
});