import json
import shutil
import nltk
import gensim.downloader as api 
import numpy as np
from nltk.tokenize import word_tokenize

nltk.download('punkt')
nltk.download('punkt_tab')
model = api.load("word2vec-google-news-300")

def embed(text: str, model):
    words = word_tokenize(text)
    vectors = [model[word] for word in words if word in model]
    if vectors:
        return np.mean(vectors, axis=0).tolist()
    return None
 
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
    file_path = 'Crimson_2024-25.txt'  # Change this to your text file path
    output_path = 'Crimson_Output.json'  # Change this to your output file path
    
    chunks = split_text_into_chunks(file_path)
    embedded_chunks = [{f"chunk_{i+1}": embed(chunk, model), "text": chunks[i]} for i, chunk in enumerate(chunks)]
    
    with open(output_path, 'w', encoding='utf-8') as outfile:
        dump = json.dump(embedded_chunks, outfile, indent=4)
        outfile.write(dump)

if __name__ == "__main__":
    main()
