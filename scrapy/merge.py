# -*- coding: utf-8 -*-
import json
import sys
import codecs
reload(sys)
sys.setdefaultencoding('utf-8')
gList=[]
f=codecs.open('autohome.json','r')
for line in f:
	jsonT=json.loads(line)
	gList.append(jsonT)
f.close()
f=codecs.open('autohome_out.json','wb',encoding='utf-8')
json.dump(gList, f, indent=4, sort_keys=True, ensure_ascii=False)
f.close()
# gList=[]
# bList=[]
# f=codecs.open('xcar_comment_good_out.json','r')
# for line in f:
# 	jsonT=json.loads(line)
# 	gList.append(jsonT)
# f.close()
# f=codecs.open('xcar_comment_bad_out.json','r')
# for line in f:
# 	jsonT=json.loads(line)
# 	bList.append(jsonT)
# f.close()

# newList=[]
# for item in gList:
# 	newItem={}
# 	gSId=item['sid']
# 	newItem['sid']=gSId
# 	newItem['goodComment']=item['comment']
# 	newItem['name']=item['name']
# 	for bItem in bList:
# 		bSId = bItem['sid']
# 		if gSId==bSId:
# 			newItem['badComment']=bItem['comment']
# 			break
# 	newList.append(newItem)
# f=codecs.open('xcar_out.json','wb',encoding='utf-8')
# # f.write(json.dumps(newList))
# # f.close()
# json.dump(newList, f, indent=4, sort_keys=True, ensure_ascii=False)
# f.close()
