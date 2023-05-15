import numpy as np
import sys
import cv2
import io
import math as mt

# Read image buffer from stdin
image_buffer = sys.stdin.buffer.read()

last_four_bytes = image_buffer[-4:]
image_buffer = image_buffer[:-4]
last_four_bytes = last_four_bytes[:4]


def bilinear_interp(img, scale):
    heigh = int(img.shape[1] * scale)
    width = int(img.shape[0] * scale)
    
    new_img = np.zeros((heigh, width))
    
    for i in range(heigh):
        for j in range(width):
            # new point in old img
            x = i * h_scale_f
            y = j * v_scale_f
    
    # four nearest points
    x1, y1 = int(mt.floor(x)), int(mt.floor(y))
    x1, y2 = int(mt.floor(x)), int(mt.ceil(y))
    x2, y1 = int(mt.ceil(x)), int(mt.floor(y))
    x2, y2 = int(mt.ceil(x)), int(mt.ceil(y))
    # areas
    a1 = abs(x - x1) * abs(y - y1)
    a2 = abs(x - x1) * abs(y - y2)
    a3 = abs(x - x2) * abs(y - y1)
    a4 = abs(x - x2) * abs(y - y2)
    
    new_pixel = (a1 * img[x2][y2]) + (a2 * img[x2][y1]) + \
        (a3 * img[x1][y2]) + (a4 * img[x1][y1])
    new_img[i][j] = new_pixel
    if x1 == x2 and y1 == y1:
        new_img[i][j] = img[x1][y1]
    elif x1 == x2:
        new_img[i][j] = img[x1][y1] * abs(y - y2) + img[x1][y2] * abs(y - y1)
    elif y1 == y2:
        new_img[i][j] = img[x1][y1] * abs(x - x2) + img[x2][y2] * abs(x - x1)
    return new_img



# Read two integer inputs from stdin
scaleFac = int.from_bytes(last_four_bytes, byteorder='little')


if scaleFac <= 0:
    sys.stderr.write("Error: Invalid input dimensions")
    sys.exit(1)

# Load image from buffer
# Read the image buffer into a NumPy array
image_buffer = np.frombuffer(image_buffer, np.uint8)

# Decode the array into an image
img = cv2.imdecode(image_buffer, cv2.IMREAD_COLOR)


global h_scale_f, v_scale_f


scale = scaleFac
h_scale_f = (img.shape[0] - 1) / ((img.shape[0] * scale) - 1)
v_scale_f = (img.shape[1] - 1) / ((img.shape[1] * scale) - 1)
new_img = bilinear_interp(img, scale)


# Encode the processed image as a buffer
retval, buffer = cv2.imencode('.jpg', image)

# Write the buffer to stdout
sys.stdout.buffer.write(buffer)
