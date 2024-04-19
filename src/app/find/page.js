"use client";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { Button } from "@mui/material";
import { useState } from "react";

export default function Find() {
  const [touched, setTouched] = useState(false);
  const [recommendationList, setRecommendationList] = useState([
    {
      title: "어린 왕자",
      link: "https://search.shopping.naver.com/book/catalog/32441644071",
      image:
        "https://shopping-phinf.pstatic.net/main_3244164/32441644071.20221019140242.jpg",
      author: "앙투안 드 생택쥐페리",
      discount: "10620",
      publisher: "열린책들",
      pubdate: "20151020",
      isbn: "9788932917245",
      description:
        "문학 평론가 황현산 선생의 번역으로 만나는 어린 왕자!\n\n다른 별에서 온 어린 왕자의 순수한 시선으로 모순된 어른들의 세계를 비추는 전 세계가 사랑하는 아름다운 이야기 『어린 왕자』. 그동안 프랑스어 원문에 대한 섬세한 이해, 정확하고도 아름다운 문장력, 예리한 문학적 통찰을 고루 갖춘 번역으로 문학 번역에서 큰 입지를 굳혀 온 황현산. 그는 이 작품을 새롭게 번역하면서 생텍쥐페리의 진솔한 문체를 고스란히 살려 내기 위해 심혈을 기울였고, 원전의 가치를 충실히 살린 한국어 결정판을 마련하고자 했다.\n\n이 작품은 어떤 소설보다도 독자들에게 오래 기억되며 마음을 움직이는 힘을 가진 문장들로 가득하다. 역자 황현산은 그 힘의 근원을 저자 생텍쥐페리의 진솔하고 열정적인 문체라고 풀이했다. 꾸밈없는 진솔한 문체와 동화처럼 단순해 보이는 이야기 속에 삶을 돌아보는 깊은 성찰을 아름다운 은유로 녹여 내 깊은 여운을 주는 이 작품을 보다 새롭고 완성도 높은 번역으로 다시 한 번 음미하며 읽어 볼 수 있다.",
    },
    {
      title: "어린 왕자 (저학년 필독서 완역본)",
      link: "https://search.shopping.naver.com/book/catalog/46404713619",
      image:
        "https://shopping-phinf.pstatic.net/main_4640471/46404713619.20240316071048.jpg",
      author: "생텍쥐페리",
      discount: "10800",
      publisher: "효리원",
      pubdate: "20240325",
      isbn: "9788928107896",
      description:
        "지구별을 여행하는 어린 왕자의 해맑고도 따뜻한 시선에서 전해지는 감동!\n\n어린 왕자가 들려주는 사람과 만남, 관계 이야기는 초등 저학년 어린이들이 이해하기에는 어려울 수 있습니다. 하지만 해맑은 어린 왕자의 따뜻한 마음만은 아이들도 느낄 수 있습니다. 오히려 코끼리를 삼킨 보아뱀이나, 오후 네 시를 기다리는 여우의 설렘, 장미꽃을 향한 어린 왕자의 사랑을 아이들은 어른들보다 빨리 눈치챌 것입니다. 어린 왕자의 마음과 여우의 말을 찬찬히 되새기면서 읽는다면, 아이들도 가슴속에서 잔잔한 감동이 일 것입니다. 눈에 보이지 않지만 마음으로 보면 보이는 것이 무엇인지, 친구를 사귀는 기쁨이 얼마나 소중한지 어린 왕자처럼 끊임없이 묻고 생각해 보세요. 어린 시절의 책읽기가 평생 아이들 마음에 값진 선물로 남을 것입니다.",
    },
    {
      title: "어린 왕자",
      link: "https://search.shopping.naver.com/book/catalog/44145089630",
      image:
        "https://shopping-phinf.pstatic.net/main_4414508/44145089630.20231122090941.jpg",
      author: "생텍쥐페리",
      discount: "11700",
      publisher: "시공주니어",
      pubdate: "20231125",
      isbn: "9791169253727",
      description:
        "출간 80주년을 맞은 전 세계 스테디셀러!\n지구로 온 가장 순수한 영혼, 『어린 왕자』\nALMA상 ㆍ 안데르센상 노미네이트, 볼로냐 라가치상 수상 작가\n‘베아트리체 알레마냐’의 그림으로 탄생한 가장 사랑받는 고전\n\n비행기 고장 사고로 사막에 불시착한 조종사는 우연히 한 소년을 만난다. 소년은 처음 만난 조종사에게 양 한 마리를 그려 달라고 부탁한다. 소년은 자신이 사는 작은 별에 사랑하는 장미를 남겨 두고 세상을 보기 위해 여행 온 어린 왕자였다. 어린 왕자는 몇 군데의 별을 돌아다닌 후 지구로 와 뱀, 여우와 친구가 된다. 어린 왕자는 함께 시간을 보낸 여우와의 관계를 통해 존재를 길들여 관계 맺는 것과 눈에 보이지 않는 중요함의 의미를 알게 된다. 자신만의 특별한 존재인 장미에 대한 책임감을 깨달은 어린 왕자는 지구를 떠나 자신의 별로 돌아간다.",
    },
  ]);
  const [selectedBook, setSelectedBook] = useState({});

  const recommendationHandler = () => {
    setTouched(true);
  };

  return (
    <div className={styles.container}>
      {touched ? (
        <div className={styles.recommendationContainer}>
          <div className={styles.title}>
            <span>나만의 도서 추천</span>
          </div>
          <div className={styles.bookCover}>
            {recommendationList.map((book, index) => (
              <div key={index} className={styles.book}>
                <img
                  className={
                    selectedBook.isbn === book.isbn
                      ? styles.bookCoverSelected
                      : styles.bookCoverImg
                  }
                  src={book.image}
                  alt={book.title}
                  width={105}
                  height={136}
                  onClick={() => setSelectedBook(book)}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.body}>
          <svg width="71" height="71" viewBox="0 0 71 71" fill="none">
            <rect width="71" height="71" fill="url(#pattern0_22_3)" />
            <defs>
              <pattern
                id="pattern0_22_3"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use href="#image0_22_3" transform="scale(0.0111111)" />
              </pattern>
              <image
                id="image0_22_3"
                width="90"
                height="90"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGuElEQVR4nO2da2gcVRTHpz6qgopVBBEfRVDUj4qKINRHFRFtuufsfLBFk71nGxtRRL9UW7R+KBpFaqyCVnwQ0Q8WPym2PopB7cNq9p5tTRHrKz5ilbZarDWilsi5s2236e7szmbmzuz2/uFCSGbuPec3d+5jZs6J57WJNvj+CVrh05rwd1awW36W36VtV8eJCQeYcKK6aAXL07ar46QV/nI4aPw1bbs6TjwJ8v6Stl0dJ3agHejMacT3p2uFj7HCn5lwTBP0y++S7tFTabctpQn6D5vQCPqTBj2VdttSHPSoSbBge9Kgp9Ju2huHlZrgT1awQxM+vu3uG49r5lwmHKsBayxx0FNoV3xjhU9oBbvEZ/HdykZJGqrRO1Y3A1vXuIVZ4aNpDB3NtGsgE6yusX5f6SWpCc+bphXsqe10Y9gjMikFTo9ZnwwjtlsPcjC+4x9e0pJG6jndbM/O+jo6DHJwN8BuL2lpwifrg04ONlsC3RCyrWcszRiSBGy2ADot3xI1aCTiJiIq6Kj1Zw5yNMNwIK5NBEcEHbV+eb6dOcjNwpYViqxUvBjWtlFBR6l/YunSo1jh3kxCbg42jIsTXgygzZuVwy/kb7GBJhjPLOTGC3t4Ka5NhFbwTA0QK2Krn/DlTEM+FDYOBBsaGBfII3f6J8a1idhgtv7wnLnFzW0Oz4ZthaPWL7YGsI3te2QZmznI1ZIxud643C71J1W3k9MRoEkLfvMgRWZ5eRutCb8JCmhWMMwK1rPC91jha8E4jYuZ8oVyEW9m8i//vKfr7CyOd0Pd3ceLbeUCXhHYmi8EtuOA8cX4JL7BsPh6wG9hICwOPvdp/a1NzVl7CkUr2KcVfMsK18hEU1K4sFzMXVtSc870Epa0EbSFCysQ14gtYlOsPrby1qb2W4mkCmzXCt5ihYvKBf8q6WmtQh1aOuuYUtG/VCu4hwlf0YTf2fQjOmhrxmEtg8e1wneY4C7u7prZ0NburplyrCZ4t/7Gw05pM9B4aFGwXheAqnu6WVdTvsgEG1K3r2NAU1C0wh+Z8ndI0QQ/pW1PoqA39+QuKSn/Sl2A2WVC0EW8lYvQy4T3aoIHZKLTBK9qBUNMsFVeanIGAIRfQLERtmrCDyq2L9cE94tP4pv4aHwtwGzxXRgkDrrV7XlJwbklhddpgr4DM79ZKsU789cBuU/akjbN8pOgT2wRm1pddmYSdJg+mT//ZE256zXBQ/IQp9ZTushgzTfU+LYmfFDqlja8mBULn+He3mNtgZ6sVb5/tCzx5EkbE25rvtfil6zwETlX6vASVj07hF1TFWzq9s8wu6GUQE+WgU6wtj5kWCvHeJYVcsHXCcPQk+VqyIFhPcdLSdwm9piicGPo2B8sncJvUaveVKld7KmCvSDk5MaLf6veVKld7KkeQuqeLE+kHOi4QMOulk/OYg/yMmZPU7Y50M3LgbYkB9qSHGhLcqAtyYG2JAfakhxoS3KgLcmBtiQH2pIcaEtyoC3JgbYkB9qSHGhLcqAtyYG2JAfakhxoS3KgLcmBtiQH2pIcaEtyoC3Jge4U0CaKVMFQJTxtFRMMmlx48hG4gvt0IX+7JrhJImY3F3NnxfVROCf4SZjEJkoErdgstosP4ot8DB/k+YNB8VV8NrE5Ei2cOOioReG/TDjKhB9WLspiLuRyugfOj3IRpgpa2pI2pW0mWCLBnoFNOFqxMXbf7YIOLTAuH22zgqdY5eeHBW9GdcYEeUqdpm7cmEagZwho+Ms+bJx8B3wtt6sEwVd/Nd/IGTm2THCLJnjeRGCl78fe+qAVbE7dQDpYgggtGAwyD9Q+JvgbDMYRzRWr7Qo4rEcvyYKR3AFF5qK6oL9Qc04yqR4yYCi3cZGhS1h6YdIF/2JN+EPaxnL7ltESzb3Ia0Zb+ubNkATcWQ1s5wwW0zklCLW76xSvFW26be5pcoUkHQ4rvIEp75tA9CAlzgomfEMikILsMvBPx4BT+Dcr+EoTfKwJXq/Ery8KUlfkfQnA1wtyl5WLcy8YIf9Uz6ZkUyDrVwlolzi7Sk6mNUH6h/Th1SwKvg/ixqHfQFRwzXCvf069DJSZ15a+eTOY8Gq5E0xaH8KdKUDdoRW+KSkidMGf1fJt3k6a8LxpZkhSqDTBi3KbJgBW6nxBsn8N98KFLnlgRVsKcF4l6dT7rY338F/lgc/DksBqf71OIZIJRitcFmHyWmZ9UuoUrZLJleCzxpBhk40cHUdCz15XfxzGT3XBPz1tOztCI74/PUhnCR9VVis7zc8Kejr6n4s5OTk5OTk5OXlR9T9Kvzw3NEJ21gAAAABJRU5ErkJggg=="
              />
            </defs>
          </svg>

          <span>나만의 도서 추천 받기</span>
          <Button
            fullWidth
            sx={{
              fontSize: "1.25rem",
              color: "#ffffff",
              backgroundColor: "third.main",
              "&:hover": {
                backgroundColor: "third.dark",
              },
            }}
            onClick={recommendationHandler}
          >
            추천 받기
          </Button>
        </div>
      )}

      <Navigation value={2} />
    </div>
  );
}
