from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS

app = Flask(__name__, static_folder='./build', static_url_path='')

data = {
    "message": "Hello from Flask!",
}

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/test', methods=['GET'])
def get_data():
    return jsonify(data)

if __name__ == '__main__':
    app.run(use_reloader=True, debug=True)
