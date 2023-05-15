import numpy as np
import sys
import cv2
import io

# Read image buffer from stdin
image_buffer = sys.stdin.buffer.read()

last_four_bytes = image_buffer[-4:]
image_buffer = image_buffer[:-4]
last_four_bytes = last_four_bytes[:4]


def rotateImage(image, angle):
    shape = image.shape
    row, col = shape[0], shape[1]
    center = tuple(np.array([row, col])/2)
    rot_mat = cv2.getRotationMatrix2D(center, angle, 1.0)
    new_image = cv2.warpAffine(image, rot_mat, (col, row))
    return new_image

# Read two integer inputs from stdin
angle = int.from_bytes(last_four_bytes, byteorder='little')


if angle <= 0:
    sys.stderr.write("Error: Invalid input dimensions")
    sys.exit(1)

# Load image from buffer
# Read the image buffer into a NumPy array
image_buffer = np.frombuffer(image_buffer, np.uint8)

# Decode the array into an image
img = cv2.imdecode(image_buffer, cv2.IMREAD_COLOR)


image = rotateImage(img, angle)


# Encode the processed image as a buffer
retval, buffer = cv2.imencode('.jpg', image)

# Write the buffer to stdout
sys.stdout.buffer.write(buffer)
