from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from Dev_Fun.Predict import final_pred
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = './Uploaded Files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

cred = credentials.Certificate('./firebase.json')
firebase_admin.initialize_app(cred)
db = firestore.client()



@app.route('/get/predictions', methods=['GET'])
def show_data():
    predictions_ref = db.collection('predictions').order_by('date', direction='DESCENDING')
    all_predictions = predictions_ref.stream()
    predictions_list = []

    for prediction in all_predictions:
        prediction_data = prediction.to_dict()
        predictions_list.append(prediction_data)

    return jsonify(success=True, predictions=predictions_list)


@app.route('/post/predictions', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(success=False, message="No file part in the request")
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify(success=False, message="No selected file")
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    name = final_pred(file_path,'./Models/train_55_6.h5')
    globalTimeSort = datetime.now(timezone.utc)

    data = {
        'name':name,
        'date':globalTimeSort
    }
    
    doc_ref = db.collection('predictions').document()
    doc_ref.set(data)

    return jsonify(success=True, message=name)

if __name__ == "__main__":
    app.run(debug=True, port=8080)


# lancooooos