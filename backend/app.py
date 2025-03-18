from flask import Flask, jsonify, request
import asyncio
from flask_cors import CORS
from flask_caching import Cache
from documents import documents
from answers import *

app = Flask(__name__)
app.config["SECRET_KEY"] = "secretkey"
app.config["CACHE_TYPE"] = "SimpleCache"
app.config["CACHE_DEFAULT_TIMEOUT"] = 300
cache = Cache(app)
cache.set("questions", {})
CORS(app)

async def async_cache_get(key):
    try:
        await asyncio.sleep(2)  # Simula attesa per leggere dalla cache
        return cache.get(key)
    except Exception as e:
        print(f"Errore durante il recupero dalla cache: {e}")
        return None

async def async_cache_set(key, value):
    try:
        await asyncio.sleep(2)  # Simula attesa per scrivere nella cache
        cache[key] = value
    except Exception as e:
        print(f"Errore durante la scrittura nella cache: {e}")


async def extract_answer(query):
    try:
        answer = "Non ho capito... Prova a chiedermi qualcos'altro"
        questions_dict = await async_cache_get("questions")
        if questions_dict and isinstance(questions_dict, dict) and query in questions_dict:
            answer = questions_dict[query]
        elif query in questions_answers_dict:
            answer = questions_answers_dict[query]
            if questions_dict is None:
                questions_dict = {}
            questions_dict[query] = answer
            await async_cache_set("questions",questions_dict)
        return answer
    except Exception as e:
        print(f"Errore durante l'elaborazione della risposta: {e}")
        return "Si è verificato un errore nell'elaborazione della risposta."
    
@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"response": "Invalid parameters","cache":cache.get("questions")})
        query = data["query"]
        response = asyncio.run(extract_answer(query)) #Estrae la risposta dal dizionario di domande
        
        return jsonify({"response": response,"cache":cache.get("questions")})
    except Exception as e:
        print(f"Errore nel gestire la richiesta: {e}")
        return jsonify({"error": "Si è verificato un errore interno."}), 500
    
@app.route('/documents', methods=['GET'])
def get_documents():
    return jsonify({'response': documents})

# Personalizza il messaggio di errore per un metodo non consentito
@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({'response': 'Metodo non consentito'}), 405
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)