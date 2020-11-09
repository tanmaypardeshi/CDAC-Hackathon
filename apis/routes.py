from apis import app, bcrypt, db
from flask import jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, jwt_optional
import joblib
import os
from werkzeug.utils import secure_filename
import docx2txt
from .models import User, Summary, IRQuery, Qna

from ir_author import get_info_author
from ir_title import get_info_title
from summariser import create_summary
from news import get_news, cosine_sim, generate_embeddings, embeddings

UPLOAD_FOLDER = '/home/tanmay/clasp'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

word_embeddings = embeddings()
model = joblib.load('data/qna.joblib')


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
    abstract_vectors = []
    abstract_vectors = generate_embeddings(text, word_embeddings, data_frame)
    result = cosine_sim(query, word_embeddings, abstract_vectors, data_frame)
    result = result.drop(columns=['Datetime', 'Cosine'])
    l = []
    info = []
    objects = {}
    l = result.index.values
    for i in range(9):
        objects['Links'] = result['Links'][l[i]]
        objects['Headlines'] = result['Headlines'][l[i]]
        objects['Publisher'] = result['Publisher'][l[i]]
        objects['Hours'] = result['Hours'][l[i]]
        info.append(objects)
        objects = {}
    return jsonify({'data': info}), 200


@app.route("/api/upload", methods=['POST'])
@jwt_optional
def uploadfile():
    target = os.path.join(UPLOAD_FOLDER, 'folder')
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file']
    filename = secure_filename(file.filename)
    destination = '/'.join([target, filename])
    if destination[-4:] != 'docx':
        os.remove(target + '/' + filename)
        return jsonify({'error': '.docx file required!'}), 400
    file.save(destination)
    content = docx2txt.process(target + '/' + filename)
    new_content = create_summary(content)
    current_user = get_jwt_identity()
    try:
        summary = Summary(title=filename, summary=new_content, user_email=current_user['email'])
        db.session.add(summary)
        db.session.commit()
    except TypeError:
        pass
    os.remove(target + '/' + filename)
    return jsonify({'data': new_content}), 200


@app.route("/api/summarise", methods=['POST'])
@jwt_optional
def summarise():
    post_data = request.get_json()
    title = post_data['title']
    content = post_data['content']
    new_content = create_summary(content)
    current_user = get_jwt_identity()
    try:
        summary = Summary(title=title, summary=new_content, user_email=current_user['email'])
        db.session.add(summary)
        db.session.commit()
    except TypeError:
        pass
    return jsonify({'data': new_content}), 200


@app.route("/api/mysummaries", methods=['GET'])
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


@app.route("/api/remove_summary", methods=['POST'])
@jwt_required
def remove_summary():
    post_data = request.get_json()
    current_user = get_jwt_identity()
    email = current_user['email']
    title = post_data['title']
    try:
        query = Summary.query.filter_by(title=title, user_email=email).first()
        db.session.delete(query)
        db.session.commit()
        return jsonify({"status": 1}), 200
    except AttributeError:
        return jsonify({"status": 0}), 400


@app.route("/api/irquery", methods=['POST'])
@jwt_optional
def info_retrieval():
    post_data = request.get_json()
    query = post_data['query']
    filtertype = post_data['filter']
    try:
        current_user = get_jwt_identity()
        email = current_user['email']
    except TypeError:
        email = None
    if filtertype == 'Name':
        new_content = get_info_title(query)
        info = retrieve(new_content, email)
        return jsonify({'data': info}), 200

    new_content = get_info_author(query)
    info = retrieve(new_content, email)
    return jsonify({'data': info}), 200


def retrieve(new_content, email):
    l = []
    info = []
    objects = {}
    l = new_content.index.values
    for i in range(20):
        objects['is_bookmarked'] = False
        objects['title'] = new_content['title'][l[i]]
        try:
            try:
                if objects['title'] == IRQuery.query.filter_by(title=objects['title'], user_email=email).first().title:
                    objects['is_bookmarked'] = True
            except AttributeError:
                objects['is_bookmarked'] = False
        except UnboundLocalError:
            objects['is_bookmarked'] = False
        objects['content'] = new_content['abstract'][l[i]]
        objects['author_name'] = new_content['authors'][l[i]]
        objects['link'] = new_content['url'][l[i]]
        info.append(objects)
        objects = {}
    return info


@app.route("/api/bookmark", methods=['POST'])
@jwt_required
def bookmark():
    post_data = request.get_json()
    current_user = get_jwt_identity()
    title = post_data['title']
    content = post_data['content']
    author_name = post_data['author_name']
    link = post_data['link']
    irquery = IRQuery(title=title, content=content, author=author_name, link=link, user_email=current_user['email'])
    db.session.add(irquery)
    db.session.commit()
    return jsonify({'status': 1}), 200


@app.route("/api/remove_bookmark", methods=['POST'])
@jwt_required
def remove_bookmark():
    post_data = request.get_json()
    current_user = get_jwt_identity()
    email = current_user['email']
    title = post_data['title']
    try:
        query = IRQuery.query.filter_by(title=title, user_email=email).first()
        db.session.delete(query)
        db.session.commit()
        return jsonify({"status": 1}), 200
    except AttributeError:
        return jsonify({"status": 0}), 400


@app.route("/api/myqueries", methods=['GET'])
@jwt_required
def myqueries():
    current_user = get_jwt_identity()
    email = current_user['email']
    queries = IRQuery.query.filter_by(user_email=email).all()
    my_queries = []
    objects = {}
    for query in queries:
        objects['title'] = query.title
        objects['content'] = query.content
        objects['author_name'] = query.author
        objects['link'] = query.link
        my_queries.append(objects)
        objects = {}
    return jsonify({'mysummaries': my_queries}), 200


@app.route("/api/qna", methods=['POST'])
@jwt_required
def qna():
    post_data = request.get_json()
    current_user = get_jwt_identity()
    question = post_data['question']
    answer = model.predict(question)
    data = {
        'question': question,
        'title': answer[1],
        'answer': answer[0],
        'paragraph': answer[2]
    }
    qa = Qna(question=question, title=answer[1], answer=answer[0], paragraph=answer[2],
             user_email=current_user['email'])
    db.session.add(qa)
    db.session.commit()
    return jsonify({'data': data}), 200


@app.route("/api/myqna", methods=['GET'])
@jwt_required
def myqna():
    current_user = get_jwt_identity()
    email = current_user['email']
    qnas = Qna.query.filter_by(user_email=email).all()
    myqnas = []
    objects = {}
    for qna in qnas:
        objects['question'] = qna.question
        objects['title'] = qna.answer
        objects['answer'] = qna.title
        objects['paragraph'] = qna.paragraph
        myqnas.append(objects)
        objects = {}
    return jsonify({'mysummaries': myqnas}), 200


@app.route("/api/remove_qna", methods=['POST'])
@jwt_required
def remove_qna():
    post_data = request.get_json()
    current_user = get_jwt_identity()
    email = current_user['email']
    question = post_data['question']
    try:
        query = Qna.query.filter_by(question=question, user_email=email).first()
        db.session.delete(query)
        db.session.commit()
        return jsonify({"status": 1}), 200
    except AttributeError:
        return jsonify({"status": 0}), 400
