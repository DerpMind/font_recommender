import numpy as np
import pandas as pd
from pdb import set_trace
#from font_recommender import helpers

def path_to_name(string, idx=None):
    if idx is not None:
        return string.split("/")[-1].split(".")[0].replace("%20", " ")
    else:
        return string.split("/")[-2].split(".")[0].replace("%20", " ")

        
def name_to_path(string):
    return string.replace(" ", "%20") + ".png"

def generate_font_selection(font_id,
                            distance_matrix,
                            font_list,
                            max_distance=300
                            ):
    '''
    Receives id of the font that has been clicked and a radius (max_distance)
    It has two modes:
        - Exploration: in order to sample from a larger radius
        - Exploitation: in order to find nearest neighbors

    Returns selection of new fonts that can be fed into the sentence generator.'''

    relevant_row = np.array(distance_matrix.iloc[[font_id], :]).reshape(-1)
    neighbours = np.where((relevant_row>0)&(relevant_row < max_distance))[0]
    # set_trace()
    # choose nearest neighbors if max_distance includes less than 6 fonts
    if len(neighbours)>5:
        font_choice = np.random.choice(neighbours, 5, replace=False)
        status = True
    else:
        font_choice = relevant_row.argsort()[1:6]
        status=False

    #names = list(set(font_list.iloc[font_choice,1].values))

    return list(font_choice), status

def generate_trial_font_selection(font_id,
                            distance_matrix,
                            font_list,
                            max_distance=300
                            ):
    '''
    Receives id of the font that has been clicked and a radius (max_distance)
    It has two modes:

        - Exploration: in order to sample from a larger radius
        - Exploitation: in order to find nearest neighbors

    Returns selection of new fonts that can be fed into the sentence generator.'''

    relevant_row = np.array(distance_matrix.iloc[[font_id], :]).reshape(-1)
    # neighbours = np.where((relevant_row>0)&(relevant_row < max_distance))[0]
    # if len(neighbours) <5:
    #     relevant_row.
    # df = pd.DataFrame(neighbours,relevant_row[neighbours] )
    # dist_choice = np.sort(relevant_row[neighbours])[:5]

    font_choice = relevant_row.argsort()[1:6]
    dist_choice = relevant_row[font_choice]
    # set_trace()
    # choose nearest neighbors if max_distance includes less than 6 fonts
    # if len(neighbours)>5:
    #     font_choice = np.random.choice(neighbours, 5, replace=False)
    #     status = True
    # else:


    #names = list(set(font_list.iloc[font_choice,1].values))

    return list(font_choice), list(dist_choice)


# def picture_paths(font_paths):
#     # Here we could also add more background
#     # information to the particular font into its dictionary
#     # in order to feed it to the HTML
#
#     fonts = [
#         dict([("picture", path[len("font_recommender"):])]) for path in font_paths
#     ]
#     return fonts
#
#
#
# def generate_sentences(
#     font_list = [20,21,22,23,24],
#     font_infos = pd.read_csv("font_recommender/static/font_infos.csv")):
#     '''Here we generate images that go through a series of image reconstruction
#     in order to ensure uniformly shaped and centered images of a sentence'''
#
#     font_list = list(font_infos.iloc[font_list,1])
#
#     font_list = [f"font_recommender/static/fonts/{font}.ttf" for font in font_list]
#
#     png_paths = []
#     for idx, font in enumerate(font_list):
#         png = helpers.reconstruct_img(font, scale=0, border = 2500)
#         png_paths.append(f'font_recommender/static/{png}')
#
#     scales = helpers.get_scales(png_paths)
#
#     for idx, font in enumerate(font_list):
#         helpers.reconstruct_img(font, scale=scales[idx], border = 1500)
#
#     shifts = helpers.get_shifts(png_paths)
#
#     for idx, font in enumerate(font_list):
#         helpers.reconstruct_img(font, scale=scales[idx], border = 1500,
#                        x_shift = shifts[idx][0], y_shift = shifts[idx][1])
#
#     return "printed sentences!"
#
#
#
#
#
#
#
# def get_font_id(string, font_infos = pd.read_csv("font_recommender/static/font_infos.csv")):
#     '''Extracts the index of the font name.'''
#     font_name = string.split('/')[-1].split('.')[0]
#     column = font_infos.columns[1]
#     idx = font_infos[font_infos[column]==font_name].index[0]
#
#     return idx
