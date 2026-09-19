""" 
Local question bank used as the default "AI" source, and as gaurateed 
if no LLM API key is configured. This is what makes the demo work
completely offline / for free — the LLM call in generator.py is optional
and layered on top of this.
"""

import random

BANK = {
    "dsa": {
        "easy": [
            "Reverse a linked list in-place. Walk through time and space complexity.",
            "Given a string, check if it's a valid palindrome ignoring non-alphanumeric characters.",
            "Find the first non-repeating character in a string.",
            "Merge two sorted arrays into one sorted array.",
            "Implement a function to check if two strings are anagrams.",
        ],
        "medium": [
            "Given an array, find the longest subarray with a sum equal to k.",
            "Design an algorithm to find the kth largest element in an unsorted array.",
            "Given a binary tree, return the level order traversal of its nodes' values.",
            "Find all pairs in an array that sum to a target value, in O(n) time.",
            "Implement an LRU cache with O(1) get and put operations.",
        ],
        "hard": [
            "Design a data structure that supports insert, delete, and getRandom in O(1).",
            "Given a matrix of 0s and 1s, find the largest square containing only 1s.",
            "Implement word search II: given a board and a list of words, find all words present.",
            "Design a rate limiter that supports multiple time windows efficiently.",
            "Given a stream of integers, design a structure to find the median at any point.",
        ],
    },
    "hr": {
        "easy": [
            "Tell me about a project you're proud of and why.",
            "What made you choose this field of engineering?",
            "Describe your ideal team environment.",
        ],
        "medium": [
            "Describe a time you disagreed with a teammate. How did you resolve it?",
            "Tell me about a time you had to learn something new quickly under a deadline.",
            "How do you prioritize when you have multiple competing deadlines?",
        ],
        "hard": [
            "Where do you see yourself contributing most in your first three months here?",
            "Tell me about a time you made a mistake that affected others. What did you do next?",
            "Describe a situation where you had to push back on a decision you disagreed with.",
        ],
    },
}

def get_random_question(category: str , difficulty: str , topic:str | None = None) -> str:
    category = category if category in BANK else "dsa"
    pool_by_difficulty = BANK[category]
    difficulty = difficulty if difficulty in pool_by_difficulty else "medium"
    
    pool  = pool_by_difficulty[difficulty]
    
    if topic:
        
        filtered  =[q for q in pool if topic.lower() in q.lower()]
        if filtered:
            pool = filtered
            
    return random.choice(pool)