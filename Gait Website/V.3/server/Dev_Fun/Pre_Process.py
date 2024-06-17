from __future__ import division
import cv2
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import transforms
import time

# Load pretrained model
model = torch.hub.load('pytorch/vision:v0.6.0', 'deeplabv3_resnet101', pretrained=True)
# Segment people only for the purpose of human silhouette extraction
people_class = 15

# Evaluate model
model.eval()
print ("Model has been loaded.")

blur = torch.FloatTensor([[[[1.0, 2.0, 1.0],[2.0, 4.0, 2.0],[1.0, 2.0, 1.0]]]]) / 16.0

# Use GPU if supported, for better performance
if torch.cuda.is_available():
	model.to('cuda')
	blur = blur.to('cuda')

# Apply preprocessing (normalization)
preprocess = transforms.Compose([
	transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Load pretrained model
model = torch.hub.load('pytorch/vision:v0.6.0', 'deeplabv3_resnet101', pretrained=True)
# Segment people only for the purpose of human silhouette extraction
people_class = 15

# Evaluate model
model.eval()
print ("Model has been loaded.")

blur = torch.FloatTensor([[[[1.0, 2.0, 1.0],[2.0, 4.0, 2.0],[1.0, 2.0, 1.0]]]]) / 16.0

# Use GPU if supported, for better performance
if torch.cuda.is_available():
	model.to('cuda')
	blur = blur.to('cuda')
	
# Apply preprocessing (normalization)
preprocess = transforms.Compose([
	transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

def sil_V1(frame,fgbg = cv2.createBackgroundSubtractorKNN(),blurValue = 13,binThreshold=128):

    # Background Subtraction
    silhouette = fgbg.apply(frame)

    # Noise Reduction
    blur = cv2.medianBlur(silhouette, blurValue)

    # Binarization
    _, binary_mask = cv2.threshold(blur, binThreshold, 255, cv2.THRESH_BINARY)

    return binary_mask

# Function to create segmentation mask
def sil_V2(img):
    # Scale input frame
	frame_data = torch.FloatTensor( img ) / 255.0

	input_tensor = preprocess(frame_data.permute(2, 0, 1))
    
    # Create mini-batch to be used by the model
	input_batch = input_tensor.unsqueeze(0)

    # Use GPU if supported, for better performance
	if torch.cuda.is_available():
		input_batch = input_batch.to('cuda')

	with torch.no_grad():
		output = model(input_batch)['out'][0]

	segmentation = output.argmax(0)

	bgOut = output[0:1][:][:]
	a = (1.0 - F.relu(torch.tanh(bgOut * 0.30 - 1.0))).pow(0.5) * 2.0

	people = segmentation.eq( torch.ones_like(segmentation).long().fill_(people_class) ).float()

	people.unsqueeze_(0).unsqueeze_(0)
	
	for i in range(3):
		people = F.conv2d(people, blur, stride=1, padding=1)

	# Activation function to combine masks - F.hardtanh(a * b)
	combined_mask = F.relu(F.hardtanh(a * (people.squeeze().pow(1.5)) ))
	combined_mask = combined_mask.expand(1, 3, -1, -1)

	res = (combined_mask * 255.0).cpu().squeeze().byte().permute(1, 2, 0).numpy()

	return res

if __name__ == '__main__':
    # Loads video file into CV2
    video = cv2.VideoCapture('3_cropped.avi')
    
    # Get video file's dimensions
    frame_width = int(video.get(3))
    frame_height = int(video.get(4))
    
    # Creates output video file
    out = cv2.VideoWriter('3_fcn.avi',cv2.VideoWriter_fourcc('M','J','P','G'), 30, (frame_width,frame_height))

    prev_frame_time = 0
    new_frame_time = 0

    while (video.isOpened):
        # Read each frame one by one
        success, img = video.read()
        
        # Run if there are still frames left
        if (success):
            
            # Apply background subtraction to extract foreground (silhouette)
            mask = sil_V2(img)
            
            # Apply thresholding to convert mask to binary map
            ret,thresh = cv2.threshold(mask,127,255,cv2.THRESH_BINARY)
            
            # Write processed frame to output file
            out.write(thresh)
            
            new_frame_time = time.time()
            fps = 1/(new_frame_time-prev_frame_time)
            prev_frame_time = new_frame_time 
            fps = str(fps)
            print(fps)
            # cv2.rectangle(mask, (10, 2), (100,20), (255,255,255), -1)
            # cv2.putText(mask, fps, (15, 15), cv2.FONT_HERSHEY_SIMPLEX, 0.5 , (0,0,0))
            
            # Show extracted silhouette only, by multiplying mask and input frame
            final = cv2.bitwise_and(thresh, img)
            
            # Show current frame
            cv2.imshow('Silhouette Mask', mask)
            cv2.imshow('Extracted Silhouette', final)
            
            # Allow early termination with Esc key
            key = cv2.waitKey(10)
            if key == 27:
                break
        # Break when there are no more frames  
        else:
            break

    # Release resources
    cv2.destroyAllWindows()
    video.release()
    out.release()

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


def pre_process(frame, width=240, height=320):
    flip = cv2.flip(frame, 1)

    sil = sil_V2(flip)

    gray = cv2.cvtColor(sil, cv2.COLOR_BGR2GRAY)

    resize = cv2.resize(gray,(height,width))

    if np.all(resize == 0):
        crop = np.zeros((64, 44), dtype=np.uint8)
    else:
        crop = crop_to_person(resize)

    return(crop)