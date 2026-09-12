import{ enqueue , tryMatch , removeFromQueue} from "./queue.js"

enqueue("dsa","socket-1","Alice");
console.log("After 1 user, tryMatch: ", tryMatch("dsa"));


enqueue("dsa", "socket-b", "Bob");
console.log("After 2 users, tryMatch: ",tryMatch("dsa"));

enqueue("dsa", "socket-c", "Carol");
removeFromQueue("socket-c");
console.log("After enqueue + remove, tryMatch:", tryMatch("dsa"))