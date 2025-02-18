import nltk
import gensim.downloader as api 
import numpy as np
from nltk.tokenize import word_tokenize

nltk.download('punkt')
model = api.load("word2vec-google-news-300")
def embed(text: str, model):
    words = word_tokenize(text)
    vectors = [model[word] for word in words if word in model]
    if vectors:
        return np.mean(vectors, axis=0).tolist()
    return None
 
def create_chunks(text: str):
    chunk_size = 200
    