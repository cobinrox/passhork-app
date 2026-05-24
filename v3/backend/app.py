from flask import Flask, request, jsonify
from flask_cors import CORS
from logic.generator import generate_password
from logic.scorer import score_ergonomics
from logic.complexity import check_complexity

app = Flask(__name__)
CORS(app)

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.json or {}
    phrase = data.get('phrase')
    length = data.get('length', 15)
    
    result = generate_password(phrase, length)
    password = result['password']
    
    ergo_score = score_ergonomics(password)
    complexity = check_complexity(password)
    
    return jsonify({
        'password': password,
        'original': result['phrase'],
        'ergoScore': ergo_score,
        'complexity': complexity
    })

@app.route('/api/validate', methods=['POST'])
def validate():
    data = request.json or {}
    password = data.get('password', '')
    
    ergo_score = score_ergonomics(password)
    complexity = check_complexity(password)
    
    return jsonify({
        'ergoScore': ergo_score,
        'complexity': complexity
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
