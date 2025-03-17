from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from documents import documents
from answers import *

app = Flask(__name__)
app.config["SECRET_KEY"] = "any random string"
app.config["CACHE_TYPE"] = "SimpleCache"
app.config["CACHE_DEFAULT_TIMEOUT"] = 300
cache = Cache(app)
cache.set("questions", {

})
CORS(app)

def extract_answer(query):
    answer = 'Non so come aiutarti'
    if query in questions_answers_dict.keys():
        answer = questions_answers_dict[query]
    questions = cache.get('questions')
    questions[query] = answer
    cache.set('questions',questions)
    return answer

@app.route('/generate', methods=['POST'])
def generate():
    response = 'Metodo non consentito'
    if request.method == "POST":
        data = request.get_json()
        query = data['query']

        questions_dict = cache.get("questions")
        #Viene controllato che la risposta sia già in cache
        response = questions_dict[query] if query in questions_dict.keys() else extract_answer(query)
        return jsonify({'response': response})
    else:
        return jsonify({'response': response})

@app.route('/documents', methods=['GET'])
def get_documents():
    if request.method == "GET":
        return jsonify({'response': documents})
    else:
        return jsonify({'response': 'Metodo non consentito'})
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)