import sys
import cv2
import io
import numpy as np

# Read image buffer from stdin
image_buffer = sys.stdin.buffer.read()

# Load image from buffer
# Read the image buffer into a NumPy array
image_buffer = np.frombuffer(image_buffer, np.uint8)

# Decode the array into an image
image = cv2.imdecode(image_buffer, cv2.IMREAD_COLOR)

#sharp effect
def sharpen(img):
    kernel = np.array([[-1, -1, -1], [-1, 9.5, -1], [-1, -1, -1]])
    img_sharpen = cv2.filter2D(img, -1, kernel)
    return img_sharpen


#making the sharp image
a4 = sharpen(image)

# Encode the processed image as a buffer
retval, buffer = cv2.imencode('.jpg', a4)

# Write the buffer to stdout
sys.stdout.buffer.write(buffer)
