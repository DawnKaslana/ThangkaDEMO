"""
text to img
--resolution=512 --center_crop
{"file_name": "thangka/train/xxz.png", "text": "a drawing of a pink rabbit"}
"""
import cv2 as cv
from PIL import Image
import shutil
from os import listdir
import os,sys,time
from os.path import *
import random
import numpy as np
import  json

def makeJsonl(root, metaFile, subdir, labelPath):
    if subdir: root+="/Objects"
    fileDirs = os.listdir(root)
    labelDirs = os.listdir(labelPath)
    meta = open(metaFile, "w") #a

    # 加入labelDict= {lable:[file]}
    labelDict = {}
    for dir in labelDirs:
        path = join(labelPath, dir)
        print(dir)
        if isdir(path) == 0: continue
        labelDict[dir] = {}
        for labelDir in os.listdir(path):
            print(labelDir)
            subpath = join(path, labelDir)
            files = []
            if isdir(subpath) == 0: continue
            for file in os.listdir(subpath):
                files.append(file)

            newLable = {labelDir: files}
            labelDict[dir] = {**labelDict[dir], **newLable}

    print(labelDict)

    findLabel = ["Avalokiteshvara_output","Posture_output","Armed_output","mudra_output","Skincolor_output","Desc_output","Author_output", "style_output","Heritage_output","painting_output","color_output",]
    # read imgs
    for dir in fileDirs:
        count = 0
        path = join(root, dir)
        if dir == "Objects": continue
        if isdir(path) == 0: continue
        print("==========================" + path)
        for file in os.listdir(path):
            ext = file.split('.')[1].lower()
            text = [dir] if subdir else []
            if ext == 'jpg' or ext == 'png':
                # 查找lable
                for item in findLabel:
                    for l in labelDict[item]:
                        if file in labelDict[item][l]:
                            text.append(l)

                writeText = "a drawing of " + ", ".join(text)
                dirName = "Objects/"+dir if subdir else dir
                meta.write('{"file_name": "./'+dirName+'/'+file+'", "text": "'+writeText+'"}'+"\n")
                count+=1
        time.sleep(1.5)
        print(dir+":"+str(count))

    meta.close()

metaFile = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified/metadata.jsonl"
root = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified/"
subdir = 1
# makeJsonl(root, metaFile, subdir)

def crop(img):
    (w, h, _) = img.shape
    minsize = h if w > h else w
    print("newsize:" + str(minsize))
    if abs(w - h) > 50:
        left = (w - minsize) // 2
        top = (h - minsize) // 2
        right = (w + minsize) // 2
        bottom = (h + minsize) // 2
        img = img[left:right,top:bottom]
    cropped = cv.resize(img,(512, 512))
    return cropped

# need pick and duplicate mask out
def makeSource(root, subdir, nestdir,outputPath, maskPath, cropPath,edgePath,maskOutputPath):
    if subdir:
        root = join(root, 'Objects')
        outputPath = join(outputPath, 'Objects')
        maskOutputPath = join(maskOutputPath, 'Objects')
        if not isdir(outputPath): os.mkdir(outputPath)
        if not isdir(maskOutputPath): os.mkdir(maskOutputPath)

    fileDirs = os.listdir(root)

    masks = listdir(maskPath)
    mask_num = len(masks)

    def process(img_path,mask_path):
        img = cv.imread(img_path)
        img = crop(img)
        # canny
        # 灰度化处理图像
        gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
        # 高斯滤波降噪
        # gray_img = cv.GaussianBlur(gray_img, (1, 1), 0)  # img = cv.medianBlur(img,3)
        # Canny算子
        canny_img = cv.Canny(gray_img, 100, 200)
        canny_img = cv.bitwise_not(canny_img)
        # canny_img = cv.cvtColor(canny_img, cv.COLOR_GRAY2BGR)
        # reject lower limit, accept upper
        # 两者之间的值要判断是否与真正的边界相连

        # mask
        mask = cv.imread(mask_path)
        mask = crop(mask)
        mask = cv.bitwise_not(mask)
        mask_np = (mask > 0).astype(np.uint8) * 255
        output = cv.add(img, mask_np)
        # EC train mask need to be grayscale
        mask_np = cv.cvtColor(mask_np, cv.COLOR_BGR2GRAY)
        return img,output, mask_np, canny_img

    if nestdir:
        # read imgs
        for dir in fileDirs:
            count = 0
            path = join(root, dir)
            if dir == "Objects": continue
            if isdir(path) == 0: continue
            print("==========================" + maskOutputPath)
            for file in listdir(path):
                ext = file.split('.')[1].lower()
                if ext == 'jpg' or ext == 'png':
                    print(file)
                    fullpath = join(path, file)
                    index = random.randint(0, mask_num - 1)
                    maskfullpath = join(maskPath, masks[index])
                    output, mask_np = process(fullpath,maskfullpath)
                    savePath = join(outputPath,dir)
                    saveMaskPath = join(maskOutputPath,dir)
                    if not isdir(savePath): os.mkdir(savePath)
                    if not isdir(saveMaskPath): os.mkdir(saveMaskPath)
                    cv.imwrite(join(savePath, file), output)
                    cv.imwrite(join(saveMaskPath, file), mask_np)
                    count+=1
            time.sleep(1.5)
            print(dir+":"+str(count))
    else:
        if not isdir(outputPath): os.mkdir(outputPath)
        if not isdir(cropPath): os.mkdir(cropPath)
        if not isdir(edgePath): os.mkdir(edgePath)
        if not isdir(maskOutputPath): os.mkdir(maskOutputPath)
        for file in fileDirs:
            ext = file.split('.')[1].lower()
            if ext == 'jpg' or ext == 'png':
                print(file)
                fullpath = join(root, file)
                index = random.randint(0, mask_num - 1)
                maskfullpath = join(maskPath, masks[index])
                img,output, mask_np, canny = process(fullpath, maskfullpath)
                file = file.split('.')[0]+".png"
                cv.imwrite(join(cropPath, file), img)
                cv.imwrite(join(edgePath, file), canny)
                cv.imwrite(join(outputPath, file), output)
                cv.imwrite(join(maskOutputPath, file), mask_np)

type = "train"
root = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/datasets/thangkaAC/"+type+"/"
subdir = 0
cropPath = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/datasets/thangkaAC/"+type+"_crop"
edgePath = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/datasets/thangkaAC/"+type+"_edge"
outputPath = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/datasets/thangkaAC/"+type+"_masked"
maskOutputPath = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/datasets/thangkaAC/"+type+"_mask"
maskPath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/mask/irregular_mask/disocclusion_img_mask<0.02&>0.005"
# disocclusion_img_mask<0.02&>0.005
# makeSource(root, 0, 0,outputPath, maskPath, cropPath, edgePath,maskOutputPath)

def cannyDir(path, outputPath, isNestdir):
    if not isdir(outputPath):
        os.mkdir(outputPath)

    if isNestdir:
        fileDirs = listdir(path)
        print(fileDirs)
        for dir in fileDirs:
            count = 0
            dirpath = join(path, dir)
            if dir == "Objects": continue
            if not isdir(dirpath): continue
            print("==========================" + dirpath)
            outputDirPath = join(outputPath,dir)
            if not isdir(outputDirPath):
                os.mkdir(outputDirPath)
            for file in listdir(dirpath):
                img_path = join(dirpath, file)
                img = cv.imread(img_path)
                # canny
                # 灰度化处理图像
                gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
                gray_img = cv.bitwise_not(gray_img)
                # 高斯滤波降噪
                gray_img = cv.GaussianBlur(gray_img, (3, 3), 0)  # img = cv.medianBlur(img,3)
                # Canny算子
                canny_img = cv.Canny(gray_img, 50, 100)
                # canny_img = cv.bitwise_not(canny_img)

                cv.imwrite(join(outputDirPath, file), canny_img)
                count+=1
            print(dir+":"+str(count))
    else:
        files = listdir(path)

        for file in files:
            img_path = join(path, file)
            img = cv.imread(img_path)
            # canny
            # 灰度化处理图像
            gray_img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
            gray_img = cv.bitwise_not(gray_img)
            # 高斯滤波降噪
            gray_img = cv.GaussianBlur(gray_img, (3, 3), 0)  # img = cv.medianBlur(img,3)
            # Canny算子
            canny_img = cv.Canny(gray_img, 50, 100)
            canny_img = cv.bitwise_not(canny_img)
            cv.imwrite(join(outputPath, file), canny_img)

path = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified_CN/target/Objects"
output = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified_CN/edge/Objects"
isNestdir = 1
# cannyDir(path,output,isNestdir)

def processJsonl():
    jsonl = open("/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified_CN/metadata.jsonl", "r")
    newJsonl = open("/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified_CN/metadata_CN.jsonl","w")
    rows = jsonl.readlines()
    for row in rows:
        row = json.loads(row)
        source = row['source']
        target = row['source'].replace("source", "target")
        prompt = row['image_caption']
        text = '{"target":"'+target+'","prompt":"'+prompt+'","source":"'+source+'"}\n'
        newJsonl.write(text)
        print(text)

# processJsonl()

def labelStyle(stylePath, imgPath, objectPath, outputPath):
    styleDirs = os.listdir(stylePath)
    imgDirs = os.listdir(imgPath)
    objectDirs = os.listdir(objectPath)
    imgList = []

    print('start add imgList')
    time.sleep(1)

    for dir in imgDirs:
        if dir == "Objects" or dir.find('._') != -1:
            continue
        path = join(imgPath, dir)
        if isdir(path):
            for file in os.listdir(path):
                if file.find('._') == -1:
                    print(file)
                    imgList.append({"path":path,"filename":file})
    print('all img:'+str(len(imgList)))
    time.sleep(1)

    for dir in objectDirs:
        if dir.find('._') != -1:
            continue
        path = join(objectPath, dir)
        if isdir(path):
            for file in os.listdir(path):
                if file.find('._') == -1:
                    print(file)
                    imgList.append({"path":path,"filename":file})
    print('add Objects:'+str(len(imgList)))
    time.sleep(1)
    print('start class style')
    time.sleep(1)

    for dir in styleDirs:
        path = join(stylePath, dir)
        print('start '+dir+' class')
        time.sleep(1)
        outputDir = join(outputPath, dir)

        copyList = []

        if not isdir(outputDir):
            os.makedirs(outputDir)

        if isdir(path):
            for file in os.listdir(path):
                filename = file.split('.')[0]
                for img in imgList:
                    imgName = img['filename'].split('.')[0]
                    if imgName.find(filename) == 0:
                        print('filename:'+filename+'  img:'+imgName)
                        copyList.append(img)

        print('class '+dir+' copyList len:'+str(len(copyList)))
        time.sleep(1.5)

        for file in copyList:
            fullpath = join(file['path'],file['filename'])
            shutil.copy(fullpath, outputDir)


imgPath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified/"
objectPath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified/Objects/"
stylePath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Style/"
outputPath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/style_output/"
# labelStyle(stylePath, imgPath, objectPath, outputPath)

def randomChoose(sour_path, dest_path):
    if not isdir(dest_path):
        os.makedirs(dest_path)

    files = listdir(sour_path)
    count = 0
    for filename in files:
        count += 1
        if not count%15:
            fullpath = join(sour_path, filename)
            shutil.copy(fullpath, dest_path+"/"+filename)

# source = "../../../Dataset/thangka_image/Figure/bounding_box_train" #3747/250=15
# dest = "./image/thangka/uncrop"
# randomChoose(source, dest)

# 以中心點
def cropDir(path, output_path):
    if not isdir(output_path):
        os.makedirs(output_path)

    files = listdir(path)

    for filename in files:
        fullpath = join(path, filename)
        if isfile(fullpath):
            print(filename)
            img = Image.open(fullpath)
            print(img.size)
            (w, h) = img.size
            minsize = h if w>h else w
            print("newsize:"+str(minsize))
            if abs(w - h) > 50:
                left = (w - minsize) / 2
                top = (h - minsize) / 2
                right = (w + minsize) / 2
                bottom = (h + minsize) / 2
                img = img.crop((left, top, right, bottom))
            cropped = img.resize((512, 512))
            cropped.save(output_path+"/"+filename)

# cropDir("/media/brl2022-1/brl2022-1-1/xty/segment-anything/Avalokiteshvara/images","/media/brl2022-1/brl2022-1-1/xty/segment-anything/Avalokiteshvara/croped")


# root = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/test/choosedImgUncrop/"
# dirs = listdir(root)
# for dir in dirs:
#     source = root + dir
#     dest = "/media/brl2022-1/brl2022-1-1/xty/edge-connect/test/choosedImg/" + dir
#     if not isdir(dest):
#         os.makedirs(dest)
#     crop(source, dest)

import xml.etree.ElementTree as ET

xmlPath = '/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara classified/xml/'
imgPath = '/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara classified/sitting 2-armed_Avalokiteshvara/'
outputPath = '/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara classified/unclassified crop'
def cropXMLImg(xmlPath, imgPath,outputPath):
    if not isdir(outputPath):
        os.makedirs(outputPath)

    files = listdir(xmlPath)
    for xmlName in files:
        xml = ET.parse(xmlPath+xmlName)
        root = xml.getroot()
        fileName = root[1].text
        print(fileName)
        ext = fileName[-4:]
        if isfile(join(imgPath,fileName)):
            img = cv.imread(join(imgPath, xmlName[:-4]+ext))
            (w,h,z) = img.shape
            for i in range(6, len(root)):
                print(root[i][0].text)
                minx = int(root[i][4][0].text)
                miny = int(root[i][4][1].text)
                maxx = int(root[i][4][2].text)
                maxy = int(root[i][4][3].text)
                x = (minx + maxx) / 2
                y = (miny + maxy) / 2
                lenX = maxx - minx
                lenY = maxy - miny
                e = lenX/2 if lenX > lenY else lenY/2
                ROI = img[0 if int(y-e) < 0 else int(y-e):w if int(y+e)>w else int(y+e), 0 if int(x-e) < 0 else int(x-e):h if int(x+e)>h else int(x+e)]
                cv.imwrite(join(outputPath, xmlName[:-4]+'_'+root[i][0].text+'.png'),ROI)

# cropXMLImg(xmlPath, imgPath, outputPath)


def processPartImg(path, outputPath, processType):
    if not isdir(outputPath):
        os.makedirs(outputPath)

    if processType == "move":
        files = listdir(path)
        for filename in files:
            classname = filename[:-4].split('_')[-1]
            if not isdir(outputPath+classname):
                os.makedirs(outputPath+classname)
            shutil.move(join(path, filename), join(outputPath+classname,filename))
    elif processType == "rename":
        dirs = listdir(path)
        for dir in dirs:
            files = listdir(join(path, dir))
            for filename in files:
                arr = filename[:-4].split('_')
                arr[-1] = dir
                newFilename = '_'.join(arr)+'.png'
                os.rename(join(path+dir,filename),join(path+dir,newFilename))

imgPath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara classified/unclassified crop/"
objectsOath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara classified/Objects/"
outputPath = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara classified/Objects/"
# processPartImg(objectsOath, outputPath, "rename") # type:move/rename

# from choosed images and single mask
def makeMaskedImg(filepath, outputpath, mask_img):
    if not outputpath:output_path=filepath
    img = cv.imread(filepath)
    mask = cv.imread(mask_img)  # 遮罩圖片
    mask = (mask > 0).astype(np.uint8) * 255
    output = cv.add(img, mask)
    cv.imwrite(outputpath,output)

file = "/home/brl2022-1/Desktop/test/4-armed_Avalokiteshvara/2140993.jpg"
mask = '/home/brl2022-1/Desktop/test/disocclusion/masks/2140993.png'
output = "/home/brl2022-1/Desktop/test/4-armed_Avalokiteshvara/2140993_masked.jpg"
# makeMaskedImg(file,output,mask)

def invertMasks(sourcePath, outputPath):

    if not isdir(outputPath):
        os.makedirs(outputPath)

    files = os.listdir(sourcePath)

    for file in files:
        print(sourcePath+file)
        mask = cv.imread(join(sourcePath,file))
        mask = cv.resize(mask,(512,512))
        mask_gray = cv.cvtColor(mask, cv.COLOR_BGR2GRAY)
        mask = 255 - mask_gray
        cv.imwrite(join(outputPath,file),mask)

source = "/media/brl2022-1/brl2022-1-1/xty/Dataset/mask/irregular_mask/disocclusion_img_mask"
output = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Avalokiteshvara_classified_CN/mask"
# invertMasks(source, output)

def cropImgDir(imageDir, outputPath):
    if not isdir(outputPath):
        os.makedirs(outputPath)

    files = os.listdir(imageDir)

    for file in files:

        img = cv.imread(join(imageDir,file))
        img = crop(img)
        img = cv.resize(img,(512,512))
        cv.imwrite(join(outputPath,file),img)

# cropImgDir("/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/Avalokiteshvara", "/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/cropImg")

def changeExt(path):
    files = os.listdir(path)

    for file in files:
        fullpath = join(path,file)
        ext = file.split(".")[1]

        if ext == "jpg":
            img = cv.imread(fullpath)
            file = file.split(".")[0]+".png"
            cv.imwrite(join(path,file), img)

# changeExt("/media/brl2022-1/brl2022-1-1/xty/edge-connect/datasets/thangka_AC/val")

def processMask(mask_path):  # process mask and test img
    # mask
    mask = cv.imread(mask_path)
    mask = cv.resize(mask,(512,512))
    mask = cv.bitwise_not(mask)
    # mask_np = (mask > 0).astype(np.uint8) * 255
    # EC train mask need to be grayscale
    # mask_np = cv.cvtColor(mask_np, cv.COLOR_BGR2GRAY)
    return mask #mask_np or mask = mask_nnp

def processMaskDir(maskPath, outputPath):
    path = maskPath
    files = listdir(path)

    for filename in files:
        print(filename)
        newMask = processMask(join(path,filename))
        cv.imwrite(join(outputPath, filename), newMask)

# disocclusion_img_mask<0.02&>0.005
# removedMask<0.03&>0.02
# removedMask>0.03
# processMaskDir(outputPath="/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/NNPmask",
#               maskPath="/media/brl2022-1/brl2022-1-1/xty/Dataset/mask/irregular_mask/removedMask>0.03"
#               )

def makeMaskedImgDir(imageDir, maskDir, outputDir):
    if not isdir(outputDir):
        os.makedirs(outputDir)
        os.makedirs(outputDir + "/mask")
        os.makedirs(outputDir + "/img")
    files = listdir(imageDir)
    masks = listdir(maskDir)
    rotateList = [0, cv.ROTATE_90_CLOCKWISE, cv.ROTATE_180, cv.ROTATE_90_COUNTERCLOCKWISE]
    for filename in files:
        print(filename)
        index = random.randint(0, 99)
        img = cv.imread(join(imageDir, filename))
        # img = crop(img)
        img = cv.cvtColor(img, cv.COLOR_RGB2RGBA)
        mask = cv.imread(join(maskDir, masks[index]))  # 遮罩圖片
        mask = cv.cvtColor(mask, cv.COLOR_RGB2RGBA)

        rotate = rotateList[random.randint(0, 3)]
        if rotate:
            mask = cv.rotate(mask, rotate)

        cv.imwrite(join(outputDir + "/mask", filename), mask)
        #mask need smaller
        kernel = np.ones((5, 5), np.uint8)
        erosionMask = cv.erode(mask, kernel, iterations=1)

        output = cv.add(img, erosionMask)
        cv.imwrite(join(outputDir+"/img", filename), output)
        npmask = (mask > 0).astype(np.uint8) * 255
        mask_gray = cv.cvtColor(mask, cv.COLOR_RGBA2GRAY)

        # 融合
        # output = cv.add(img, mask)
        # output = cv.bitwise_and(img, img, mask=mask_gray)

        (w, h, _) = mask.shape
        for x in range(w):
            for y in range(h):
                if mask_gray[y, x] > 200:
                    output[y, x, 3] = 0  # 如果該像素為白色，調整該像素的透明度

        filename = filename[:-4]
        newfilename = filename + "_img" + ".png"
        cv.imwrite(join(outputDir, newfilename), output)
        newfilename = filename + "_npmask" + ".png"
        cv.imwrite(join(outputDir,newfilename), npmask)
        newfilename = filename + "_mask" + ".png"
        cv.imwrite(join(outputDir, newfilename), mask)


imageDir = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/cropImg"
maskDir = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/mask/pick"
outputDir = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/masked image v3"

makeMaskedImgDir(imageDir, maskDir, outputDir)

def rewriteFilename(path, oldStr, newStr, isNest):
    files = os.listdir(path)

    for file in files:
        fullpath = join(path,file)

        if file.find(oldStr) > -1:
            print(file.find(oldStr))
            newfile = file.replace(oldStr, newStr)
            print(newfile)
            os.rename(fullpath, join(path,newfile))

path = "/media/brl2022-1/brl2022-1-1/xty/Dataset/Thangka Test Dataset/record_mask"
# rewriteFilename(path, '_mask', '_img', 0)













