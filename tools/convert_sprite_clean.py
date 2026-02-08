
import base64
import os

file_path = r'w:\glitch-city\assets\stability_fragment.png'

if not os.path.exists(file_path):
    print(f"Error: File not found at {file_path}")
else:
    with open(file_path, "rb") as image_file:
        encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
        print(encoded_string)
