import express from "express";

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const FALLBACK_BANK = {
    dsa :[
        {difficulty: "easy", text: "Reverse a linked list in-place. Discuss time and space complexity."},
        {difficulty: "medium", text: "Given an array, find the longest subarray with a sum equal to k." },
        {difficulty: "hard", text: "Design a data structure that supports insert, delete, and getRandom in O(1)."}, 
    ],
    hr : [
        {difficulty: "easy", text: "Tell me about a project you're proud of and why."},
        {difficulty: "medium", text: "Describe a time you disagreed with a teammate. How did you resolve it?"},
        { difficulty: "hard", text: "Where do you see yourself contributing most in your first three months here?"},
    ],
};

router.post("/generate" ,async (req , res) => {
    const { category = "dsa", difficulty = "medium", topic } = req.body;

    try{
        const response = await fetch(`${AI_SERVICE_URL}/generate-question` ,{
                 method: "POST",
                 headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({ category, difficulty, topic }),
                 signal: AbortSignal.timeout(5000),
        });
         if (!response.ok) throw new Error(`AI service responded ${response.status}`);
         const data = await response.json();
         return res.json({ source: "ai-service", ...data });

    } catch(err) {
        console.warn("[questions] AI service unreachable, using fallback bank:", err.message);
        const pool = FALLBACK_BANK[category] || FALLBACK_BANK.dsa;
        const match = pool.find((q) => q.difficulty === difficulty) || pool[0];
        return res.json({ source: "fallback", category, ...match });
    }
});

export default router;