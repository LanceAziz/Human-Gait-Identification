from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
import cv2
import numpy as np
import keras
from collections import Counter
from Dev_Fun.Pre_Process import pre_process
from Dev_Fun.Predict import final_pred

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a secure secret key
socketio = SocketIO(app, cors_allowed_origins='*')

UPLOAD_FOLDER = './Uploaded Files'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model_path = './Models/train_55_6.h5'
model = keras.models.load_model(model_path)

subjects = np.array([f"{i:03d}" for i in range(1, 125)])

names = {
    "119": "Lance Moheb",
    "120": "Seif Ibrahim",
    "121": "Mina Nady",
    "122": "Omar Amin",
    "123": "Mohmed Youssef",
    "124": "Hamza Tharwat"
}

@socketio.on('connect')
def test_connect():
    print('Client connected')

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')

@socketio.on('start_live_stream')
def handle_start_live_stream():
    print('Starting live stream')
    emit('live_stream_status', {'status': 'Streaming started'})
    live_stream()

def live_stream():
    cap = cv2.VideoCapture(0)  # Change to appropriate video device if needed

    while True:
        ret, frame = cap.read()

        if not ret:
            print("End of video.")
            break

        frame_queue.append(frame)  # Add frame to the queue

        # Make initial prediction when we have the first 30 frames
        if len(frame_queue) == 30:
            initial_prediction()

        # Make subsequent predictions every 15 frames
        if len(frame_queue) > 30 and len(frame_queue) % 15 == 0:
            predict_frames()

        cv2.imshow('Live Stream', frame)

        if cv2.waitKey(10) & 0xFF == 27:  # ESC key to exit
            break

    cap.release()
    cv2.destroyAllWindows()

def initial_prediction():
    global frame_queue

    # Convert deque to list for processing
    frame_list = list(frame_queue)[:30]

    # Perform initial prediction using the first 30 frames
    initial_predictions = final_pred(frame_list, model, names, subjects)

    # Emit initial predictions to the client
    socketio.emit('live_predictions', {'predictions': initial_predictions})

def predict_frames():
    global frame_queue

    # Convert deque to list for processing
    frame_list = list(frame_queue)[-15:]

    # Perform prediction using the last 15 frames
    predictions = final_pred(frame_list, model, names, subjects)

    # Emit predictions to the client
    socketio.emit('live_predictions', {'predictions': predictions})

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8080)
