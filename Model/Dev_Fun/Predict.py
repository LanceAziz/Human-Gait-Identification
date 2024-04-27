from __future__ import print_function
import cv2
import numpy as np
import mediapipe as mp
import keras
from collections import Counter
from Dev_Fun.Calibration_Show import mediapipe_detection, draw_landmarks
from Dev_Fun.Pre_Process import pre_process

def pred_show(feed, model, names, subjects):
    sequence = []
    predictions = []

    mp_holistic = mp.solutions.holistic # Holistic model
    mp_drawing = mp.solutions.drawing_utils # Drawing utilities

    cap = cv2.VideoCapture(feed)
    with  mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened(): 
            ret, frame = cap.read()

            if not ret:
                print("End of video.")
                break

            #RGB
            image, results = mediapipe_detection(frame, holistic)
            draw_landmarks(image, results)
            

            #Silhouette V2
            sil = pre_process(frame)
            if np.all(sil == 0):
                if len(sequence) == 30:
                    break
                print("not pushed")
            else:
                sequence.append(sil)
                cv2.imshow('Gait ID (RBG)', image)
                cv2.imshow('Gait ID (Silhouette V2)', sil)

            sequence = sequence[-30:]
            if len(sequence) == 30:
                res = model.predict(np.expand_dims(sequence, axis=0))[0]
                if subjects[np.argmax(res)] in names:
                    print(names[str(subjects[np.argmax(res)])])
                    predictions.append(names[str(subjects[np.argmax(res)])])
                else:
                    print(subjects[np.argmax(res)])
                    print("##########< Unknown identity >##########")
                
            if cv2.waitKey(10) & 0xFF == 27:
                break
        cap.release()
        cv2.destroyAllWindows()
    return predictions

def high_prob(predictions):

    # Count the occurrences of each element
    counts = Counter(predictions)

    # Find the most common element
    most_common_element, count = counts.most_common(1)[0]

    percentage = (count / len(predictions)) * 100

    print("predictions array:", predictions)
    print("The most repeated element is:", most_common_element, "\nPercentage: ",percentage)

    return most_common_element

def final_pred(video,model_path):

    model = keras.models.load_model(model_path)

    subjects = np.array([f"{i:03d}" for i in range(1, 125)])

    names = {
    "119" : "Lance Moheb",
    "120" : "Seif Ibrahim",
    "121" : "Mina Nady",
    "122" : "Omar Amin",
    "123" : "Mohmed Youssef",
    "124" : "Hamza Tharwat"
    }

    finalPred = pred_show(video,model,names,subjects)
    name = high_prob(finalPred)
    print (name)