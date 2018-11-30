from Jesus_app import app
from Jesus_app.functions import name_to_path, path_to_name, generate_trial_font_selection
from flask import Flask, request, render_template, jsonify, g
import numpy as np, pandas as pd

font_list = pd.read_csv("Jesus_app/static/images/font_infos.csv", index_col=0).iloc[:,0]
font_paths = np.array([("static/images/fonts/" +
                        name_to_path(item)) for item in font_list])
distance_matrix = pd.read_csv("Jesus_app/static/images/distance_matrix.csv",index_col=0)
google_list = pd.read_csv('Jesus_app/static/font_infos.csv')
google_list = google_list['font_name'].apply(lambda x: x.split('.')[0])
google_paths = np.array([("static/images/fonts/" +
                        name_to_path(item)) for item in google_list])
google_matrix = pd.read_csv('Jesus_app/static/distance_matrix.csv', index_col=0) 
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
    idx = np.random.randint(803, size=5)
    print(google_paths[idx])
    result = google_paths[idx].tolist() # I have to change the numpy to list because Object of type 'ndarray' is not JSON serializable
    # set_trace()
    return jsonify(result)


@app.route('/trial')
def trial():
    return render_template('trial.html')

@app.route('/<font_name>/neighbors')
def trial_json(font_name):
    print(font_name)

    idx = google_list[google_list == font_name].index[0]
    relevant_rows = np.array(google_matrix.iloc[[idx], :]).reshape(-1)
    idx_top5,dist_top5 = generate_trial_font_selection(idx,
                                        google_matrix,
                                        google_list,
                                        300)

    name = font_name.replace('%20', ' ')
    file_path = f'static/images/fonts/{name}.png'
    neighbor_paths = google_paths[idx_top5].tolist()
    neighbs = []
    result = {'name': name, 'img': file_path, 'children': neighbs}
    for i, n in enumerate(neighbor_paths):
        font_name = n.split('/')[-1].split('.')[0].replace('%20', ' ')
        distance = dist_top5[i]
        path = n.replace('%20', ' ')
        sub_result = {'name': font_name, 'img': path, 'distance': distance}
        neighbs.append(sub_result)

    # result = {'top5':font_paths[idx_top5].tolist(), 'random5':font_paths[idx].tolist()} 
    # result = {'name': ''}
    return json.dumps(result)

