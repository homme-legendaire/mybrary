# 가상환경 세팅 노션에 정리
"""
uvicorn main:app --reload --port=8000 --host=0.0.0.0
"""
from fastapi import FastAPI, Request, Header, Response
from pydantic import BaseModel
import uvicorn
import os
import sys
import requests
import json
import uuid
from datetime import datetime, timedelta
import traceback
import random
import time
import queue
from threading import Thread
from diffusers import StableDiffusionPipeline
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
from starlette.middleware.cors import CORSMiddleware

# cred = credentials.Certificate("mybrary-5d2c7-firebase-adminsdk-293xd-725a5b12b0.json")
# firebase_admin.initialize_app(cred)

original = StableDiffusionPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4", torch_dtype=torch.float16, use_safetensors=True,
    ).to("mps")

app = FastAPI()
# 구글 번역기 API 받아오기
translator = Translator()
templates = Jinja2Templates(directory='templates')  # 템플릿 파일 위치 설정

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET","POST"],
    allow_headers=["*"],
)

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



@app.get("/")
def read_root():
    return {"Hello": "World"}


class diffusionItem(BaseModel):
    prompt: str

@app.post("/diffusion")
def create_item( data: diffusionItem):
    try:
        translated = translator.translate(data.prompt, dest='en').text  # 한글 문장을 영어로 번역
        result=diffusion(translated)
        # return templates.TemplateResponse('index.html', {'request': request, 'user': data.prompt})
        image_path = result
        image_name = result
        return FileResponse(image_path, media_type='image/jpeg', filename=image_name)

    except Exception as e:
        print(e)
        return {"status": "fail"}
