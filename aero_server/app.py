from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)


@app.route("/analysis", methods = ['POST'])
def analysis():
    content = request.json
    return content