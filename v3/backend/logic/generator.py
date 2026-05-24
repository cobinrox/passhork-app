import os
import random
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Pre-cached phrases for fallback or offline-like mode
FALLBACK_PHRASES = [
    {"phrase": "To be or not to be", "password": "ToBe@Not2Be!"},
    {"phrase": "Actions speak louder", "password": "Act!onsSp34k!"},
    {"phrase": "Look before you leap", "password": "LookB4@Leap!"},
    {"phrase": "Here comes the sun", "password": "H3r3@c8mesSun!"},
    {"phrase": "Stay hungry stay foolish", "password": "Stay+Hungry5!"},
    {"phrase": "May the force be with you", "password": "May+theF8rce@"},
    {"phrase": "Live laugh love", "password": "L!v3@LaughL8ve"},
    {"phrase": "Time is money", "password": "T!me@IsM8n3y$"},
    {"phrase": "Knowledge is power", "password": "Kn8wledge!sPwr"},
    {"phrase": "Practice makes perfect", "password": "Pr@ct!ceM@kes+"}
]

GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    model = None

def generate_password(user_phrase=None, target_length=15):
    if not model or not user_phrase:
        # Return a random fallback if no model or no input phrase
        # (In a real app, if user_phrase is provided but model is down, we'd transform it manually)
        return random.choice(FALLBACK_PHRASES)

    prompt = f"""
    Generate a memorable password from this phrase: "{user_phrase}"
    
    Rules:
    - Target length: {target_length} characters (14-16 is acceptable).
    - Must include: uppercase, lowercase, number, and one special char: !@#$%&*+-()
    - Maintain recognizability of the phrase.
    - Avoid visually confusing characters: 0, O, 1, l, I.
    - Optimize for QWERTY hand alternation.
    
    Return ONLY the password and nothing else.
    """
    
    try:
        response = model.generate_content(prompt)
        password = response.text.strip()
        # Basic cleanup in case Gemini adds markdown or quotes
        password = password.replace('`', '').replace('"', '').replace("'", "")
        return {
            "phrase": user_phrase,
            "password": password
        }
    except Exception as e:
        print(f"Gemini error: {e}")
        return random.choice(FALLBACK_PHRASES)
