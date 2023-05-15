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

#greyscale filter
def greyscale(img):
    greyscale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return greyscale

#making the greyscale image
gray = greyscale(image)

# Encode the processed image as a buffer
retval, buffer = cv2.imencode('.jpg', gray)

# Write the buffer to stdout
sys.stdout.buffer.write(buffer)
