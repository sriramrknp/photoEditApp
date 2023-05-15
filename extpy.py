import sys
from PIL import Image
import io
 
print("Hello python")
# Read the image file buffer from stdin
image_file_buffer = sys.stdin.buffer.read()

# Process the image file buffer
img = Image.open(io.BytesIO(image_file_buffer))
print("Hello python")
img = img.resize((500, 500))

# Write the processed image to stdout
img.save(sys.stdout.buffer, format='JPEG')
