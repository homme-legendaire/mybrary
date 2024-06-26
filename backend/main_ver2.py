# 가상환경 세팅 노션에 정리
"""
uvicorn main:app --reload --port=8000 --host=0.0.0.0
"""
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Header, Response
from pydantic import BaseModel
import uvicorn
import logging
import os
import sys
import requests
import json
import uuid
from datetime import datetime,timezone,timedelta
import traceback
import random
import time
import queue
from threading import Thread
from firebase_admin import credentials,auth,firestore
from diffusers import StableDiffusionPipeline
from typing import List, Optional
from google.cloud.firestore_v1.base_query import FieldFilter
import torch
import time
from googletrans import Translator
from fastapi import FastAPI, Form, Request
from fastapi.templating import Jinja2Templates
from googletrans import Translator
from fastapi.responses import HTMLResponse
import firebase_admin
from firebase_admin import credentials
from fastapi.responses import FileResponse
import google.generativeai as genai
import base64
import pandas as pd
from gensim.models import Word2Vec # pip install gensim,pip install scipy==1.10.1
import numpy as np

app = FastAPI()






logging.basicConfig(
    filename="app.log",  # 로그 파일의 경로 및 이름 설정
    level=logging.ERROR,  # 로그 레벨을 설정합니다. 여기서는 ERROR 이상의 로그만 기록됩니다.
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"  # 로그 메시지의 형식을 설정합니다.
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "http://localhost",
    "https://localhost",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET","POST"],
    allow_headers=["*"],
)



cred = credentials.Certificate("mybrary-5d2c7-firebase-adminsdk-293xd-725a5b12b0.json")
firebase_admin.initialize_app(cred)
db = firestore.client()


with open("APIKEY.txt", "r") as f:
    API = f.read().splitlines()
    APIKEY = API[0].split("=")[1]
    ALADINAPI = API[1].split("=")[1]

genai.configure(api_key=APIKEY)

model = genai.GenerativeModel('gemini-pro')



model_id = "stabilityai/stable-diffusion-2-base"
# 모델 파라미터 받아오기 
original = StableDiffusionPipeline.from_pretrained(
    model_id, torch_dtype=torch.float32, use_safetensors=True,
    ).to("cpu")

# 구글 번역기 API 받아오기
translator = Translator()
templates = Jinja2Templates(directory='templates')  # 템플릿 파일 위치 설정

count=0
# prompt 받아와서 생성이미지 만드는 함수
def diffusion(prompt):
    
    
    seed = 2023
    generator = torch.manual_seed(seed)

    NUM_ITERS_TO_RUN = 1
    NUM_INFERENCE_STEPS = 35
    NUM_IMAGES_PER_PROMPT = 4

    

    start = time.time_ns()
    for i in range(NUM_ITERS_TO_RUN):
        images = original(
        prompt,
        num_inference_steps=NUM_INFERENCE_STEPS,
        generator=generator,
        num_images_per_prompt=NUM_IMAGES_PER_PROMPT
        ).images
        images[i].save(f'tmp{count}.jpg',"JPEG")
    end = time.time_ns()
    conut+=1
    original_sd = f"{(end - start) / 1e6:.1f}"



    print(f"Execution time -- {original_sd} ms\n")
    return f'tmp{count}.jpg'

def AIchoice(user_genre,user_mood,user_interest):
# 장르, 분위기, 흥미 정보 입력 (예시)
    try:
        # breakpoint()

        #입력받은 키워드 문자열을 리스트로 변환
        # user_interest = [keyword.strip() for keyword in user_interest.split(',') if keyword.strip()]

        # 입력 정보 출력 (테스트용)
        print("사용자 정보:")
        print(" - 책 장르:", user_genre)
        print(" - 기분:", user_mood)
        print(" - 관심 키워드:", user_interest)
        print("\n")
        # Word2Vec 모델 로드 (필요에 따라 모델 학습)

        # pkl 파일로부터 모델 불러오기
        model_path = "book_word2vec_modelEssay.pkl"
        book_word2vec_model = Word2Vec.load(model_path)

        # pkl 책 데이터(벡터) 불러오기
        with open('book_vector_essay.pkl', 'rb') as f:
            book_vectors = pd.read_pickle(f)

        print(book_vectors.head())
        # 사용자 입력 정보를 벡터로 변환
        user_vector =(0.1*book_word2vec_model.wv[user_genre])+ (0.1*book_word2vec_model.wv[user_mood]) +(0.8*np.mean(book_word2vec_model.wv[user_interest],axis=0))

        #np.mean([book_word2vec_model.wv[word] for word in [user_genre, user_mood, user_interest] if word in book_word2vec_model.wv.key_to_index], axis=0)

        # 책 벡터와 사용자 입력 벡터 간의 유사도 계산
        similarities = []
        most_similarities = []
        for i in range(len(book_vectors)):
            vector = book_vectors.iloc[i,1]
            Index = book_vectors.iloc[i,2]
            title = book_vectors.iloc[i,0]
            author = book_vectors.iloc[i,-1]
            if len(vector) != 0:
                similarity = np.dot(vector, user_vector) / (np.linalg.norm(vector) * np.linalg.norm(user_vector))

            else :
                similarity = 0
        #similarities.append((i,title ,similarity))

            if similarity >= 0.8:
                    similarities.append((Index, title,author, similarity))
        most_similarities = similarities.copy()
        most_similarities.sort(reverse=True, key=lambda x: x[-1])
        #print("유저가 선택한 '분위기': {}, '흥미': {}".format(user_mood, user_interest))
        print("유사도가 0.8 이상인 추천 책:")
        for rank, (Index, book_title, author,similarity) in enumerate(similarities[:15], 0):
            print(f"순위 {rank+1}: {book_title}-{author} (Similarity: {similarity:.2f}) (Index: {Index})")
        print("\n")
        print("가장 유사도가 높은 책 추천:")
        return_item = []
        for rank, (Index, book_title, author,similarity) in enumerate(most_similarities[:15], 0):
            k=book_title
            print(k)
            return_item.append(k)
            print(f"순위 {rank+1}: {book_title}-{author}) (Similarity: {similarity:.2f}) (Index: {Index})")
        print(return_item)
        return return_item
    except:
        print(traceback.format_exc())

# @app.post('/')  # POST 메소드 라우트
# async def receive_text(user: str = Form(...)):  # 폼 데이터를 user 변수로 받음
#     translated = translator.translate(user, dest='en').text  # 한글 문장을 영어로 번역
#     diffusion(translated)  # 번역된 문장으로 이미지 생성
#     return templates.TemplateResponse('index.html', {'request': request, 'user': user})

# @app.get('/', response_class=HTMLResponse)  # GET 메소드 라우트
# async def main(request: Request):
#     user = "입력"
#     return templates.TemplateResponse('index.html', {'request': request, 'user': user})


def verifying(token):
    times=0
    while True:
        try:
            if token != "undefined"  :
                decoded_claims = auth.verify_session_cookie(token, check_revoked=True)
                return decoded_claims
            else :
                return False
        except:
            times+=1
            time.sleep(1)
            if times>3:
                return False


@app.get("/")
def read_root():
    return {"Hello": "World"}



    







class front_signup(BaseModel):
    email:str
    phoneNumber:str
    name:str
@app.post('/signup') ## referel 코드 ## 추후 사전예약자들만 주는 쿠폰 삽입해야함 if문으로 처리하기로 함 이메일로 체크함 이 이메일이면 쿠폰 리스트에 추가
def signup(data:front_signup,token : Optional[str] = Header(None)):
    try:
        if token == "undefined":
            return {"result":"fail"}
        collection_ref=db.collection(u'user')
        user_info=verifying(token)
        if user_info:
            custom_doc_id=user_info['user_id']
            new_doc_ref = collection_ref.document(custom_doc_id)
            new_user = {
                "createdAt": datetime.now(tz=timezone(timedelta(hours=9))),
                "email": data.email,
                "name": data.name,
                "phoneNumber": data.phoneNumber,
                "level":"천자문",
                "nickname":"책만이",
                "prev_recommend":"",
                "record_book":0
            }

            new_doc_ref.set(new_user)
            return {"result":"success","data":new_user}
        else:
            return {"result":"fail","reason":"login fail"}
    except:
        print(traceback.format_exc())
        logging.error(f" 실패 signup,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}
@app.get('/login')
def login(token: Optional[str] = Header(None)):
    # id_token=data.token
    try:
        id_token=token
        session_cookie = auth.create_session_cookie(id_token, expires_in=5*24*60*60)
        
        return {"session_cookie":session_cookie}
    except:
        logging.error(f" 실패 login,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}
@app.get('/login/passwordReset') 
def can_reset_password(email: Optional[str] = Header(None),phoneNumber: Optional[str] = Header(None)):
    try:
        if email is None or email =="undefined":
            return {"result":"fail"}
        elif phoneNumber is None or phoneNumber =="undefined":
            return {"result":"fail"}
        else:
            collection_ref=db.collection(u'user')
            query_ref = collection_ref.where(filter=FieldFilter("email","==",email)).where(filter=FieldFilter("phoneNumber","==",phoneNumber)).get()
            if len(query_ref)==1:
                for doc in query_ref:
                    data = doc.to_dict()
                return {"result":"success"}
            else :
                return {"result":"fail"}
    except:
        logging.error(f" 실패 can_reset_password,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}
    

@app.get('/login/verify')
def cookietest(token: Optional[str] = Header(None)):
    try:
        if token == "undefined":
            return {"result":"fail"} # 실패 는 재로그인 필요
        if verifying(token):
            return {"result":"success"}
        else:
            return {"result":"fail"} #실패 는 재로그인 필요
    except:
        logging.error(f" 실패 cookietest,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}
@app.get("/logout")
def logout(token: Optional[str] = Header(None)):
    try:
        if token == "undefined":
            return {"result":"fail"} # 실패 는 재로그인 필요
        try:
            user_info=auth.verify_session_cookie(token, check_revoked=True)
        except:
            return {"result":"success"}
        if user_info:
            auth.revoke_refresh_tokens(user_info['user_id'])
            return {"result":"success"}
        else:
            return {"result":"fail"}
    except:
        logging.error(f" 실패 logout,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}


@app.get("/signout")
def signout(token: Optional[str] = Header(None)):
    try:
        if token == "undefined":
            return {"result":"fail"}
        user_info=verifying(token) #이전에 로그인 검증 필요
        if user_info:
            collection_ref=db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id'])
            delete_user_ref=db.collection(u'deleteUser')
            delete_user_ref=delete_user_ref.document(user_info['user_id'])
            user_to_delete=doc_ref.get().to_dict()
            delete_user_ref.set(user_to_delete)
            doc_ref.delete()
            auth.delete_user(user_info['user_id'])
            return {"result":"success"}
        else:
            return {"result":"fail","reason":"login fail"}
    except:
        logging.error(f" 실패 signout,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}
    


def aladin_search(Query):
    url = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx"

    # e="http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=[TTBKey]&QueryType=ItemNewAll&MaxResults=10&start=1&SearchTarget=Book&output=xml&Version=20131101"
    params ={
        'ttbkey' : ALADINAPI,
        "Query":Query,
        'QueryType' : 'Keyword',
        'MaxResults' : 10,
        'SearchTarget' : 'Book',
        'output' : 'js',
        'Version' : 20131101
    }
    # e 의 url 처럼 url에 더해서 알려줘 똑똑한 코드로
    response = requests.get(url, params=params)
    return response.json()

def aladin_best():
    url = " http://www.aladin.co.kr/ttb/api/ItemList.aspx"
    # e="http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=[TTBKey]&QueryType=ItemNewAll&MaxResults=10&start=1&SearchTarget=Book&output=xml&Version=20131101"
    params ={
        'ttbkey' : ALADINAPI,
        'QueryType' : 'Bestseller',
        'SearchTarget':'Book',
        "Start":1,
        'MaxResults' : 10,
        'SearchTarget' : 'Book',
        'Output' : 'js',
        'Version' : 20131101
    }
    # e 의 url 처럼 url에 더해서 알려줘 똑똑한 코드로
    response = requests.get(url, params=params)
    return response.json()


@app.get("/aladin/bestseller")
def aladinBestseller():
    '''알라딘 베스트셀러 API 메인페이지용'''
    return aladin_best()

class aladin_searchItem(BaseModel):
    Query: str
@app.post("/aladin/search")
def aladinSearch(data: aladin_searchItem):
    '''알라딘 검색 API 메인페이지용'''
    ad=aladin_search(data.Query)
    for item in ad['item']:
        item['category'] = item['categoryName'].split('>')[1]
    return ad



@app.get("/my_book")
def my_book(token: Optional[str] = Header(None)):
    '''내가 저장한 책중 하나를 랜덤으로 가져와 이미지를 base64 인코딩하여 반환하는 API 메인페이지용 '''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴⚠️
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book')
            doc_list = doc_ref.get()
            saved_book = []
            for doc in doc_list:
                dc=doc.to_dict()
                mark_list=db.collection(u'bookmark').document().where("book_id","==",doc.id).get()
                list_mark=[]
                for mark in mark_list:
                    list_mark.append(mark.to_dict())
                dc['bookmark']=list_mark
                if len(list_mark)==0:
                    saved_book.append(dc)
            max_num = len(saved_book)
            if max_num == 0:
                return {"result": "empty"}
            random_num = random.randint(0, max_num - 1)
            book = saved_book[random_num]
            print(book)
            # 책갈피도 랜덤으로 가져오기
            random_num = random.randint(0, len(book['bookmark']) - 1)
            book['bookmark'] = book['bookmark'][random_num]
            image_path = book['bookmark']['image_path']
            image_name = book['bookmark']['image_name']
            # 이미지 파일을 base64 인코딩하여 JSON과 함께 반환
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
            return {
                "result": "success",
                "image_data": encoded_string,
                "image_name": image_name,
                "memo":book['memo'],
                "title":book['title'],
                "createdAt":book['createdAt'].strftime("%Y-%m-%d %H:%M")
            }
        else:
            return {"result": "fail"}
    except Exception as e:
        return {"result": "fail", "error": str(e)}
    # front 코드#
# <!DOCTYPE html>
# <html lang="en">
# <head>
#     <meta charset="UTF-8">
#     <meta name="viewport" content="width=device-width, initial-scale=1.0">
#     <title>Image Display Example</title>
# </head>
# <body>
#     <h1>Received Image</h1>
#     <img id="image" src="" alt="Loaded from server">
#     <script>
#         // 서버의 API 주소
#         const apiUrl = 'http://localhost:8000/my_book';

#         // Fetch API를 사용하여 서버로부터 데이터를 요청
#         fetch(apiUrl)
#             .then(response => response.json())
#             .then(data => {
#                 if (data.result === "success") {
#                     // 이미지 태그의 src 속성을 설정
#                     const imgElement = document.getElementById('image');
#                     imgElement.src = 'data:image/jpeg;base64,' + data.image_data;
#                 } else {
#                     console.error('Failed to load image:', data.error || 'Unknown error');
#                 }
#             })
#             .catch(error => {
#                 console.error('Error fetching image:', error);
#             });
#     </script>
# </body>
# </html>



@app.get("/myBookList") #추천 받으면 timestamp를 user 필드에 저장
def my_book_list(token: Optional[str] = Header(None)):
    '''추천 받은 책 이미지 url을 반환하는 API 메인페이지용 '''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            user_prev_recommend = collection_ref.document(user_info['user_id']).get().to_dict()['prev_recommend']
            if user_prev_recommend == "":
                return {"result": "empty"}
            else:
                doc_ref = collection_ref.document(user_info['user_id']).collection(u'recommend').document(user_prev_recommend)
            doc_list = doc_ref.get().to_dict()
            book_list = []
            book_list.append(doc_list['book2_image_url'])
            book_list.append(doc_list['book3_image_url'])
            book_list.append(doc_list['book1_image_url'])
                
            return {"result": "success", "book_list": book_list}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}




class diffusionItem(BaseModel):
    prompt: str
    book_id: str

@app.post("/diffusion")
def create_item( data: diffusionItem, token: Optional[str] = Header(None)):
    try:
        '''diffusion 이미지 생성 API 저장하기에서 이미지 생성하는 API prompt에 한글 문장을 입력하면 이미지를 생성하여 반환하는 API image encodeing해서 보냄 decoding 해야함'''
        if token == "undefined":
            return {"status": "fail"}
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            image_list=[]
            translated = translator.translate(data.prompt).text
            translated= '\"' + translated + ' \"'
            # 번역된 문장 이미지 생성에 알맞는 Prompt로 변경
            response = model.generate_content("Change the next sentence"+translated+"for prompt English sentence suitable for image creation.")
            print(response.text)
            for i in range (3):
                # result=diffusion(response.text)
                # print(result)
                # # return templates.TemplateResponse('index.html', {'request': request, 'user': data.prompt})
                # image_path = result
                # image_name = result
                image_path = f"tmp0.jpg"
                image_name = f"tmp0.jpg"
                with open(image_path, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                image_list.append({"image_data": encoded_string, "image_name": image_name})
            # doc_ref = db.collection(u'bookmark').document()
            # doc_ref.update({
            #     "book_id": data.book_id,
            #     "image_path": image_path,
            #     "image_name": image_name,
            #     "memo":data.prompt,
            #     "my_think":data.prompt,
            # })
            # doc_id = doc_ref.id
            
            return {"status": "success", "image_list":image_list}
        else:
            return {"status": "fail"}
    except Exception as e:
        print(e)
        return {"status": "fail"}
    
class saveBookmark(BaseModel): ## 책갈피 3개 중 하나 선택해서 저장한 것
    book_id: str
    memo: str
    my_think: str
    image_path: str
@app.post("/saveBookmark")
def save_bookmark(data: saveBookmark, token: Optional[str] = Header(None)):
    try:
        '''책갈피 저장하는 API bookmark은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
        if token == "undefined":
            return {"status": "fail"}
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            doc_ref = db.collection(u'bookmark').document()
            doc_ref.set({
                "book_id": data.book_id,
                "image_path": data.image_path,
                "image_name": data.image_path,
                "memo": data.memo,
                "my_think": data.my_think,
                "like": 0,
                "createdAt": datetime.now(tz=timezone(timedelta(hours=9))),
                "dislike": 0,
                "likeUser": [],
                "dislikeUser": [],
            })
            with open(data.image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            doc_id = doc_ref.id
            return {"status": "success", "image": encoded_string, "bookmark_id": doc_id}
        else:
            return {"status": "fail"}
    except Exception as e:
        return {"status": "fail"}

class Loadbookmark(BaseModel):
    book_id: str
@app.post("/loadBookmark")
def loadBookmark(data:Loadbookmark,token: Optional[str] = Header(None)):
    '''책갈피 정보를 가져오는 API bookmark은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'bookmark')
            doc_ref = collection_ref.where("book_id","==",data.book_id).get()
            bookmark_list = []
            for doc in doc_ref:
                bookmark = doc.to_dict()
                with open(bookmark['image_path'], "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                bookmark['encoding_image'] = encoded_string
                bookmark_list.append(bookmark)
            return {"result": "success", "bookmark_list": bookmark_list}
        else:
            return {"result": "fail"}
    except Exception as e:
        return {"result": "fail", "error": str(e)}

class edittBookmark(BaseModel): ## 책갈피 3개 중 하나 선택해서 저장한 것
    bookmark_id: str
    memo: str
    my_think: str
    image_path: str
@app.post("/editBookmark")
def editBookmark(token: Optional[str] = Header(None), bookmark: Optional[str] = Header(None)):
    '''책갈피 이미지 수정하기 API 아직 개발중 완성되면 맞춰 개발 예정'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'bookmark')
            doc_ref = collection_ref.document(bookmark)
            bookmark = doc_ref.get().to_dict()
            with open(bookmark['image_path'], "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            bookmark['encoding_image'] = encoded_string
            return {"result": "success", "bookmark": bookmark}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}


class saveBook(BaseModel):
    title: str
    genre: str
    link: str
    image: str
    author: str
    discount: int
    publisher: str
    pubdate: str
    isbn: str
    description: str
@app.post("/saveBook")
def saveBook(data:saveBook,token: Optional[str] = Header(None)):
    '''책 정보를 저장하는 API book은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book').document()
        #      title: item.title,
        # link: item.link,
        # image: item.cover, // Use 'cover' from your API response
        # author: item.author,
        # discount: item.priceSales, // Use 'priceSales' for discount if applicable
        # publisher: item.publisher,
        # pubdate: item.pubDate,
        # isbn: item.isbn13 || item.isbn,
        # description: item.description,
        # genre: item.category,
            save_data={
                "title": data.title,
                "link": data.link,
                "image": data.image,
                "author": data.author,
                "discount": data.discount,
                "publisher": data.publisher,
                "pubdate": data.pubdate,
                "isbn": data.isbn,
                "description": data.description,
                "genre": data.genre,
                "createdAt": datetime.now(tz=timezone(timedelta(hours=9))),
            }
            doc_ref.set(save_data)
            return {"result": "success", "book_id": doc_ref.id}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}



@app.get("/loadBook")
def loadBook(token: Optional[str] = Header(None), book: Optional[str] = Header(None)):
    '''책 정보를 가져오는 API book은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book').document(book)
            book = doc_ref.get().to_dict()
            return {"result": "success", "book": book}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}
    

@app.get("/deleteBook")
def deleteBook(token: Optional[str] = Header(None), book: Optional[str] = Header(None)):
    '''책 정보를 삭제하는 API book은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book').document(book)
            doc_ref.delete()
            return {"result": "success"}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}

@app.get("/myLibrary")
def myLibrary(token: Optional[str] = Header(None)):
    '''내 서재에 있는 책들을 가져오는 API 책들을 리스트로 반환 book_id도 들어가 있음 이미지도 encoding 해서 보내줌 '''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book')
            doc_list = doc_ref.get()
            book_list = []
            for doc in doc_list:
                book = doc.to_dict()
                book['book_id'] = doc.id
                #key값 변경
                # with open(book['image_path'], "rb") as image_file:
                #     encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                # book['encoding_image'] = encoded_string
                book_list.append(book)
            return {"result": "success", "book_list": book_list}
        else:
            return {"result": "fail"}
    except Exception as e:
        return {"result": "fail", "error": str(e)}

class catSave(BaseModel):
    catName: str
@app.post("/saveCat")
def saveCat(data:catSave,token: Optional[str] = Header(None)):
    '''카테고리 저장하는 API'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id'])
            doc_ref.update({
                "catName": data.catName
            })
            with open(data.catName, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            return {"result": "success", "catImg": encoded_string}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}




@app.get("/userInfo")
def userInfo(token: Optional[str] = Header(None)):
    '''유저 정보를 가져오는 API'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id'])
            user = doc_ref.get().to_dict()
            docs_ref = collection_ref.document(user_info['user_id']).collection(u'book')
            doc_list = docs_ref.get()
            book_list = []
            for doc in doc_list:
                book = doc.to_dict()
                book_id=doc.id
                mark_list=[]
                bookmark = db.collection(u'bookmark').document().where("book_id","==",book_id).get()
                for doc in bookmark:
                    mark_list.append(doc.to_dict())
                book['bookmark']=mark_list
                book_list.append(book)
            
            # 5/17 추가
            if len(book_list) < 10:
                level="0"
            elif len(book_list) < 20:
                level="1"
            elif len(book_list) < 30:
                level="2"
            else:
                level="3"
            with open(user['catName']+level+".jpg", "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            user['catImg'] = encoded_string
            return {"result": "success", "user": user, "book_list": book_list}
        else:
            return {"result": "fail"}
    except Exception as e:
        return {"result": "fail", "error": str(e)}



@app.get ("/shareBook")
def shareBook(token: Optional[str] = Header(None)):
    '''책 정보를 공유하는 API book은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        book_list = db.collection(u'bookmark').get()
        return_list=[]
        for doc in book_list:
            book = doc.to_dict()
            if user_info['user_id'] in book['likeUser']:
                book['user_select'] = True
                book['user_like'] = True
                book['user_dislike'] = False
            elif user_info['user_id'] in book['dislikeUser']:
                book['user_select'] = True
                book['user_like'] = False
                book['user_dislike'] = True
            book['bookmark_id'] = doc.id
            with open(book['image_path'], "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            book['encoding_image'] = encoded_string
            return_list.append(book)
        
        return {"result": "success", "book_list": return_list}
    except Exception as e:
        return {"result": "fail", "error": str(e)}

class likeBookmark(BaseModel):
    like : bool
    dislike : bool
@app.post("/likeBookmark")
def likeBookmark(data:likeBookmark,token: Optional[str] = Header(None), bookmark: Optional[str] = Header(None)):
    '''책갈피에 좋아요를 누르는 API bookmark은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            doc_ref = db.collection(u'bookmark').document(bookmark)
            doc = doc_ref.get().to_dict()
            if user_info['user_id'] in doc['likeUser'] or user_info['user_id'] in doc['dislikeUser']:
                if data.like:
                    if user_info['user_id'] in doc['likeUser']:
                        doc['like'] -= 1
                        doc['likeUser'].remove(user_info['user_id'])
                    else:
                        doc['dislike'] -= 1
                        doc['dislikeUser'].remove(user_info['user_id'])
                        doc['like'] += 1
                        doc['likeUser'].append(user_info['user_id'])
                elif data.dislike:
                    if user_info['user_id'] in doc['dislikeUser']:
                        doc['dislike'] -= 1
                        doc['dislikeUser'].remove(user_info['user_id'])
                    else:
                        doc['like'] -= 1
                        doc['likeUser'].remove(user_info['user_id'])
                        doc['dislike'] += 1
                        doc['dislikeUser'].append(user_info['user_id'])

            else:
                if data.like:
                    doc['like'] += 1
                    doc['likeUser'].append(user_info['user_id'])
                if data.dislike:
                    doc['dislike'] += 1
                    doc['dislikeUser'].append(user_info['user_id'])

            doc_ref.update(doc)
            return {"result": "success", "bookmark": doc}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}



@app.get("/loadMyBook")
def loadMyBook(token: Optional[str] = Header(None)):
    '''내가 저장한 책들을 가져오는 API book은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            book_dict={}
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book')
            doc_list = doc_ref.get()
            book_list = []
            for doc in doc_list:
                book = doc.to_dict()
                book['book_id'] = doc.id
                # gerne로 dict 만들기
                if book['genre'] not in book_dict:
                    book_dict[book['genre']]=[]
                book_dict[book['genre']].append(book)
            return {"result": "success", "book_list": book_dict}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}
    
class recommendItem(BaseModel):
    select_user_genre: str 
    want_recommend: str
@app.post("/userAIchoice")
def userAIchoice(data:recommendItem,token: Optional[str] = Header(None)):
    '''유저 정보를 통한 AI 추천 API 아직 개발중 완성되면 코드 부착'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book').where("genre","==",data.select_user_genre).get()
            book_list = []
            for doc in doc_ref:
                book = doc.to_dict()
                book_list.append(book)
            # 여기서 멀티 AI 추천 알고리즘을 통해 추천 책을 가져옴

            return {"result": "success"}
        else:
            return {"result": "fail"}
        
    except Exception as e:
        return {"result": "fail", "error": str(e)}




## 유저 정보의 책들을 가져오는 API 폐지
@app.get("/userBook")
def userBook(token: Optional[str] = Header(None)):
    '''유저 정보의 책들을 가져오는 API'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book')
            doc_list = doc_ref.get()
            book_list = []
            for doc in doc_list:
                book = doc.to_dict()
                book_id=doc.id
                mark_list=[]
                bookmark = db.collection(u'bookmark').document().where("book_id","==",book_id).get()
                for doc in bookmark:
                    mark_list.append(doc.to_dict())
                book['bookmark']=mark_list
                book_list.append(book)
            return {"result": "success", "book_list": book_list}
        else:
            return {"result": "fail"}
    except Exception as e:
        return {"result": "fail", "error": str(e)}

@app.get("/recommendPage")
def findRecommend(token: Optional[str] = Header(None)):
    '''추천 받았던 책이 있다면 가져오는 API'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user').document(user_info['user_id'])
            user = doc_ref.get().to_dict()
            if user['prev_recommend'] == "":
                return {"result": "empty"}
            else:
                doc_ref = collection_ref.document(user_info['user_id']).collection(u'recommend').document(user['prev_recommend'])
                doc_item = doc_ref.get().to_dict()
                book_list=[]
                book_list.append(aladin_search(doc_item['book1_title'])['item'][0])
                book_list.append(aladin_search(doc_item['book2_title'])['item'][0])
                book_list.append(aladin_search(doc_item['book3_title'])['item'][0])
                return {"result": "success", "prev_recommend":book_list}
        else:
            return {"result": "fail"}
    except Exception as e:
        return {"result": "fail", "error": str(e)}
    
class recommendItem(BaseModel):
    user_genre: str
    user_mood: str
    user_interest: str

@app.post("/findRecommend")
def findRecommend(data:recommendItem,token: Optional[str] = Header(None)):
    '''다시 추천 찾는 페이지 확인하기 현재 추천시스템 알고리즘 개발중으로 더미데이터로 대체'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        
        if user_info:
            result=AIchoice(data.user_genre,data.user_mood,data.user_interest)
            item1=aladin_search(result[0])
            item2=aladin_search(result[1])
            item3=aladin_search(result[2])
            dummy_save = {
                "book1_title":item1['item'][0]['title'],
                "book2_title":item2['item'][0]['title'],
                "book3_title":item3['item'][0]['title'],
                "book1_image_url":item1['item'][0]['cover'],
                "book2_image_url":item2['item'][0]['cover'],
                "book3_image_url":item3['item'][0]['cover']
            }
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'recommend').document()
            doc_ref.set(dummy_save)
            collection_ref.document(user_info['user_id']).update({"prev_recommend":doc_ref.id})
            return {"result": "success", "books": [item1['item'][0],item2['item'][0],item3['item'][0]]}
    except Exception as e:
        return {"result": "fail", "error": str(e)}