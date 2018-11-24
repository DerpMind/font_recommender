from flask import Flask, request, render_template, jsonify
import numpy as np

FONTS = np.array([f'font_{i}' for i in range(1000)])

# Setup Flask app
app = Flask(__name__)


# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/neighbors')
def neighbors():
    clicked_font = request.args.get('clicked_font')

    # Take the clicked_font, compute something with it and return a result to the frontend.
    # The result can be any data structure (list, dictionary, dictionary of lists,...)

    # In your case, it could be something like...:
    # here I will fetch 100 random fonts for illustrative purposes.
    # You should fetch 100 most similar fonts instead (using your recommender).
    idx = np.random.randint(1000, size=100)

    idx_top10 = idx[:10] # the 10 most similar
    idx_sample = idx[::10] # the 10 most similar but in steps of 10
    result = {'top10':FONTS[idx_top10].tolist(), 'top10insteps':FONTS[idx_sample].tolist()}

    # your result is here a Python dictionary with two keys (links and scores), and the corresponding values are lists.
    # when you pass it to the frontend, it will be a javascript object that you can manipulate there:
    return jsonify(result)

@app.route('/initial')
def initial():
    # initial list of 10 fonts
    idx = np.random.randint(1000, size=10)

    result = FONTS[idx].tolist() # I have to change the numpy to list because Object of type 'ndarray' is not JSON serializable

    return jsonify(result)

# Main
if __name__ == "__main__":
    app.run(debug=True)
