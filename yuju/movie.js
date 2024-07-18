// 발급받은 API 키(유주)
const apiKey = "ab46da0ed92dee984ca09983132ee090";

// 기본 URL + API key
const url = `https://api.themoviedb.org/3/api_key=${apiKey}&language=ko-KR`;

// 개봉일 날짜 - 빼고 년월일 넣는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);

  // 월, 일을 '월'이라는 문자열로 대체하여 포맷팅
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

// 최신 영화 불러오는 함수 (Latest는 하나만 불러오기에 Trend로 불러와야 함.)
const getLatestMovie = async () => {
  let latestURL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=ko-KR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmU2ZjI1OGRkZjAxZTg5MGNlN2RjMGRiOTdlZTVkNiIsIm5iZiI6MTcyMTEwODE0MS45NDQ0MDcsInN1YiI6IjY2OTRmZDRiNmU0ZTVjMDBlZjY2MDZkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ySS8Z3tUy6tNo7lZ3hUyM-wzWDl3VRlHWSqX7xfYTaQ",
    },
  };

  const response = await fetch(latestURL, options);
  const data = await response.json();
  for (let i = 0; i < 10; i++) {
    const latestMovie = data.results[i];
    latestMovieRender(latestMovie);
  }
};

// 최신 영화 Render
const latestMovieRender = (movie) => {
  const formattedDate = formatDate(movie.release_date);
  let latestHTML = `
    <div class = "MovieInfo" onclick="openDetailPage(${movie.id})">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} 포스터" style="width: 200px; height: 300px; border-radius: 5%; border-radius: 5%; border: 0.01px solid gray; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
">`
            : "<p>포스터 이미지가 없습니다.</p>"
        }
        <h1>${movie.title}</h1>
        <p>${formattedDate}</p>
    </div>
    `;
  document.getElementById("latest-movie-board").innerHTML += latestHTML;
};

// 인기 영화 불러오는 함수
const getPopularMovie = async () => {
  let popularURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmU2ZjI1OGRkZjAxZTg5MGNlN2RjMGRiOTdlZTVkNiIsIm5iZiI6MTcyMTEwODE0MS45NDQ0MDcsInN1YiI6IjY2OTRmZDRiNmU0ZTVjMDBlZjY2MDZkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ySS8Z3tUy6tNo7lZ3hUyM-wzWDl3VRlHWSqX7xfYTaQ",
    },
  };

  const response = await fetch(popularURL, options);
  const data = await response.json();
  for (let i = 0; i < 10; i++) {
    const popularMovie = data.results[i];
    popularMovieRender(popularMovie);
  }
};

// 인기 영화 Render
const popularMovieRender = (movie) => {
  const formattedDate = formatDate(movie.release_date);
  let popularHTML = `
    <div class = "MovieInfo" onclick="openDetailPage(${movie.id})">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} 포스터" style="width: 200px; height: 300px; border-radius: 5%; border-radius: 5%; border: 0.01px solid gray; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
">`
            : "<p>포스터 이미지가 없습니다.</p>"
        }
        <h1>${movie.title}</h1>
        <p>${formattedDate}</p>
    </div>
    `;
  document.getElementById("popular-movie-board").innerHTML += popularHTML;
};

window.onload = () => {
  getLatestMovie();
  getPopularMovie();
};

function openTab(event, tabName) {
  var i, tabcontent, tabbuttons;

  // 모든 탭 콘텐츠 숨기기
  tabcontent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    tabcontent[i].classList.remove("active");
  }

  // 모든 탭 버튼의 active 클래스 제거
  tabbuttons = document.getElementsByClassName("tab-button");
  for (i = 0; i < tabbuttons.length; i++) {
    tabbuttons[i].classList.remove("active");
  }

  // 클릭한 탭의 콘텐츠 보여주기
  document.getElementById(tabName).style.display = "flex";
  document.getElementById(tabName).classList.add("active");

  // 클릭한 탭 버튼에 active 클래스 추가
  event.currentTarget.classList.add("active");
}

// 초기 탭 열기
document.getElementById("popular").style.display = "flex";
document.getElementById("popular").classList.add("active");

document.addEventListener("DOMContentLoaded", function () {
  const previewList = document.querySelector(".preview-list");
  const iframes = document.querySelectorAll(".preview-item iframe");
  let scrollInterval;

  function startAutoScroll() {
    scrollInterval = setInterval(() => {
      if (
        previewList.scrollLeft <
        previewList.scrollWidth - previewList.clientWidth
      ) {
        previewList.scrollLeft += 1;
      } else {
        previewList.scrollLeft = 0;
      }
    }, 20); // 스크롤 속도 조절 (숫자가 작을수록 빠름)
  }

  function stopAutoScroll() {
    clearInterval(scrollInterval);
  }

  function onIframePlay() {
    stopAutoScroll();
  }

  function onIframePause() {
    startAutoScroll();
  }

  previewList.addEventListener("mouseenter", stopAutoScroll);
  previewList.addEventListener("mouseleave", startAutoScroll);

  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      iframeDocument.addEventListener("play", onIframePlay, true);
      iframeDocument.addEventListener("pause", onIframePause, true);
    });
  });

  startAutoScroll();
});

// 상세페이지 열기
const openDetailPage = (movieID) => {
  const url =
    "../JeongChan/design_version/design_Mvi_Detail.html?movieID=" + encodeURIComponent(movieID);
  // window.location.href = url;
  window.open(url, "_blank");
};
