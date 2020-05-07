from flask import jsonify, request
from apis import app
from flask_cors import cross_origin
from Summariser import create_summary


@app.route("/summarise", methods=['POST'])
@cross_origin()
def summarise():
    post_data = request.get_json()
    title = post_data['title']
    content = post_data['content']
    new_content = create_summary(content)
    summary = new_content.replace('\n', '')
    return jsonify({'data': summary}), 200
