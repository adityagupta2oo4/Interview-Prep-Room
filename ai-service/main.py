from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel # for data validation and serialization of request and response bodies

from generator import generate_question, USE_LLM

app = FastAPI(title = "Interview Prep Room" )

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], # currently allowing all origins for development purposes; consider restricting this in production
    allow_methods = ["*"],
    allow_headers = ["*"], 
)

class QuestionRequest(BaseModel): # defines the expected structure of the request body for generating a question
    category: str
    difficulty: str
    topic: str | None = None
    
@app.get("/health")
def health():
    return {"ok" : True, "llm_enabled" : USE_LLM}

@app.post("/generate-question")
def generate(req : QuestionRequest):
     
    result = generate_question(req.category, req.difficulty, req.topic)
    return {
        "category": req.category,
        "difficulty": req.difficulty,
        "text" : result["text"],
        "mode" : result["mode"],
    }
