import fuzzywuzzy
import pandas as pd 
import nltk
import re
from fuzzywuzzy import fuzz
import gensim
from gensim.parsing.preprocessing import remove_stopwords
from nltk.tokenize import sent_tokenize,word_tokenize
from nltk.stem import WordNetLemmatizer
from gensim.models.doc2vec import Doc2Vec,TaggedDocument
from gensim.models import doc2vec


chunks=pd.read_csv('Text_Summ_Data.csv',chunksize=1500)
data=pd.concat(chunks)
data=data.loc[data.title.notnull()]
data=data.reset_index(drop=True)
texts=data['text']
data=data.drop(['text'],axis=1)

def Preprocessor(text):
    new_sentence=""
    complete_refined_text=""
    refined_text = remove_stopwords(text)
    refined_text=refined_text.lower()
    return refined_text


def lemmatize_text(text):
    refined_sentences_list=[]
    lemmatizer=WordNetLemmatizer()
    sentences=sent_tokenize(text)
    for i in range(len(sentences)):
        string=" "
        words=word_tokenize(sentences[i])
        words1=[lemmatizer.lemmatize(word) for word in words]
        string=string.join(words1)
        refined_sentences_list.append(string)
    refined_text=" "
    return (refined_text.join(refined_sentences_list))        


def remove_special_chars(text):
    text=re.sub("([\(\[]).*?([\)\]])", "\g<1>\g<2>", text)
    text=re.sub(r'[^A-Za-z0-9]'," ",text)
    return text


def pre_processing(text):
    text=Preprocessor(text)
    text=remove_special_chars(text)
    text=lemmatize_text(text)
    return text



def similarity_score_title(query,data):
    score=[]
    for i in range(len(data)):
        sent1=pre_processing(str(query))
        sent2=pre_processing(str(data['title'][i]))
        score.append(fuzz.token_sort_ratio(str(sent1),str(sent2)))
    data['score']=score


def get_info_title(query,data):
    similarity_score_title(query,data)
    df=data.loc[data['score']>=80]
    return df


df=get_info_title(query,data)
texts[df.index.values[0]]     #Pass this to the summarizer function
