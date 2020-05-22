#!/usr/bin/env python
# coding: utf-8

# In[ ]:


#Installing the essential libraries
get_ipython().system('pip install cdqa')

#Pandas has to be reinstalled since cdqa requires a different version of pandas compared to our requirement
conda update --force-reinstall pandas


import pandas as pd
import joblib
from ast import literal_eval

from cdqa.utils.filters import filter_paragraphs
from cdqa.utils.download import download_model, download_bnpp_data
from cdqa.pipeline.cdqa_sklearn import QAPipeline

#Downloading the model required for cdqa from the releases
download_model(model='bert-squad_1.1', dir='./models')

#This dataset comprises of the title and text of articles related to covid-19, retrieved from CORD 19
df = pd.read_csv('/kaggle/input/dataset.csv', converters={'paragraphs': literal_eval})
df = filter_paragraphs(df)

#QA pipeline created using the downloaded model as the reader
cdqa_pipeline = QAPipeline(reader='models/bert_qa.joblib')

#finetunes the model and fits the retriever to the dataset
cdqa_pipeline.fit_retriever(df)

#To check the accurate results by prediction.
query = 'How contagious is coronavirus?'
prediction = cdqa_pipeline.predict(query)
#printing the results
print('query: {}\n'.format(query))
print('answer: {}\n'.format(prediction[0]))
print('title: {}\n'.format(prediction[1]))
print('paragraph: {}\n'.format(prediction[2]))


#To save the model
cdqa_pipeline.dump_reader('models/bert_qa_finetune.joblib')

#To use the model again:
pip install joblib

#load model
finetune_x = joblib.load('bert_qa_finetune2.joblib')

#take query from user and predict using model, change variable names
query = 'What is coronavirus?'
prediction = finetune_x.predict(query)

