from PIL import Image, ImageFont, ImageDraw
import numpy as np
from pdb import set_trace


def reconstruct_img(font_path, scale=0, border = 2500, y_shift=0, x_shift=0):

    fnt = ImageFont.truetype(font_path, int(100*(1-scale))) #font size=100
    font_name = font_path.split('/')[-1].split('.')[0]
    png_path= font_name + '.png'
    img = Image.new('RGB', (border, 200), color='white')
    d = ImageDraw.Draw(img)
    d.text((10+y_shift,10+x_shift), 'The quick brown fox jumps over the lazy dog.', 
          font=fnt, fill=(0,0,0))
    img.save(f"font_recommender/static/{png_path}")

    return png_path


def get_scales(png_paths):

    imgs = []
    for png in png_paths:
        img = Image.open(png)
        pxl = rgb2gray(np.array(img))
        corners = get_corners(pxl)
        imgs.append((png, corners))

    scales = []
    for i in imgs:
        corners = i[1]
        if corners['right'] > 1500:
            scale = (corners['right']-1500)/1500.0
            if scale > 0.6:
                scale = 0.5
        elif corners['right'] < 1000:
            scale = (corners['right']-1500)/1500.0
        else:
            scale = 0
        scales.append(scale)

    return scales


def get_shifts(png_paths):

    shifts = []
    for png in png_paths:
        img = Image.open(png)
        x1,x2,y1,y2 = png_to_coordinates(img)
        x_shift, y_shift = center_check(x1,x2,y1,y2)
        shifts.append((x_shift, y_shift))

    return shifts

def rgb2gray(pxl):
	'''Converts RBG image to gray scale.'''
	return np.dot(pxl[...,:3], [0.299, 0.587, 0.114])


def get_corners(pxl):
	'''Returns the x and y coordinates of the
	corners of the pixelized character'''
	bools = np.where(pxl==255, True, False)
	# set_trace()
	return {'top': np.where(bools == False)[0].min(),
	'left':np.where(bools==False)[1].min(),
	'bottom': np.where(bools==False)[0].max(),
	'right': np.where(bools==False)[1].max()}



def center_check(x1,x2,y1,y2):
	'''Checks to see whether the character
	is centered based on a radius threshold. Radius
	is determined by measuring Euclidean distance.'''
	center_x = (x2+x1)/2.0
	center_y = (y2+y1)/2.0
	radius = np.sqrt( (center_x - 100)**2 + (center_y - 750)**2 )
	x_shift, y_shift = 0,0
	if radius >= 20:
		x_shift = 100.0 - center_x#if x_shift is negative, then must be shifted down.
		y_shift = 750.0 - center_y #if y_shift is negative, then must be shifted to the left
		return x_shift, y_shift
	return x_shift, y_shift




def png_to_coordinates(img):
	'''Returns x1(top),x2(bottom),y1(left),y2(right) corners
	of the image once its converted into a numpy array with 
	a depth of 1 due to grayscaling.'''
	img = np.asarray(img)
	img = rgb2gray(img)
	corners = get_corners(img)
	return corners['top'], corners['bottom'], corners['left'], corners['right']





