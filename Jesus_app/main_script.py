from Jesus_app import app
from Jesus_app.functions import name_to_path, path_to_name, generate_font_selection
from flask import Flask, request, render_template, jsonify
import numpy as np, pandas as pd

font_list = pd.read_csv("Jesus_app/static/images/font_infos.csv", index_col=0).iloc[:,0]
font_paths = np.array([("static/images/fonts/" +
                        name_to_path(item)) for item in font_list])
distance_matrix = pd.read_csv("Jesus_app/static/images/distance_matrix.csv",index_col=0)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/neighbors')
def neighbors(max_distance=0):
    clicked_font = path_to_name(request.args.get('clicked_font'))
    idx = font_list[font_list == clicked_font].index[0]

    idx_top5 = generate_font_selection(idx,
                                        font_list=font_list,
                                        distance_matrix=distance_matrix,
                                        max_distance=max_distance)[0]

    idx = np.random.randint(4400, size=5)

    result = {'top5':font_paths[idx_top5].tolist(), 'random5':font_paths[idx].tolist()}

    # your result is here a Python dictionary with two keys (links and scores), and the corresponding values are lists.
    # when you pass it to the frontend, it will be a javascript object that you can manipulate there:
    return jsonify(result)

@app.route('/initial')
def initial():
    # initial list of 10 fonts
    idx = np.random.randint(4400, size=5)
    print(font_paths[idx])
    result = font_paths[idx].tolist() # I have to change the numpy to list because Object of type 'ndarray' is not JSON serializable

    return jsonify(result)


