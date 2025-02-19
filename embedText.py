import json
import ollama
from ollama import Client

client = Client(
  host='http://10.18.101.96:11434',
)


def embed(text: str):
    print('running chunk')
    embedding=  client.embeddings(model='nomic-embed-text', prompt=text)
    return embedding.embedding

def split_text_into_chunks(file_path, num_chunks=200):
    with open(file_path, 'r', encoding='utf-8') as file:
        words = file.read().split()
    
    total_words = len(words)
    chunk_size = total_words // num_chunks
    remainder = total_words % num_chunks
    
    chunks = []
    start = 0
    for i in range(num_chunks):
        extra = 1 if i < remainder else 0  # Distribute remainder words evenly
        end = start + chunk_size + extra
        chunks.append(" ".join(words[start:end]))
        start = end
    
    return chunks

def main():
    file_path = 'RA Manual 2024.txt'  # Change this to your text file path
    output_path = 'RAManual_output.json'  # Change this to your output file path
    
    chunks = split_text_into_chunks(file_path)
    embedded_chunks = [{f"chunk_{i+1}": embed(chunk), "text": chunks[i]} for i, chunk in enumerate(chunks)]
    
    with open(output_path, 'w', encoding='utf-8') as outfile:
        dump = json.dump(embedded_chunks, outfile, indent=4)
        outfile.write(dump)

if __name__ == "__main__":
    main()
