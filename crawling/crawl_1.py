import requests 
from bs4 import BeautifulSoup
import pandas as pd

# CID : 카테고리(소설 : 1, 에세이 :55889 , 자기계발 : 336)

items = []
lists = []
results = []
KEY = 'ttbdmlcjf10201707001'

for page in range(1,51): # 페이지 입력
    print(page)
    url = "https://www.aladin.co.kr/shop/wbrowse.aspx?BrowseTarget=List&ViewRowsCount=50&ViewType=Detail\
    &PublishMonth=0&SortOrder=2&page={}&Stockstatus=0&PublishDay=84&CustReviewRankStart=0&CustReviewCountStart=0&PriceFilterMax=-1\
    &CID=336&SearchOption=".format(page)
    res = requests.get(url) 
    res.raise_for_status() # 정상 200
    soup = BeautifulSoup(res.text, "lxml")
    
    # 페이지에 있는 도서 링크(50개)
    book_links = soup.select('ul > li > a.bo3')
    links = []
    for book_link in book_links:
        a= book_link['href']
        links.append(a)
    for link in links:
        res = requests.get(link)
        soup = BeautifulSoup(res.text, "lxml")
        try:
            ISBN = soup.select('div.conts_info_list1 > ul > li')
            ISBN = ISBN[-1].text[-13:]
        except:
            pass
    
        #data = [ISBN]
        results.append(ISBN)

len(results)

import pickle
ISBN336_01_51 = pd.DataFrame(results)
ISBN336_01_51.to_pickle('ISBN336_01_51.plk')

# 링크
url_look_list = []

#API 키 발급
KEY = 'ttbdmlcjf10201707001' 

# 링크 저장
for isbn in results:
    url_look = 'https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey={}&itemIdType=isbn13&ItemId={}&output=JS&Version=20131101&OptResult=authors,reviewList,fulldescription,fulldescription2,Story,categoryIdList'.format(KEY, isbn)
    url_look_list.append(url_look)
print(url_look_list)

# 저장한 링크에서 책 정보 가져오기
items = []
lists = []

for url_look in url_look_list:
    try:
        response = requests.get(url_look)
        response.raise_for_status()  # 오류가 발생하면 예외를 발생

        text = response.json()  # JSON 응답을 파싱

        item = text.get('item', [])  # 'item' 키가 있는 경우 해당 값을 가져옴
        if item:
            # 도서 정보
            title = item[0].get('title', '')
            author = item[0].get('author', '')
            pubDate = item[0].get('pubDate', '')
            description = item[0].get('description', '')
            isbn13 = item[0].get('isbn13', '')
            categoryID = item[0].get('categoryId', '')
            categoryName = item[0].get('categoryName', '')
            salesPoint = item[0].get('salesPoint', '')
            adult = item[0].get('adult', '')
            rank = item[0].get('customerReviewRank', '')
            fullDes = item[0].get('fullDescription', '')
            fullDes2 = item[0].get('fullDescription2', '')
            story = item[0].get('subInfo', {}).get('story', '')

            # 리뷰 정보
            reviewList = item[0].get('reviewList', [])
            if reviewList:
                reviewrank = reviewList[0].get('reviewRank', 0)
                reviewtitle = reviewList[0].get('title', 0)
                review_w = reviewList[0].get('writer', 0)
            else:
                reviewrank = 0
                reviewtitle = 0
                review_w = 0

            # 리스트에 도서 정보를 추가
            lists.append([title, author, pubDate, description, isbn13, categoryID, categoryName,
                          salesPoint, adult, rank, fullDes, fullDes2, story, reviewrank, reviewtitle, review_w])
    except requests.exceptions.RequestException as e:
        print(f"요청 중 오류 발생: {e}")

# 데이터프레임을 생성
cols = ['title', 'author', 'pubDate', 'description', 'isbn13', 'categoryID', 'categoryName',
        'salesPoint', 'adult', 'rank', 'fullDes', 'fullDes2', 'story', 'reviewrank', 'reviewtitle', 'review_w']
df = pd.DataFrame(lists, columns=cols)
