from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    message = data['message']

    response = f"Risposta dell'AI per: {message}"

    return jsonify({'response': response})
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)