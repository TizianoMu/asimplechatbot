from flask import Flask, jsonify, request
import asyncio
from flask_cors import CORS
from flask_caching import Cache
from documents import documents
from answers import *

app = Flask(__name__)
app.config["SECRET_KEY"] = "any random string"
app.config["CACHE_TYPE"] = "SimpleCache"
app.config["CACHE_DEFAULT_TIMEOUT"] = 300
cache = Cache(app)
cache.set("questions", {})
CORS(app)

async def extract_answer(query):
    answer = "Non so come aiutarti."
    await asyncio.sleep(2)
    questions_dict = cache.get("questions")
    print(questions_dict)
    if questions_dict and isinstance(questions_dict, dict) and query in questions_dict:
        answer = questions_dict[query]
    elif query in questions_answers_dict:
        answer = questions_answers_dict[query]
        if questions_dict is None:
            questions_dict = {}
        questions_dict[query] = answer
        await asyncio.sleep(2)
        cache.set("questions",questions_dict)
    return answer

@app.route("/generate", methods=["POST"])
def generate():
    response = "Metodo non consentito"
    if request.method == "POST":
        data = request.get_json()
        query = data["query"]
        response = asyncio.run(extract_answer(query))
        return jsonify({"response": response,"cache":cache.get("questions")})
    else:
        return jsonify({"response": response})

@app.route('/documents', methods=['GET'])
def get_documents():
    if request.method == "GET":
        return jsonify({'response': documents})
    else:
        return jsonify({'response': 'Metodo non consentito'})
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)