# Unsupervised approach to label data - TextRank
import numpy as np
import pandas as pd
import networkx as nx
import re

from nltk.tokenize import sent_tokenize
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords


stop_words = stopwords.words('english')


def remove_stopwords(sen):
    sen_new = " ".join([i for i in sen if i not in stop_words])
    return sen_new


def create_summary(s):
    word_embeddings = {}
    f = open('./glove/glove.6B.200d.txt', encoding='utf-8')
    for line in f:
        values = line.split()
        word = values[0]
        coefs = np.asarray(values[1:], dtype='float32')
        word_embeddings[word] = coefs
    f.close()

    sentences = []  # Used for sentence tokenization

    re.sub("([\(\[]).*?([\)\]])", "\g<1>\g<2>", s)

    # Sentence Tokenization
    sentences.append(sent_tokenize(s))
    sentences = [y for x in sentences for y in x]

    # Pre-processing of data

    # Remove punctuations, numbers and special characters and lowercase
    clean_sentences = pd.Series(sentences).str.replace("[^a-zA-Z]", " ")
    clean_sentences = [s.lower() for s in clean_sentences]

    # Remove stopwords from the sentences
    clean_sentences = [remove_stopwords(r.split()) for r in clean_sentences]

    # Creation of sentence vectors using the Glove embeddings downloaded earlier Explanation: A vector of each word
    # of size 200 is created using the embeddings. Average of vectors for all such sentences is calculated to obtain
    # the sentence vector.
    sentence_vectors = []
    for i in clean_sentences:
        if len(i) != 0:
            v = sum([word_embeddings.get(w, np.zeros((200,))) for w in i.split()]) / (len(i.split()) + 0.001)
        else:
            v = np.zeros((200,))
        sentence_vectors.append(v)

    # Similarity matrix : similarity between the sentences is generated using the cosine similarity
    sim_mat = np.zeros([len(sentences), len(sentences)])  # Initialisation of similarity matrix

    for i in range(len(sentences)):
        for j in range(len(sentences)):
            if i != j:
                sim_mat[i][j] = \
                    cosine_similarity(sentence_vectors[i].reshape(1, 200), sentence_vectors[j].reshape(1, 200))[0, 0]

    # PageRank
    nx_graph = nx.from_numpy_array(sim_mat)  # Matrix converted to graph: v: sentences, e: cosine similarity
    scores = nx.pagerank(nx_graph)
    ranked_sentences = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)

    # Display of data
    string_list = []
    for i in range(int(0.2 * len(sentences))):
        string_list.append(ranked_sentences[i][1])
    final_summary = " ".join(string_list)

    return final_summary
