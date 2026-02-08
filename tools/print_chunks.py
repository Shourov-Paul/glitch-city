
file_path = r'w:\glitch-city\fragment_base64.txt'
with open(file_path, 'r') as f:
    content = f.read()
    for i in range(0, len(content), 500):
        print(content[i:i+500])
