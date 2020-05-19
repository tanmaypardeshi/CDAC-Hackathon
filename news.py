import pandas as pd 
import requests
from bs4 import BeautifulSoup

def get_news():
    page=requests.get('https://news.google.com/topics/CAAqBwgKMM-AmAswiqqvAw?hl=en-IN&gl=IN&ceid=IN%3Aen')
    soup=BeautifulSoup(page.content,'html.parser')
    major=soup.find(class_="FVeGwb NLCVwf bWfURe")
    links=major.find_all(class_="ipQwMb ekueJc gEATFF RD0gLb")
    time=major.find_all(class_="SVJrMe gEAMFF")
    news_links=[]
    news_text=[]
    publisher=[]
    hours=[]
    datetime=[]
    for i in range(len(links)):
        trial=links[i]
        text=trial.get_text()
        string=trial.find(class_="DY5T1d")['href']
        string=string[1:]
        news_link="".join(('news.google.com',string))
        news_links.append(news_link)
        news_text.append(text)
    for i in range(len(time)):
        trial=time[i]
        string=trial.find(class_="WW6dff uQIVzc Sksgp").get_text()
        hours.append(string)
        string=trial.find(class_="WW6dff uQIVzc Sksgp")['datetime']
        datetime.append(string)
        string=trial.find(class_="wEwyrc AVN2gc uQIVzc Sksgp").get_text()
        publisher.append(string)
    dictionary={'Links':news_links,'Headlines':news_text,'Publisher':publisher,'Hours':hours,'Datetime':datetime}
    df=pd.DataFrame(dictionary)
    return df
