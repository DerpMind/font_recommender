# Font-Recommender

Data consists of ~2.5 GB ttf and png files.  The VAE model trains on 128x128 images that display text from various font types, average reconstructive loss at ~10%. We built a recommendation system on top of flask, user-selection-based in the realm of typography.   


## Running the site

The site is partitioned by two versions of the font recommendation system, Version 1 and Version 2, with their respective unique routes:

### Version 1

Clone this [repo](https://github.com/DerpMind/font_recommender.git).  Under the root directory, run `python app.py` on the shell. Look at the result in the browser `locahost:5000` 

It has four routes:

- `/` to serve the home page.
- `/about` to serve a page explaining the project and your description.
- `/neighbors` to receive a clicked font, execute the function that will compute the recommendations, and return them back to the frontend.
- `/initial` to provide the list of initial fonts.


### Version 2

If you hadn't done it for Version 1, clone this [repo](https://github.com/DerpMind/font_recommender.git).  Under the root directory, run `python app.py` on the shell. Look at the result in the browser `locahost:5000/trial`


- `/trial` to serve the home page.
- `/toggle_model` to receive selected dataset (i.e. google fonts or dafont.com fonts) as input, and setting chosen dataset as global variables in a trial visualizing font images.
- `/<font_name>/neighbors` to receive a clicked font, execute the function that will compute the recommendations, and return them back to the frontend.
- `/initial` to provide the list of initial fonts.

Version 2 is now deployed as a webpage in [Liz's site](https://ekeleshian.github.io/visualizations.html)  

It's run with serverless cloud functions, here's the [code](https://github.com/ekeleshian/gcf_smartFont). For the client side, here's the [d3 code](https://github.com/ekeleshian/ekeleshian.github.io/blob/developed/static/new_viz.js) and [html](https://github.com/ekeleshian/ekeleshian.github.io/blob/developed/static/visualizations.html).

Presentation slides about the VAE model and Version 2 is found [here](https://docs.google.com/presentation/d/1oWmacOUspKoZ1noWW_25h4o8gx4xrnYLUepGBeQ1gRE/edit?usp=sharing)