from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = './Uploaded Files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/post/predictions', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(success=False, message="No file part in the request")
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify(success=False, message="No selected file")
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    print(f'File saved to {file_path}')
    return jsonify(success=True, message="File successfully uploaded")

if __name__ == "__main__":
    app.run(debug=True, port=8080)
