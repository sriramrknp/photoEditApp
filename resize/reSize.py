import numpy as np
import sys
import io
import cv2

# Read image buffer from stdin
image_buffer = sys.stdin.buffer.read()

last_eight_bytes = image_buffer[-8:]
image_buffer = image_buffer[:-8]
last_four_bytes = last_eight_bytes[:4]
next_four_bytes = last_eight_bytes[4:]


# Read two integer inputs from stdin
x = int.from_bytes(last_four_bytes, byteorder='little')
y = int.from_bytes(next_four_bytes, byteorder='little')

if x <= 0 or y <= 0:
    sys.stderr.write("Error: Invalid input dimensions")
    sys.exit(1)


# Load image from buffer
# Read the image buffer into a NumPy array
image_buffer = np.frombuffer(image_buffer, np.uint8)

# Decode the array into an image
img = cv2.imdecode(image_buffer, cv2.IMREAD_COLOR)


size = (x,y)
image = cv2.resize(img, size)


# Encode the processed image as a buffer
retval, buffer = cv2.imencode('.jpg', image)

# Write the buffer to stdout
sys.stdout.buffer.write(buffer)