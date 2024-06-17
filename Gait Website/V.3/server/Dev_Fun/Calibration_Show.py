from __future__ import division
import cv2
import mediapipe as mp
from Dev_Fun.Pre_Process import sil_V1,sil_V2

mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False                  # image is no longer writeable
    results = model.process(image)                 # Make prediction
    image.flags.writeable = True                   # image is now writeable 
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR COVERSION RGB 2 BGR
    return image, results

def draw_landmarks(image, results):
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS) # Draw pose connections

def Calib_Show(feed = 0):

    cap = cv2.VideoCapture(feed)
    # fgbg = cv2.createBackgroundSubtractorKNN(history=200, dist2Threshold=30)
    with  mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened(): 
            _, frame = cap.read()

            #Silhouette V1
            binary_mask = sil_V1(frame)
            cv2.imshow('Gait ID (Silhouette V1)', binary_mask)

            #Silhouette V2
            sil = sil_V2(frame)
            cv2.imshow('Gait ID (Silhouette V2)', sil)

            #RGB
            image, results = mediapipe_detection(frame, holistic)
            draw_landmarks(image, results)
            cv2.imshow('Gait ID (RBG)', image)
            
            if cv2.waitKey(10) & 0xFF == 27:
                break
        cap.release()
        cv2.destroyAllWindows()
        