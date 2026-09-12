// for now we are going to use simple in-memory matchmaking queue later
// we will shift to redis list 

const waiting = new Map(); //track -> [{socketId, name}]

export function enqueue(track, socketId, name) {
    if(!waiting.has(track)) waiting.set(track,[]);
    waiting.get(track).push({socketId,name});
}

export function removeFromQueue(socketId){
    for(const list of waiting.values()){
        const idx = list.findIndex((u) => u.socketId === socketId);
        if( idx !== -1) list.splice(idx,1);
    }
}

// find match for same track

export function tryMatch(track){
    const list = waiting.get(track);
    if(!list || list.length < 2) return null;

    const userA = list.shift();
    const userB = list.shift();
    return [userA , userB];
}