// 발급받은 API 키(유주)
const apiKey = "ab46da0ed92dee984ca09983132ee090";

// 기본 URL + API key
const url = `https://api.themoviedb.org/3/api_key=${apiKey}&language=ko-KR`;

const defaultImage = "./mingjeong/No img.png";

//nav-var 애니메이션
gsap.from(".navbar-brand", {duration: 1.5, opacity: 0, y: -50, ease: "back"});
gsap.from(".navbar-nav li", {duration: 2, opacity: 0, y: 150, stagger: 0.25});

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
  document.getElementById("latest-movie-board").innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const latestMovie = data.results[i];
    latestMovieRender(latestMovie);
  }
};

// 최신 영화 Render
const latestMovieRender = (movie) => {
  const formattedDate = formatDate(movie.release_date);
  let latestHTML = `
    <div class = "MovieInfo slide" data-movie-id="${
      movie.id
    }" onclick="openDetailPage(${movie.id})" draggable="false">

            <img src="${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : defaultImage
            }" draggable="false" alt="${movie.title} 포스터" ;">

        
        <h1 draggable="false">${movie.title}</h1>
        <p draggable="false">${formattedDate}</p>
    
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
  document.getElementById("popular-movie-board").innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const popularMovie = data.results[i];
    popularMovieRender(popularMovie);
  }
};

// 인기 영화 Render
const popularMovieRender = (movie) => {
  const formattedDate = formatDate(movie.release_date);
  let popularHTML = `
    <div class = "MovieInfo slide" data-movie-id="${
      movie.id
    }" onclick="openDetailPage(${movie.id})" draggable="false">

            <img src="${
              movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : defaultImage
            }" draggable="false" alt="${movie.title} 포스터";">

        <h1 draggable="false">${movie.title}</h1>
        <p draggable="false">${formattedDate}</p>
    </div>
    `;
  document.getElementById("popular-movie-board").innerHTML += popularHTML;
};

window.onload = () => {
  let latestMovieClick = document.getElementById("latest-Movie-btn");
  let popularMovieClick = document.getElementById("popular-Movie-btn");

  latestMovieClick.addEventListener("click", () => {
    document.getElementById("popular-movie-board").innerHTML = "";
    getLatestMovie();
    latestMovieClick.classList.add("active-btn");
    popularMovieClick.classList.remove("active-btn");
  });

  popularMovieClick.addEventListener("click", () => {
    document.getElementById("latest-movie-board").innerHTML = "";
    getPopularMovie();
    popularMovieClick.classList.add("active-btn");
    latestMovieClick.classList.remove("active-btn");
  });

  getPopularMovie();
  popularMovieClick.classList.add("active-btn");
  detailSlider("slider1");
  detailSlider("slider2");
};

//캐러셀 영화재생
document.addEventListener("DOMContentLoaded", function () {
  var carouselElement = document.querySelector("#carouselExampleInterval");
  var carousel = new bootstrap.Carousel(carouselElement, {
    interval: 25000, // 캐러셀 자동 슬라이드 속도 설정 (25초)
  });

  document.querySelectorAll(".carousel-item video").forEach((video) => {
    video.addEventListener("play", function () {
      // 비디오가 재생되면 캐러셀 멈춤
      carousel.pause();
    });

    video.addEventListener("pause", function () {
      // 비디오가 일시 정지되면 캐러셀 재시작
      if (video.currentTime !== video.duration) {
        carousel.cycle();
      }
    });

    video.addEventListener("ended", function () {
      // 비디오가 끝나면 처음 화면으로 돌아감
      video.currentTime = 0;
      carousel.next();
      carousel.cycle();
    });
  });

  // 캐러셀 슬라이드 시 모든 비디오 일시 정지
  carouselElement.addEventListener("slide.bs.carousel", function () {
    document.querySelectorAll(".carousel-item video").forEach((video) => {
      video.pause();
    });
  });
});

// 예고편 스크롤
document.addEventListener("DOMContentLoaded", function () {
  const previewList = document.querySelector(".preview-list");
  let scrollAnimationFrame;
  const scrollSpeed = 1; // 스크롤 속도 조절 (숫자가 클수록 빠름)

  function smoothScroll() {
    if (
      previewList.scrollTop <
      previewList.scrollHeight - previewList.clientHeight
    ) {
      previewList.scrollTop += scrollSpeed;
    } else {
      previewList.scrollTop = 0;
    }
    scrollAnimationFrame = requestAnimationFrame(smoothScroll);
  }

  function startAutoScroll() {
    scrollAnimationFrame = requestAnimationFrame(smoothScroll);
  }

  function stopAutoScroll() {
    cancelAnimationFrame(scrollAnimationFrame);
  }

  previewList.addEventListener("mouseenter", stopAutoScroll);
  previewList.addEventListener("mouseleave", startAutoScroll);

  startAutoScroll();
});

//나가기 버튼 클릭시 창닫기
document.getElementById("close-icon").addEventListener("click", function () {
  // 윈도우 닫기 시도
  window.close();

  // 만약 window.close()가 브라우저 보안 설정 때문에 동작하지 않을 경우
  // 경고창을 띄운다
  if (!window.closed) {
    alert(
      "브라우저 보안 설정으로 인해 페이지를 닫을 수 없습니다. 창을 직접 닫아주세요."
    );
  }
});

// 상세페이지 열기
const openDetailPage = (movieID) => {
  const url =
    "./JeongChan/design_version/design_Mvi_Detail.html?movieID=" +
    encodeURIComponent(movieID);
  // window.location.href = url;
  window.open(url, "_blank");
};

function detailSlider(className) {
  const slider = document.querySelector(`.${className}`);
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", function (e) {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", function () {
    isDown = false;
  });

  slider.addEventListener("mouseup", function () {
    isDown = false;
  });

  slider.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // 드래그 이동 거리에 따라 2배 속도로 슬라이드 이동
    slider.scrollLeft = scrollLeft - walk;
  });
}
