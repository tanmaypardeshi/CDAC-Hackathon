from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
CORS(app)
cors = CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})



from apis import routes