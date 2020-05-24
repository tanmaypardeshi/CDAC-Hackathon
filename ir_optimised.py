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

def get_info(query):
    data=pd.read_csv('data/ir_optimised.csv')
    sent1=pre_processing(str(query))
    score_title=[]
    score_keywords=[]
    with open('data/keywords.txt', "rb") as fp:
        keywords_list = pickle.load(fp)
    for i in range(0,len(data)):
        ratios=process.extract(sent1,keywords_list[i])
        score_key=(ratios[0][1]+ratios[1][1])/2
        score_keywords.append(score_key)
        sent2=pre_processing(str(data['Title'][i]))
        score_title.append(fuzz.token_sort_ratio(str(sent1),str(sent2)))
    data['Score_Title']=score_title
    data['Score_Keywords']=score_keywords
    df1=data.loc[data['Score_Title']>=80]
    df2=data.sort_values(by='Score_Keywords',ascending=False)
    df2=df2.iloc[:20,:]
    df=pd.concat([df1,df2])
    return df

        
