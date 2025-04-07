from flask import Flask, jsonify, request
import os
import asyncio
from flask_cors import CORS
from flask_caching import Cache
from documents import documents
from answers import *
from google import genai
from google.genai import types

# Inizializza il client Gemini
client = genai.Client(api_key=os.environ.get('GOOGLE_GEMINI_API_KEY',"MY_API_KEY"))

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY","")
app.config["CACHE_TYPE"] = os.environ.get("CACHE_TYPE","")
app.config["CACHE_DEFAULT_TIMEOUT"] = int(os.environ.get("CACHE_DEFAULT_TIMEOUT","300"))
cache = Cache(app)
cache.set("questions", {})
CORS(app)

async def async_cache_get(key):
    try:
        return cache.get(key)
    except Exception as e:
        print(f"Errore durante il recupero dalla cache: {e}")
        return None

async def async_cache_set(key, value):
    try:
        cache.set(key, value)
    except Exception as e:
        print(f"Errore durante la scrittura nella cache: {e}")

async def generate_gemini_response(query):
    try:
        contents = [
            types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Come ti chiami?"""),
            ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(text="""Sono un modello linguistico di grandi dimensioni, addestrato da Google."""),
                ],
            ),
            types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""A meno che non ti vengano chiesti dettagli esaustivi evita di dare risposte troppo lunghe"""),
            ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(text="""Ok, cercherò di essere conciso"""),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text="""Adesso ti passerò un dizionario python di domande e risposte e tu le salverai. Se ti chiedono cosa sai sulle barche rispondi in maniera non troppo esaustiva magari indicando un paio di argomenti da questo dizionario. Da oggi ti chiamerai ChatBoat.""" + str(questions_answers_dict)),
                ],
            ),
            types.Content(
                role="model",
                parts=[
                    types.Part.from_text(text="""Okay, ho salvato il dizionario di domande e risposte. D'ora in poi mi chiamerò ChatBoat e userò queste informazioni per rispondere alle tue domande sulle barche e per conversare. Sono pronto! Chiedimi pure!
                    """),
                ],
            ),
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(text=query),
                ],
            ),
        ]
        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=contents
        )
        if response.text:
            return response.text
        else:
            return "Il modello non ha fornito una risposta."
    except Exception as e:
        print(f"Errore durante la chiamata a Gemini: {e}")
        return "Si è verificato un errore durante la comunicazione con il modello AI."

async def extract_answer(query):
    try:
        answer = None
        questions_dict = await async_cache_get("questions")

        # Controlla la cache
        if questions_dict and isinstance(questions_dict, dict) and query in questions_dict:
            answer = questions_dict[query]
            print(f"Risposta trovata nella cache per: {query}")
            return answer
        
        # Se non trovata, chiama il modello Gemini
        else:
            print(f"Nessuna risposta in cache o predefinita per: {query}. Interpellando Gemini...")
            answer = await generate_gemini_response(query)
            # Salva la risposta di Gemini nella cache
            if questions_dict is None:
                questions_dict = {}
            questions_dict[query] = answer
            await async_cache_set("questions", questions_dict)
            return answer

    except Exception as e:
        print(f"Errore durante l'elaborazione della risposta: {e}")
        return "Si è verificato un errore nell'elaborazione della risposta."

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"response": "Invalid parameters", "cache": cache.get("questions")})
        query = data["query"]
        response = asyncio.run(extract_answer(query)) # Estrae la risposta (dalla cache, predefinita o Gemini)

        return jsonify({"response": response, "cache": cache.get("questions")})
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