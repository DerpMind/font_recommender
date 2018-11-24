from font_recommender import app, functions
from flask import render_template, request, json
from pdb import set_trace


fonts = functions.picture_paths() #refactor picture_paths()
# set_trace()
# a "route" is what we type into our browser to go to different pages
# @... this is a route "decorator"
# decorators add additional functionality to a function
@app.route("/")
def home():
    print(functions.generate_sentences(
        font_list=functions.generate_font_selection(mode='exploitation')
    ))
    # set_trace()
    return render_template("home.html", fonts = fonts)

# @app.route("/")
# def home():
#     print(functions.generate_sentences(
#         font_list=[10, 11, 12, 13, 14]))
#     return render_template("home.html", fonts = fonts)

@app.route("/closest-neighbors", methods = ['POST'])
def get_png_path():
	data = request.get_json()
	# print(data['font_name'])
	data_string = json.dumps(data['font_name'])
	
	return data_string



@app.route("/about")
def about():
    return render_template("about.html", title="About")