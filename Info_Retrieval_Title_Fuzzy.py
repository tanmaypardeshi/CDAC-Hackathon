import re
from fuzzywuzzy import fuzz
from gensim.parsing.preprocessing import remove_stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.stem import WordNetLemmatizer
import pandas as pd


def Preprocessor(text):
    new_sentence = ""
    complete_refined_text = ""
    refined_text = remove_stopwords(text)
    refined_text = refined_text.lower()
    return refined_text


def lemmatize_text(text):
    refined_sentences_list = []
    lemmatizer = WordNetLemmatizer()
    sentences = sent_tokenize(text)
    for i in range(len(sentences)):
        string = " "
        words = word_tokenize(sentences[i])
        words1 = [lemmatizer.lemmatize(word) for word in words]
        string = string.join(words1)
        refined_sentences_list.append(string)
    refined_text = " "
    return refined_text.join(refined_sentences_list)


def remove_special_chars(text):
    text = re.sub("([\(\[]).*?([\)\]])", "\g<1>\g<2>", text)
    text = re.sub(r'[^A-Za-z0-9]', " ", text)
    return text


def pre_processing(text):
    text = Preprocessor(text)
    text = remove_special_chars(text)
    text = lemmatize_text(text)
    return text


def similarity_score_title(query, data):
    score = []
    indices = []
    indices = data.index.values
    for i in range(len(data)):
        sent1 = pre_processing(str(query))
        sent2 = pre_processing(str(data['title'][indices[i]]))
        score.append(fuzz.token_sort_ratio(str(sent1), str(sent2)))
    data['similarity_score'] = score


def get_info_title(query):
    data = pd.read_csv('data/Info_Retrieval_Data.csv')
    similarity_score_title(query, data)
    df = data.sort_values(by='similarity_score', ascending=False)
    df = df.iloc[:20, :]
    return df
