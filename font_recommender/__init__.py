from flask import Flask

#create an instance of the Flask class
app = Flask(__name__)

from font_recommender import routes
