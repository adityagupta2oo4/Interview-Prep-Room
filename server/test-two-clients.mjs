import { io } from "socket.io-client";

const alice = io("http://localhost:5000"); //create socket.io client socket
const bob = io("http://localhost:5000");

alice.on("connect" , ()=> alice.emit("find_match", {name : "Alice" , track: "dsa"})); // if on socket comes connect event then apply the call back function which is an custom event name "find_match"
bob.on("connect" , ()=> bob.emit("find_match",{name : "Bob" , track:"dsa"}));

alice.on("match_found" , (data) => console.log("Alice matched:",data));
bob.on("match_found",  (data) => console.log("Bob matched:",data));

setTimeout(()=>process.exit(0) , 3000);