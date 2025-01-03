// const a:number=1;
// console.log(a);
import path from "path";
import express from 'express';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();
const PORT=process.env.PORT || 5005;
const __dirname=path.resolve();
//const app=express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

//frontend=>5173
//backend=>5005
if(process.env.NODE_ENV!== "development"){
    app.use(express.static(path.join(__dirname, "/frontend/build")));
   app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
   });
}

server.listen(PORT, ()=>{
    console.log(`${PORT} server is running`);
})

//deployment

