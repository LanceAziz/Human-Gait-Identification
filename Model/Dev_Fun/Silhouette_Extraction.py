from __future__ import division
import cv2
import torch
import torch.nn.functional as F
from torchvision import transforms

#Silhouette V1
def sil_preprocess(frame,fgbg,blurValue,binThreshold):

    # Background Subtraction
    silhouette = fgbg.apply(frame)

    # Noise Reduction
    blur = cv2.medianBlur(silhouette, blurValue)

    # Binarization
    _, binary_mask = cv2.threshold(blur, binThreshold, 255, cv2.THRESH_BINARY)

    # Find contours in the binary mask
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Initialize bounding box coordinates
    x, y, w, h = 0, 0, 0, 0

    # Iterate through contours to find the bounding box of the largest contour
    for contour in contours:
        x_, y_, w_, h_ = cv2.boundingRect(contour)
        if w_ * h_ > w * h:  # Update bounding box if current contour is larger
            x, y, w, h = x_, y_, w_, h_

    # Crop the silhouette image using the bounding box
    roi = frame[y:y+h, x:x+w]

    # Resize the ROI to (64x44)
    roi = cv2.resize(roi, (64, 44))

    return roi

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

#Silhouette V2
def makeSegMask(img):
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
	
	_,thresh = cv2.threshold(res,127,255,cv2.THRESH_BINARY)

	return thresh