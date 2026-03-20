from engine import parse_skills
import traceback
from dotenv import load_dotenv

load_dotenv()

try:
    print("Testing parse_skills...")
    ext, req = parse_skills("resume python", "jd python react")
    print(ext, req)
except Exception as e:
    traceback.print_exc()
