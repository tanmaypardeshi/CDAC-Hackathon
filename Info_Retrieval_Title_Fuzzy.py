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
from fuzzywuzzy import process


#data=pd.read_csv('Info_Retrieval_Legit_Data.csv')
#with open("keywords_lits.txt", "rb") as fp:   # Unpickling
    #keywords_list = pickle.load(fp)

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
        sent2=pre_processing(str(data['Title'][i]))
        score.append(fuzz.token_sort_ratio(str(sent1),str(sent2)))
    data['score']=score


def get_info_title(query,data):
    similarity_score_title(query,data)
    df=data.loc[data['score']>=80]
    return df


def similarity_score_abstract(query,keywords_list):  
    scores=[]
    for j in range(len(keywords_list)):
        ratios=process.extract(pre_processing(query),keywords_list[j])
        score=(ratios[0][1]+ratios[1][1])/2
        scores.append(score)
    data['score']=scores


def get_info_abstract(query,keywords_list,data):
    similarity_score_abstract(query,keywords_list)
    df=data.sort_values(by='score',ascending=False)
    df=df.iloc[:20,:]
    df=pd.concat([get_info_title(query,data),df])
    return df











