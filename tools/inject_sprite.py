
import os

html_path = r'w:\glitch-city\bundled.html'
base64_path = r'w:\glitch-city\fragment_base64_utf8.txt'

if not os.path.exists(html_path) or not os.path.exists(base64_path):
    print("Error: Files not found.")
    exit(1)

with open(base64_path, 'r', encoding='utf-8') as f:
    base64_content = f.read().strip()

with open(html_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

insertion_index = -1
for i, line in enumerate(lines):
    if "const PLAYER_SPRITE_SRC =" in line:
        insertion_index = i
        break

if insertion_index == -1:
    # Fallback: Look for <script> start
    for i, line in enumerate(lines):
        if "<script>" in line:
            insertion_index = i + 1
            break

if insertion_index != -1:
    new_line = f"        const FRAGMENT_SPRITE_SRC = 'data:image/png;base64,{base64_content}';\n"
    lines.insert(insertion_index, new_line)
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Successfully injected FRAGMENT_SPRITE_SRC.")
else:
    print("Error: Could not find insertion point.")
