import pandas as pd

from flask import jsonify, request
from apis import app, bcrypt, db
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from .models import User, Summary

from Info_Retrieval_Title_Fuzzy import get_info_abstract
from Info_Retrieval_Author_Fuzzy import get_info
from Info_Ret_Opt import get_info_title
from Summariser import create_summary
from Real_Time_Research_News import get_news


@app.route("/api/register", methods=['POST'])
def register():
    user_data = request.get_json()
    email = user_data['email']
    name = user_data['name']
    password = bcrypt.generate_password_hash(user_data['password']).decode('utf-8')
    profession = user_data['profession']
    if not email:
        return jsonify({'error': 'Missing email'}), 400
    if not name:
        return jsonify({'error': 'Missing name'}), 400
    if not password:
        return jsonify({'error': 'Missing password'}), 400
    if not profession:
        return jsonify({'error': 'Missing profession'}), 400

    try:
        user = User(email=email, name=name, profession=profession, password=password)
        db.session.add(user)
        db.session.commit()
        token = create_access_token(identity={'name': name, 'email': email})
        data = {
            'token': token,
            'email': email,
            'name': name,
            'profession': profession,
        }
        return jsonify({'data': data}), 200
    except:
        return jsonify({'error': 'User already exists'}), 401


@app.route("/api/login", methods=['POST'])
def login():
    user_data = request.get_json()
    email = user_data['email']
    password = user_data['password']
    if not email:
        return jsonify({'error': 'Missing email'}), 400
    if not password:
        return jsonify({'error': 'Missing password'}), 400
    try:
        object_data = User.query.filter_by(email=email).first()
        check_password = object_data.password
        if bcrypt.check_password_hash(check_password, password):
            token = create_access_token(identity={'name': object_data.name, 'email': object_data.email})
            data = {
                'token': token,
                'email': object_data.email,
                'name': object_data.name,
                'profession': object_data.profession,
            }
            return jsonify({'data': data}), 200
        return jsonify({'error': 'Password is wrong'}), 401
    except:
        return jsonify({'error': 'User does not exist'}), 401


@app.route("/api/news", methods=['GET'])
def news():
    data_frame = get_news()
    data_frame = data_frame.drop(columns=['Datetime'])
    info = []
    objects = {}
    for i in range(data_frame.shape[0]):
        objects['Headlines'] = data_frame['Headlines'][i]
        objects['Publisher'] = data_frame['Publisher'][i]
        objects['Links'] = data_frame['Links'][i]
        objects['Hours'] = data_frame['Hours'][i]
        info.append(objects)
        objects = {}
    return jsonify({'data': info}), 200


@app.route("/api/postnews", methods=['POST'])
def postnews():
    post_data = request.get_json()
    query = post_data['headline']
    data_frame = get_news()
    text = data_frame['Headlines']
    text = text.tolist()
    abstract_vectors = generate_embeddings(text, word_embeddings, data_frame)
    result = cosine_sim(query, word_embeddings, abstract_vectors, data_frame)
    result = result.drop(columns=['Datetime', 'Cosine'])
    l = []
    info = []
    objects = {}
    l = result.index.values
    for i in range(10):
        objects['Links'] = result['Links'][l[i]]
        objects['Headlines'] = result['Headlines'][l[i]]
        objects['Publisher'] = result['Publisher'][l[i]]
        objects['Hours'] = result['Hours'][l[i]]
        info.append(objects)
        objects = {}
    return jsonify({'data': info}),200 200                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     

@app.route("/api/summarise", methods=['POST'])
@cross_origin()
def summarise():
    post_data = request.get_json()
    email = post_data['email']
    title = post_data['title']
    content = post_data['content']
    new_content = create_summary(content)
    if email != "":
        summary = Summary(title=title, summary=new_content, user_email=email)
        db.session.add(summary)
        db.session.commit()
    return jsonify({'data': new_content}), 200


@app.route("/api/irquery", methods=['POST'])
@cross_origin()
def info_retrieval():
    post_data = request.get_json()
    query = post_data['query']
    filtertype = post_data['filter']
    if filtertype == 'Name':
        new_content = get_info_title(query)
        l = []
        info = []
        objects = {}
        l = new_content.index.values
        for i in range(20):
            objects['title'] = new_content['Title'][l[i]]
            objects['content'] = new_content['Abstract'][l[i]]
            objects['author_name'] = new_content['Authors'][l[i]]
            objects['link'] = new_content['URL'][l[i]]
            info.append(objects)
            objects = {}
        return jsonify({'data': info}), 200
    new_content = get_info(query)
    new_content = new_content.drop(columns=['Unnamed: 0', 'publish_time', 'similarity_score'])
    l = []
    info = []
    objects = {}
    l = new_content.index.values
    for i in range(20):
        objects['title'] = new_content['title'][l[i]]
        objects['content'] = new_content['abstract'][l[i]]
        objects['author_name'] = new_content['authors'][l[i]]
        objects['link'] = new_content['url'][l[i]]
        info.append(objects)
        objects = {}
    return jsonify({'data': info}), 200


@app.route('/api/mysummaries', methods=['GET'])
@jwt_required
def mysummaries():
    current_user = get_jwt_identity()
    email = current_user['email']
    summaries = Summary.query.filter_by(user_email=email).all()
    my_summaries = []
    objects = {}
    for summary in summaries:
        objects['title'] = summary.title
        objects['summary'] = summary.summary
        my_summaries.append(objects)
        objects = {}
    return jsonify({'mysummaries': my_summaries})
