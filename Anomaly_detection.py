import pandas as pd
import numpy as np 
import seaborn as sns
import matplotlib.pyplot as plt
import keplergl
import statistics 


data=pd.read_csv('Anomaly_Detection_Data.csv')    #Data Created by the publically available WHO Data
data_lat=pd.read_csv('/home/harsh/Downloads/countries.csv')  #Latitude and Longitude Data

def findMinDiff(arr, n):  
    diff = 10**20
      
    for i in range(n-1): 
        for j in range(i+1,n): 
            if abs(arr[i]-arr[j]) < diff: 
                diff = abs(arr[i] - arr[j]) 
   
    return diff 


countries=data_lat['name']
countries_data=set(data['Country Name'])

countries_legit=[]
for i in range(len(countries)):
    if(countries[i] in countries_data):
        countries_legit.append(countries[i])



threshold=[]
for country in countries_legit:
    list1=data.loc[data['Country Name']==country]['Value']
    list1=list1.to_list()
    threshold.append(statistics.median(list1)+findMinDiff(list1,len(list1)))

dictionary_legit_countries=dict(zip(countries_legit, threshold)) 

rows_removal=[]
for i in range(len(data)):
    if(data['Country Name'][i] not in countries_legit):
        rows_removal.append(data['Country Name'][i])


rows_removal=set(rows_removal)
rows_removal=list(rows_removal)

threshold_removal=[]
for country in rows_removal:
    list1=data.loc[data['Country Name']==country]['Value']
    list1=list1.to_list()
    threshold_removal.append(statistics.median(list1)+findMinDiff(list1,len(list1)))

dictionary_removal_countries=dict(zip(rows_removal, threshold_removal)) 



def merge_two_dicts(x, y):
    z = x.copy()   # start with x's keys and values
    z.update(y)    # modifies z with y's keys and values & returns None
    return z
threshold_dict=merge_two_dicts(dictionary_legit_countries,dictionary_removal_countries)


list_lat=[]
for country in countries_legit:
    list2=[]
    x=data_lat.loc[data_lat['name']==country].index.values[0]
    list2.append(data_lat['latitude'][x])
    list2.append(data_lat['longitude'][x])
    list_lat.append(list2)
    
list_lat_rem=[[-26.5225,31.4659],
             [14.0583,108.2772],
             [16.5388,-23.0418],
             [-4.0383,21.7587],
             [-16.2902,-63.5887],
             [41.6086,21.7453],
             [47.4116,28.3699],
             [4.5353,114.7277],
             [0.1864,6.6131],
             [-4.0383,21.7587],
             [7.5400,-5.5471],
             [-6.3690,34.8888],
             [61.5240,105.3188],
             [7.4256,150.5508],
             [37.0902,-95.7129],
             [19.8563,102.4955],
             [6.4238,-66.5897],
             [6.8770,31.3070],
             [21.9162,95.9560],
             [35.9078,127.7669]]

lat_lon_dict1=dict(zip(countries_legit, list_lat))
lat_lon_dict2=dict(zip(rows_removal, list_lat_rem))
lat_lon_dict=merge_two_dicts(lat_lon_dict1,lat_lon_dict2)


latitude=[]
longitude=[]
threshold=[]
for i in range(len(data)):
    threshold.append(threshold_dict[data['Country Name'][i]])
    latitude.append(lat_lon_dict[data['Country Name'][i]][0])
    longitude.append(lat_lon_dict[data['Country Name'][i]][1])


data['Latitude']=latitude
data['Longitude']=longitude
data['Threshold']=threshold


#Using this data 18 csv files were created year wise


#Example to make a map for a particular year

df=pd.read_csv('df2009.csv')

sign=[]
for i in range(len(df)):
    if((df['Threshold'][i]-df['Value'][i])>-0.2):
        sign.append(1)
    else:
        sign.append(0)


df['Sign']=sign

latitude_layer=[]
longitude_layer=[]
latitude=41.377491
longitude=64.585262
for i in range(len(df)):
    if(df['Sign'][i]==1):
        latitude_layer.append(latitude)
        longitude_layer.append(longitude)
    else:
        latitude_layer.append(df['Latitude'][i])
        longitude_layer.append(df['Longitude'][i])

df['Latitude_Layer']=latitude_layer
df['Longitude_Layer']=longitude_layer


from keplergl import KeplerGl
import geopandas as gpd
map_1 = KeplerGl(height=500)
#df=pd.read_csv('df2001.csv')
df['Longitude']=pd.to_numeric(df['Longitude'])
df['Latitude']=pd.to_numeric(df['Latitude'])
gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.Longitude, df.Latitude))
map_1.add_data(data=gdf)


map_1.save_to_html(file_name='dark2009.html')



