import glob2 as glob
from PIL import ImageFont, Image, ImageDraw
import numpy as np
import pandas as pd

def picture_paths(pname="font_recommender"):
    font_paths = glob.glob(pname + '/static/*.png', )
    # Here we could also add more background
    # information to the particular font into its dictionary
    # in order to feed it to the HTML
    fonts = [
        dict([("picture", path[len(pname):])]) for path in font_paths
    ]

    return fonts


def generate_sentences(
        font_list = [0,1,2,3,4],
        font_infos = pd.read_csv("font_recommender/static/font_infos.csv"),
        sentence='The quick brown fox jumps over the lazy dog'):

    font_list = list(font_infos.iloc[font_list,1])

    font_list = [f"font_recommender/static/fonts/{font}.ttf" for font in font_list]

    for idx, font in enumerate(font_list):
        fnt = ImageFont.truetype(font, 100)
        img = Image.new('RGB', (2500, 150), color='white')
        d = ImageDraw.Draw(img)
        d.text((10, 10), sentence,
               font=fnt, fill=(0, 0, 0))
        img.save("font_recommender/static/picture" + str(idx) + ".png")

    return "printed sentences!"


def generate_font_selection(font_id=np.random.randint(low=0,high=300), #TO BE CHANGED
                            max_distance=600,
                            distance_matrix=pd.read_csv("font_recommender/static/distance_matrix.csv",index_col=0),
                            mode="exploration",
                            font_infos = pd.read_csv("font_recommender/static/font_infos.csv")):
    '''
    Receives id of the font that has been clicked and a radius (max_distance)
    It has two modes:
        - Exploration: in order to sample from a larger radius
        - Exploitation: in order to find nearest neighbors

    Returns selection of new fonts that can be fed into the sentence generator.
    '''
    # set_trace()
    relevant_set = np.array(distance_matrix.iloc[[font_id], :]).reshape(-1)

    if mode=="exploration":
        relevant_set = np.where((relevant_set>0) & (relevant_set<max_distance))[0]
        # set_trace()
        font_choice = np.random.choice(relevant_set,5,replace=False)
    if mode=="exploitation":
        font_choice = relevant_set.argsort()[1:6]
    # set_trace()
    paths = list(set(font_infos.iloc[font_choice,1].values))

    return paths, font_choice


def get_font_id(string, font_infos = pd.read_csv("font_recommender/static/font_infos.csv")):
    font_name = string.split('/')[-1].split('.')[0]
    column = font_infos.columns[1]
    idx = font_infos[font_infos[column]==font_name].index[0]

    return idx

    
#DOES NOT WORK YET!
def generate_font_list(path="font_recommender/static/"):
    
    #Font names
    font_names = glob.glob(path+"fonts/*.ttf")
    font_names = [font.split("/")[-1].split(".")[0] for font in font_names]
    
    df = pd.DataFrame(font_names,columns=["font_names"])
    df.to_csv(path+"font_infos.csv")
    
    return None 