from flask import Flask, request, jsonify, render_template
from google import genai
import os

from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)

# Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json["message"]

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_message
    )

    return jsonify({"reply": response.text})


if __name__ == "__main__":
    app.run(debug=True)