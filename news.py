import requests
import re
import numpy as np
import pandas as pd

from bs4 import BeautifulSoup
from nltk.tokenize import sent_tokenize
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords

stwords = stopwords.words('english')


def get_news():
    page = requests.get('https://news.google.com/topics/CAAqBwgKMM-AmAswiqqvAw?hl=en-IN&gl=IN&ceid=IN%3Aen')
    soup = BeautifulSoup(page.content, 'html.parser')
    major = soup.find(class_="FVeGwb NLCVwf bWfURe")
    links = major.find_all(class_="ipQwMb ekueJc gEATFF RD0gLb")
    time = major.find_all(class_="SVJrMe gEAMFF")
    news_links = []
    news_text = []
    publisher = []
    hours = []
    datetime = []
    for i in range(len(links)):
        trial = links[i]
        text = trial.get_text()
        string = trial.find(class_="DY5T1d")['href']
        string = string[1:]
        news_link = "".join(('news.google.com', string))
        news_links.append(news_link)
        news_text.append(text)
    for i in range(len(time)):
        trial = time[i]
        string = trial.find(class_="WW6dff uQIVzc Sksgp").get_text()
        hours.append(string)
        string = trial.find(class_="WW6dff uQIVzc Sksgp")['datetime']
        datetime.append(string)
        string = trial.find(class_="wEwyrc AVN2gc uQIVzc Sksgp").get_text()
        publisher.append(string)
    dictionary = {'Links': news_links, 'Headlines': news_text, 'Publisher': publisher, 'Hours': hours,
                  'Datetime': datetime}
    df = pd.DataFrame(dictionary)
    df = df.sort_values(by='Datetime', ascending=False)
    df = df.reset_index(drop=True)
    return df


def remove_stopwords(s):
    sen_new = " ".join(i for i in s if i not in stwords)
    return sen_new


def clean_sent(s):
    sentences = []
    re.sub("([\(\[]).*?([\)\]])", "\g<1>\g<2>", s)

    sentences.append(sent_tokenize(s))
    sentences = [y for x in sentences for y in x]

    clean_sentences = pd.Series(sentences).str.replace("[^a-zA-Z]", " ")
    clean_sentences = [s.lower() for s in clean_sentences]
    clean_sentences = [remove_stopwords(r.split()) for r in clean_sentences]
    return clean_sentences


def clean_query(query):
    re.sub("([\(\[]).*?([\)\]])", "\g<1>\g<2>", query)
    query = query.replace("[^a-zA-Z]", " ")
    query = query.lower()
    # query = remove_stopwords(query)
    return query


def embeddings():
    word_embeddings = {}
    f = open('glove/glove.6B.200d.txt', encoding='utf8')
    for line in f:
        value = line.split()
        word = value[0]
        coefs = np.asarray(value[1:], dtype='float32')
        word_embeddings[word] = coefs
    f.close()
    return word_embeddings


def generate_embeddings(s, word_embeddings, df):
    abstract_vectors = []
    for j in range(0, df.shape[0]):
        clean_sentences = clean_sent(s[j])
        sentences_vectors = []
        for i in clean_sentences:
            if len(i) != 0:
                v = sum([word_embeddings.get(w, np.zeros((200,))) for w in i.split()]) / (len(i.split()) + 0.001)
            else:
                v = np.zeros((200,))
            sentences_vectors.append(v)
        abstract_vectors.append(sentences_vectors)
    return abstract_vectors


def cosine_sim(query, word_embeddings, abstract_vectors, df):
    cos_sim_abs = []

    query = clean_query(query)
    query_embed = sum([word_embeddings.get(w, np.zeros((200,))) for w in query.split()]) / (len(query.split()) + 0.001)

    for i in range(0, df.shape[0]):
        cos_sim_sent = 0
        for j in range(len(abstract_vectors[i])):
            sentence_vectors = abstract_vectors[i]
            cos_sim_sent += cosine_similarity(sentence_vectors[j].reshape(1, 200), query_embed.reshape(1, 200))[0, 0]
        cos_sim_sent /= len(abstract_vectors[i])
        cos_sim_abs.append(cos_sim_sent)

    df['Cosine'] = cos_sim_abs
    df = df.sort_values(by='Cosine', ascending=False)
    dataframe = df.head(10)
    return dataframe
