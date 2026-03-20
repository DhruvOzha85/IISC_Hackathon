import json
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

app = FastAPI(title="AI-Adaptive Onboarding Engine API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Mock Course Catalog
with open("mock_course_catalog.json", "r") as f:
    COURSE_CATALOG = json.load(f)

@app.get("/")
def read_root():
    return {"message": "AI-Adaptive Onboarding API is running"}

from engine import extract_text_from_pdf, parse_skills, generate_learning_path
import os
from dotenv import load_dotenv

load_dotenv()

@app.post("/api/parse-and-map")
async def parse_and_map(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    try:
        pdf_bytes = await resume.read()
        resume_text = extract_text_from_pdf(pdf_bytes)
        
        existing, required = parse_skills(resume_text, job_description)
        gap, roadmap = generate_learning_path(existing, required, COURSE_CATALOG)
        
        return {
            "existing_skills": existing,
            "required_skills": required,
            "skill_gap": gap,
            "roadmap": roadmap
        }
    except Exception as e:
        return {"error": str(e)}
