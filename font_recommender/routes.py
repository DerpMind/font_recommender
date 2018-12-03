from font_recommender import app, functions
from flask import render_template

fonts = functions.picture_paths()

# a "route" is what we type into our browser to go to different pages
# @... this is a route "decorator"
# decorators add additional functionality to a function
@app.route("/")
def home():
    print(functions.generate_sentences(
        font_list=functions.generate_font_selection()
    ))
    return render_template("home.html", fonts = fonts)

@app.route("/about")
def about():
    return render_template("about.html", title="About")