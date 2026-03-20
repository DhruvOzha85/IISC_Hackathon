import os
import json
import io
from pydantic import BaseModel, Field
from typing import List, Optional
from google import genai
from google.genai import types
from pypdf import PdfReader

# Ensure you set GEMINI_API_KEY in your environment or .env file

class Skill(BaseModel):
    name: str = Field(description="The name of the skill")
    level: str = Field(description="The proficiency level required or possessed (e.g. Beginner, Intermediate, Advanced)")

class Profile(BaseModel):
    skills: list[Skill]

class PathwayStep(BaseModel):
    step: int
    course_id: str
    title: str
    reasoning_trace: str

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    return text

def parse_skills(resume_text: str, jd_text: str) -> tuple[list[dict], list[dict]]:
    client = genai.Client() # Uses GEMINI_API_KEY from environment
    
    prompt = f"""
    You are an expert technical recruiter and AI assistant. 
    Analyze the following Resume and Job Description.
    Extract the list of skills possessed by the candidate (from the Resume) and the list of skills required by the job (from the JD).
    For each skill, determine the proficiency level as 'Beginner', 'Intermediate', or 'Advanced'.
    
    Resume:
    {resume_text}
    
    Job Description:
    {jd_text}
    """
    
    # We will perform two calls to ensure clear schemas, or one call with a combined schema.
    # Let's use a combined schema approach. We'll use the prompt above but we'll parse it separately or together.
    # For robust parsing with Pydantic:
    class CombinedExtraction(BaseModel):
        existing_skills: list[Skill]
        required_skills: list[Skill]
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CombinedExtraction,
                temperature=0.1,
            ),
        )
        
        data = json.loads(response.text)
        return data.get("existing_skills", []), data.get("required_skills", [])
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        raise Exception(f"Failed to generate analysis using Gemini API. Error: {e}")

def generate_learning_path(existing_skills: list[dict], required_skills: list[dict], catalog: dict) -> tuple[list[str], list[dict]]:
    # Step 1: Detect Skill Gap
    # Simple logic: if a required skill name is not in existing skills, it's a gap.
    # We can also compare levels (e.g. required Advanced but has Beginner).
    
    # Normalize names for comparison
    existing_map = {s["name"].lower(): s for s in existing_skills}
    gap_skills = []
    
    level_values = {"Beginner": 1, "Intermediate": 2, "Advanced": 3}
    
    for req in required_skills:
        req_name = req["name"]
        req_norm = req_name.lower()
        req_lvl = level_values.get(req["level"], 1)
        
        if req_norm not in existing_map:
            gap_skills.append(req_name)
        else:
            ext_lvl = level_values.get(existing_map[req_norm].get("level", "Beginner"), 1)
            if ext_lvl < req_lvl:
                gap_skills.append(req_name)
                
    # Step 2: Map to Course Catalog
    roadmap = []
    step_counter = 1
    
    # A simple matching algorithm:
    # For each gap skill, find a course in the catalog that covers this skill.
    # If multiple, prefer the one with matching level, else just pick the first.
    completed_courses = set()
    
    for g_skill in gap_skills:
        g_skill_norm = g_skill.lower()
        matched_course = None
        
        for course in catalog.get("courses", []):
            if course["id"] in completed_courses: continue
            
            # Check if course covers the skill
            covers = any(g_skill_norm in s.lower() for s in course["skills_covered"])
            if covers:
                matched_course = course
                break
                
        if matched_course:
            reasoning = f"Recommended '{matched_course['title']}' because JD requires '{g_skill}' which is missing or needs improvement based on your Resume."
            roadmap.append({
                "step": step_counter,
                "course_id": matched_course["id"],
                "title": matched_course["title"],
                "reasoning_trace": reasoning,
                "duration": matched_course["duration"]
            })
            completed_courses.add(matched_course["id"])
            step_counter += 1
            
    return gap_skills, roadmap
