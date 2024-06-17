from __future__ import division
import cv2
import mediapipe as mp
import numpy as np
import os
import winsound
from PIL import Image
from Dev_Fun.Calibration_Show import mediapipe_detection,draw_landmarks

mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities

def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
    return pose

def files_creation(persons,no_sequences,path):
    for person in persons:
        for sequence in range(no_sequences):
            try: 
                os.makedirs(os.path.join(path, person, str(sequence)))
            except:
                pass

def dataset_capture(persons,no_sequences,path,sequence_length,feed):
    cap = cv2.VideoCapture(feed)
    # Set mediapipe model 
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        
        # NEW LOOP
        # Loop through persons
        for person in persons:
            for sequence in range(no_sequences):
                for frame_num in range(sequence_length):

                    # Read feed
                    ret, frame = cap.read()

                    # Make detections
                    image, results = mediapipe_detection(frame, holistic)

                    # Draw landmarks
                    draw_landmarks(image, results)
                    
                    # NEW Apply wait logic
                    if frame_num == 0: 
                        cv2.putText(image, 'STARTING COLLECTION', (120,200), 
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0,255, 0), 1, cv2.LINE_AA)
                        cv2.putText(image, 'Collecting frames for {} Video, frame Number #{}#'.format(person, sequence), (15,12), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                        winsound.Beep(1000,1000)
                        cv2.waitKey(5000)
                        winsound.Beep(1000,500)
                        winsound.Beep(1000,500)
                    else: 
                        cv2.putText(image, 'Collecting frames for {} Video, frame Number #{}#'.format(person, sequence), (15,12), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)
                        
                    # NEW Export keypoints
                    keypoints = extract_keypoints(results)
                    png_path = f"{path}/{person}/{sequence}/{frame_num}"
                    img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB), 'RGB')
                    img.save(f'{png_path}.jpg')

                    
                    cv2.imshow('Gait ID', image)

                    # Break gracefully
                    if cv2.waitKey(10) & 0xFF == 27:
                        break
            if cv2.waitKey(10) & 0xFF == 27:
                continue
            else:
                break
                
        cap.release()
        cv2.destroyAllWindows()