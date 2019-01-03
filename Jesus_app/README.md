# Font-Recommender

Data consists of ~2.5 GB ttf and png files.  The VAE model trains on 128x128 images that display text from various font types, average reconstructive loss at ~10%. We built a recommendation system on top of flask, user-selection-based in the realm of typography.   

The `app.py` file is a Flask application with the minimum functionality. Run it with `python app.py` and look at the result in the browser `locahost:5000/trial`.

It has four routes:

- `/trial` to serve the home page.
- `/toggle_model` to receive selected dataset (i.e. google fonts or dafont.com fonts) as input, and setting chosen dataset as global variables in a trial visualizing font images.
- `/<font_name>/neighbors` to receive a clicked font, execute the function that will compute the recommendations, and return them back to the frontend.
- `/initial` to provide the list of initial fonts.

Font recommender system is now deployed as a webpage in my [site](https://ekeleshian.github.io/visualizations.html)  

It's run with serverless cloud functions, here's the [code](https://github.com/ekeleshian/gcf_smartFont). For the client side, here's the [d3 code](https://github.com/ekeleshian/ekeleshian.github.io/blob/developed/static/new_viz.js) and [html](https://github.com/ekeleshian/ekeleshian.github.io/blob/developed/static/visualizations.html).

My presentation slides about the font recommender is found [here](https://docs.google.com/presentation/d/1oWmacOUspKoZ1noWW_25h4o8gx4xrnYLUepGBeQ1gRE/edit?usp=sharing)