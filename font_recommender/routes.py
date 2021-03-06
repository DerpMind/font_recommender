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
        font_list=functions.generate_font_selection(mode='exploration')[1]
        #generate_font_selection now returns a tuple, the second element being the indices
    ))
    # set_trace()
    return render_template("home.html", fonts = fonts)



@app.route("/closest-neighbors", methods = ['POST'])
def get_png_path():
	data = request.get_json()
	# print(data['font_name'])
	data_string = json.dumps(data['font_name'])

	font_id = functions.get_font_id(data_string)
	results, indices  = functions.generate_font_selection(font_id=font_id,mode='exploitation')
	
	functions.generate_sentences(indices)
	#results is the first element of the tuple that is returned from generate_font_selection, which is an array of path names
	# set_trace()
	return json.dumps({'font_names': results}) #this data gets sent over to client, which client.js handles




@app.route("/about")
def about():
    return render_template("about.html", title="About")