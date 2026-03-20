from fpdf import FPDF
import os

pdf = FPDF()
pdf.add_page()
pdf.set_font('helvetica', size=12)

resume_text = """John Doe
Software Engineer
Email: johndoe@example.com | Phone: 555-0100

SUMMARY
Enthusiastic and adaptable developer with a passion for back-end logic and simple web interfaces. Proven ability to communicate effectively and lead small project teams.

SKILLS
- Python (Intermediate)
- HTML/CSS (Intermediate)
- Communication (Advanced)
- Leadership (Intermediate)
- Problem Solving (Intermediate)

EXPERIENCE
Data processing Intern - TechCorp (2023 - 2024)
- Wrote various Python scripts to clean and process data.
- Built basic web pages using HTML/CSS.
- Presented technical reports to non-technical stakeholders (Communication).

EDUCATION
B.S. in Computer Science - University of Tech (2020 - 2024)
"""

for line in resume_text.split('\n'):
    pdf.cell(0, 10, txt=line, ln=True)

output_path = r"c:\Users\ozhad\OneDrive\Desktop\IISC_Hack\test_resume.pdf"
pdf.output(output_path)
print(f"Created {output_path}")
