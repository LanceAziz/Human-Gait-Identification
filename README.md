# Human Gait Recognition

## Overview
This project is a human gait recognition system that uses deep learning to detect and recognize individuals based on their walking patterns. The system is built with Next.js for the front-end, Flask for the back-end, and Firebase as the database. A Convolutional Neural Network (CNN) model, developed by myself, is utilized to perform the gait recognition.

## Dataset

### Global Dataset
We obtained the following datasets by contacting the respective administrators:
1. [CASIA-B Dataset](http://www.cbsr.ia.ac.cn/english/Gait%20Databases.asp) - Provided by the Institute of Automation, Chinese Academy of Sciences.
2. [OU-MVLP Dataset](http://www.am.sanken.osaka-u.ac.jp/BiometricDB/GaitMVLP.html) - Provided by the Osaka University.

### Custom Dataset
We created a custom dataset with the following specifications:
- **Resolution**: 640 × 480
- **Frame Rate**: 30 frames per second
- **Field of View**: Should not contain moving objects, except for the walking individual.
- **Illumination**: Uniformly illuminated by sunlight or artificial light with minimal fluctuation.
- **Trajectory**: Person walks non-frontally, perpendicular to the camera lens, from edge to edge of the field of view.
- **Clothing**: Legs should be visible and not obscured by clothing. Items carried near the legs (like bags or suitcases) are not allowed.
- **Distance**: Person’s height should occupy 50% – 80% of the frame height.

## Libraries Used

### Front-End
1. Next jS
2. Bootstrap
3. Font Awesome
4. Swiper
5. Sharp
6. React Player

### Back-End

#### AI Packages
1. OpenCV
2. Numpy
3. MediaPipe
4. Pytorch (torch, torchvision)
5. Tensorflow
6. Keras

#### Non-AI Packages
1. Flask (flask, flask-cors)
2. Firebase Admin

## Preprocessing
We combined the CASIA-B dataset with our custom dataset, resulting in a total of 130 subjects. Each subject has 11 views, with each view containing 10 videos. Each video averages 40 frames which get captured by the implemenation in next section [`dataset_capture` function)](https://github.com/LanceAziz/Human-Gait-Identification/tree/main?tab=readme-ov-file#developed-functions) , but we only used the 90-degree view for training the model. Human silhouettes were extracted from each frame using a pre-trained model from [this repo](https://github.com/jordankzf/human-silhouette-extractor) whcih is implemented in next section [`sil_V2` function)](https://github.com/LanceAziz/Human-Gait-Identification/tree/main?tab=readme-ov-file#developed-functions) then cropped using a custom code whcih is implemented in next section [`crop_to_person` function](https://github.com/LanceAziz/Human-Gait-Identification/tree/main?tab=readme-ov-file#developed-functions).

## Developed Functions

1. **Calibration_Show.py**
   - `Calib_Show(feed=0)`: Used to calibrate before capturing dataset

2. **Dataset_Capture.py**
   - `dataset_capture(persons, no_sequences, path, sequence_length, feed)`: Used to capture dataset with the specified parameters or any others

3. **Pre_Process.py**
   - `sil_V1(frame, fgbg=cv2.createBackgroundSubtractorKNN(), blurValue=13, binThreshold=128)`: Version one of the background subtraction (not very good)
   - `sil_V2(img)`: Version two of the background subtraction (Perfect but time and resource-consuming)
   - `crop_to_person(image, target_size=(64, 44))`: Crops the frame to fit the subject in place and resize it to the given size
   - `pre_process(frame, width=240, height=320)`: Applies all the pre-processing needed to match CASIA-B dataset

4. **Predict.py**
   - `pred_show(feed, model, names, subjects)`: Applies prediction
   - `high_prob(predictions)`: Decides which subject has the highest probability of being correct
   - `final_pred(video, model_path)`: Applies all preprocessing needed

## Model Parameters
- **Model**: CNN
- **Activation Function**: ReLU
- **Convolution Layers**: 3 layers (32, 64, 128)
- **Optimizer**: Adam
- **Kernel Size**: 3x3
- **Output Layers**: Softmax
- **Pooling Layers**: 3 pooling layers (2x2)
- **Batch Size**: 32
- **Fully Connected Layers**: 2 layers (128, 256)
- **Epochs**: 200
- **Metric**: Accuracy
- **Prediction Accuracy**: 90.9% - 98.6%

## References
For more details and access to the project files, please visit the following link:
- [Papers](https://drive.google.com/drive/folders/1gg3QxzGaEgoNfJHqdIfawpqWiyNAnPIG?usp=sharing)
- [Project Presentation](https://docs.google.com/presentation/d/1OnKiwiAxGaU0qXdyUYWUnzbNxZa1q-avD-DjpoMIrT8/edit?usp=sharing)
- [Prject Documentation](https://docs.google.com/document/d/1_24qzsbDrQGXjzNLKJijXmUYFotNcfmQXKVJIIzbKDE/edit?usp=drive_link)
