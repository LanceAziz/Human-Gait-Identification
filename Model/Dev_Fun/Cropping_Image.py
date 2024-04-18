from __future__ import division
import cv2
import numpy as np

###############################################################################
# Function to crop silhouette images to the person
def crop_to_person(image, target_size=(64, 44)):
    
    # Threshold the image to get a binary image
    _, thresh = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
    
    # Find contours of non-zero pixels (silhouette)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Check if any contours are found
    if not contours:
        print("No silhouette found in the image.")
        return None
    
    # Find the largest contour (assuming it's the silhouette)
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Get bounding rectangle of the largest contour
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Check if bounding rectangle is valid
    if w == 0 or h == 0:
        print("Invalid bounding rectangle detected.")
        return None
    
    # Crop the image to the non-zero bounding rectangle
    cropped_image = thresh[y:y+h, x:x+w]
    
    # Find non-zero pixels in the cropped image to get actual content area
    non_zero_pixels = np.nonzero(cropped_image)
    
    # Minimum and maximum coordinates of non-zero pixels
    min_x, max_x = non_zero_pixels[1].min(), non_zero_pixels[1].max() + 1
    min_y, max_y = non_zero_pixels[0].min(), non_zero_pixels[0].max() + 1
    
    # Crop again to remove black borders based on non-zero content
    cropped_image = cropped_image[min_y:max_y, min_x:max_x]
    
    # Calculate the original aspect ratio
    original_aspect_ratio = float(cropped_image.shape[1]) / cropped_image.shape[0]
    
    # Determine the new width while maintaining aspect ratio to fit the height of 66 pixels
    new_width = int(target_size[0] * original_aspect_ratio)
    # Ensure the new width is less than or equal to 44 pixels
    new_width = min(new_width, target_size[1])
    
    # Resize the image to the desired height while maintaining aspect ratio
    resized_image = cv2.resize(cropped_image, (new_width, target_size[0]))
    
    # Add padding to the sides until the image width becomes 44 pixels
    left_pad = (target_size[1] - new_width) // 2
    right_pad = target_size[1] - new_width - left_pad
    
    # Create a new image with padding
    padded_image = cv2.copyMakeBorder(resized_image, 0, 0, left_pad, right_pad, cv2.BORDER_CONSTANT, value=0)
    
    return padded_image

   