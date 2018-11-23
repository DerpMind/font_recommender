import glob2 as glob

def picture_paths(pname="font_recommender"):
    font_paths = glob.glob(pname + '/static/*.png', )
    fonts = [
        dict([("picture", path[len(pname):])]) for path in font_paths
    ]
    return fonts




from PIL import ImageFont, Image, ImageDraw

def generate_sentences(font_list=[
    "99%25HandWritting",
    "DJHTRIAL",
    "IsiniScript",
    "Rainbows&Lollipops",
    "Tell us, Pangaia"]):

    font_list = [f"font_recommender/static/fonts/{font}.ttf" \
                 for font in font_list]

    for idx, font in enumerate(font_list):
        fnt = ImageFont.truetype(font, 100)
        img = Image.new('RGB', (2500, 150), color='white')
        d = ImageDraw.Draw(img)
        d.text((10, 10), 'The quick brown fox jumps over the lazy dog',
               font=fnt, fill=(0, 0, 0))
        img.save("font_recommender/static/picture"+str(idx)+".png")

    return "printed sentences!"
