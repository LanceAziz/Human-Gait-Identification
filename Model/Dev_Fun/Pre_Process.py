from __future__ import division
import cv2
import numpy as np
from Dev_Fun.Cropping_Image import crop_to_person
from Dev_Fun.Silhouette_Extraction import makeSegMask

def pre_process(frame, width=240, height=320):
    flip = cv2.flip(frame, 1)

    sil = makeSegMask(flip)

    gray = cv2.cvtColor(sil, cv2.COLOR_BGR2GRAY)

    resize = cv2.resize(gray,(height,width))

    if np.all(resize == 0):
        crop = np.zeros((64, 44), dtype=np.uint8)
    else:
        crop = crop_to_person(resize)

    return(crop)