# Font-Recommender

Data consists of ~2.5 GB ttf and png files.  The VAE model trains on 128x128 images that display text from various font types, average reconstructive loss at ~10%. We built a recommendation system on top of flask, user-selection-based in the realm of typography. 	 

The `app.py` file is a Flask application with the minimum functionality. Run it with `python app.py` and look at the result in the browser `locahost:5000`.

It has three routes:

- `/` to serve the home page.
- `/about` to serve a page explaining the project and your description.
- `/neighbors` to receive a clicked font, execute the function that will compute the recommendations, and return them back to the frontend.
- `/initial` to provide the list of initial fonts.

The communication between the frontend and the backend is implemented with a simple `GET` ajax request (so there is no `POST`).

The pages served by the Flask app are in the `templates` directory. There you will see how the layout of the pages are defined using bootstrap. The [w3schools](https://www.w3schools.com/bootstrap/) tutorial for bootstrap is good enough. Feel free to change the design, the logo etc to fulfill your needs. The css and the javascript (where for example you make the table clickable) can be found in the `static` directory.

The app framewok was thankfully provided by our mentor Jesus!
