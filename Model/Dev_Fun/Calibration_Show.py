from __future__ import division
import cv2
import mediapipe as mp
import numpy as np
from Dev_Fun.Silhouette_Extraction import sil_preprocess,makeSegMask
from Dev_Fun.Joints_Extraction import mediapipe_detection, draw_landmarks

mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities

def Calib_Show(feed):
    cap = cv2.VideoCapture(feed)
    fgbg = cv2.createBackgroundSubtractorKNN()
    # fgbg = cv2.createBackgroundSubtractorKNN(history=200, dist2Threshold=30)
    with  mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened(): 
            _, frame = cap.read()

            #Silhouette V1
            blurValue = 13
            binThreshold = 128

            binary_mask = sil_preprocess(frame,fgbg,blurValue,binThreshold)
            cv2.imshow('Gait ID (Silhouette V1)', binary_mask)

            #Silhouette V2
            sil = makeSegMask(frame)
            cv2.imshow('Gait ID (Silhouette V2)', sil)

            #RGB
            image, results = mediapipe_detection(frame, holistic)
            draw_landmarks(image, results)
            cv2.imshow('Gait ID (RBG)', image)
            
            if cv2.waitKey(10) & 0xFF == 27:
                break
        cap.release()
        cv2.destroyAllWindows()
        