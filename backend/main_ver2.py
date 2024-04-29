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
app = FastAPI()

logging.basicConfig(
    filename="app.log",  # 로그 파일의 경로 및 이름 설정
    level=logging.ERROR,  # 로그 레벨을 설정합니다. 여기서는 ERROR 이상의 로그만 기록됩니다.
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"  # 로그 메시지의 형식을 설정합니다.
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://dev.coupilot.net",
    "https://www.coupilot.net",
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
        images[i].save(f'tmp{i}.jpg',"JPEG")
    end = time.time_ns()
    original_sd = f"{(end - start) / 1e6:.1f}"



    print(f"Execution time -- {original_sd} ms\n")
    return f'tmp{i}.jpg'



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
    referralCode:str
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
                "phoneNumber": data.phoneNumber
            }
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
        # 반환 헤더에 csrf_token를 추가한다.
        return {"session_cookie":session_cookie}
    except:
        logging.error(f" 실패 login,{datetime.now()} {traceback.format_exc()}")
        return {"result":"fail"}
@app.get('/login/passwordReset') ## 일단은 만드는데 추후 보안 관련해서 생각해봐야할듯
def can_reset_password(email: Optional[str] = Header(None),phoneNumber: Optional[str] = Header(None)):
    try:
        if email is None or email =="undefined":
            return {"result":"fail"}
        elif phoneNumber is None or phoneNumber =="undefined":
            return {"result":"fail"}
        else:
            #차후에 이메일로 비밀번호 재설정 링크를 보내줘야함
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
        'QueryType' : 'ItemNewAll',
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
    return aladin_search(data.Query)


@app.get("/my_book")
def my_book(token: Optional[str] = Header(None)):
    '''내가 저장한 책중 하나를 랜덤으로 가져와 이미지를 base64 인코딩하여 반환하는 API 메인페이지용 '''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book')
            doc_list = doc_ref.get()
            max_num = len(doc_list)
            if max_num == 0:
                return {"result": "empty"}
            random_num = random.randint(0, max_num - 1)
            book = doc_list[random_num].to_dict()
            image_path = book['image_path']
            image_name = book['image_name']
            # 이미지 파일을 base64 인코딩하여 JSON과 함께 반환
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
            return {
                "result": "success",
                "image_data": encoded_string,
                "image_name": image_name,
                "content":book['content'],
                "my_think":book['my_think']
            }
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
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'recommend').document(user_prev_recommend)

            doc_list = doc_ref.get()
            if len(doc_list) == 0:
                return {"result": "empty"}
            book_list = []
            for doc in doc_list:
                book = doc.to_dict()
                book_list.append(book['book1_image_url'])
                book_list.append(book['book2_image_url'])
                book_list.append(book['book3_image_url'])
                
            return {"result": "success", "book_list": book_list}
    except Exception as e:
        return {"result": "fail", "error": str(e)}




class diffusionItem(BaseModel):
    prompt: str

@app.post("/diffusion")
def create_item( data: diffusionItem, token: Optional[str] = Header(None)):
    try:
        '''diffusion 이미지 생성 API 저장하기에서 이미지 생성하는 API prompt에 한글 문장을 입력하면 이미지를 생성하여 반환하는 API image encodeing해서 보냄 decoding 해야함'''
        if token == "undefined":
            return {"status": "fail"}
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            translated = translator.translate(data.prompt, dest='en').text  # 한글 문장을 영어로 번역
            translated= '\"' + translated + ' \"'
            # 번역된 문장 이미지 생성에 알맞는 Prompt로 변경
            response = model.generate_content("Change the next sentence"+data.prompt+"for prompt English sentence suitable for image creation.")
            result=diffusion(response)
            # return templates.TemplateResponse('index.html', {'request': request, 'user': data.prompt})
            image_path = result
            image_name = result
            doc_ref = db.collection(u'user').document(user_info['user_id']).collection(u'book').document()
            doc_ref.set({
                "image_path": image_path,
            })
            doc_id = doc_ref.id
            with open(image_path, "rb") as image_file:
                encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            
            return {"status": "success", "image_data": encoded_string, "image_name": image_name,"book_id":doc_id}
    except Exception as e:
        print(e)
        return {"status": "fail"}

class saveBook(BaseModel):
    book_title: str
    book_genre: str
    content: str
    my_think: str
    book_image_url: str
@app.post("/saveBook")
def saveBook(data:saveBook,token: Optional[str] = Header(None), book: Optional[str] = Header(None)):
    '''책 정보를 저장하는 API book은 책의 ID를 diffusion 이미지 생성때 준 ID를 사용'''
    try:
        if token == "undefined":
            return {"result": "fail"}
        
        user_info = verifying(token)  # Token을 검증하여 사용자 정보를 가져옴
        if user_info:
            collection_ref = db.collection(u'user')
            doc_ref = collection_ref.document(user_info['user_id']).collection(u'book').document(book)
            doc_ref.update({
                "book_genre": data.book_genre,
                "book_title": data.book_title,
                "content": data.content,
                "my_think": data.my_think,
                "book_image_url": data.book_image_url
            })
            return {"result": "success"}
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
                with open(book['image_path'], "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                book['encoding_image'] = encoded_string
                book_list.append(book)
            return {"result": "success", "book_list": book_list}
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
            return {"result": "success", "user": user}
    except Exception as e:
        return {"result": "fail", "error": str(e)}




## 유저 정보의 책들을 가져오는 API
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
                book_list.append(book)
            return {"result": "success", "book_list": book_list}
    except Exception as e:
        return {"result": "fail", "error": str(e)}

