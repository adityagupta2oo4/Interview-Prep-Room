import os  #to interact with environment variables
from question_bank import get_random_question

USE_LLM = bool(os.getenv("OPENAI_API_KEY"))  # Check if the OPENAI_API_KEY environment variable is set

def generate_question(category: str, difficulty: str, topic: str | None = None) -> dict:
    
    if USE_LLM:
        try:
            return {"text" : _generate_with_llm(category, difficulty, topic), "mode" : "llm"}
        except Exception as exc:
            print(f"[generator] llm call failed, falling back to bank: {exc}")

    return {"text" : get_random_question(category,difficulty,topic), "mode" : "bank"}

def _generate_with_llm(category: str, difficulty: str, topic: str | None = None) -> str:
    from openai import OpenAI # imported lazily so it's not a hard dependency
    
    client = OpenAI()
    subject = "a data structure and algorithm" if category == "dsa" else "a behavioral / HR"
    topic_hint = f" focused on {topic}" if topic else ""
    
    prompt = (
        f"Write one {difficulty}-difficulty {subject} interview question{topic_hint}."
        "Return only the question text, without any preamble or numbering."
    )
    
    response = client.chat.completions.create(
        model = "gpt-4o-mini",
        messages = [{"role" : "user", "content": prompt}],
        max_tokens = 100,
        temperature = 0.9, #temperature controls how random or creative the model's responses are.
    )
    
    return response.choices[0].message.content.strip()