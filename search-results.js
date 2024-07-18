//변수 선언
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Yzg5M2RlN2UxMTFiNjFlNGM1ZDQ2ODIyN2UwYTZjOCIsIm5iZiI6MTcyMTA0OTE1NC4xNTk0MzYsInN1YiI6IjY2OTQ3MjU1YWY2MzU5NDIwZDAyOGNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1ywthX0pc-265Z6X-wSh9LlCdiG75bmTGUvI5cD7HR0";
let searchUrl = new URL(`https://api.themoviedb.org/3/search/multi`);
let recommendUrl;
let searchResultList = [];

//API key token 가져오기
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

//url에서 데이터 불러오기
const getData = async (url) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
  }
};

//검색
const search = async (event) => {
  event.preventDefault();
  const query = document.querySelector("#search-input__result").value;
  console.log(query); // 검색어 확인

  // 검색 기초 값 설정
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("language", "ko-KR");
  searchUrl.searchParams.set("page", "1");
  const data = await getData(searchUrl);
  searchResultList = data.results;
  // 검색 내용 로컬스토리지에 저장
  localStorage.setItem("searchResults", JSON.stringify(searchResultList));
  render(searchResultList);
};

// 검색한 내용 보여주기
const render = (movies) => {
  let searchBoard = document.querySelector(".search-board");
  searchBoard.innerHTML = ``;

  if (movies.length === 0) {
    searchBoard.innerHTML = `<p>검색 결과가 없습니다.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const title = movie.title || movie.name;
    const originalTitle = movie.original_title;
    const originalName = movie.original_name;
    const releaseDate =
      movie.release_date || movie.first_air_date || "출시 날짜 없음";
    const overview = movie.overview || "설명이 없습니다.";
    const poster = movie.poster_path;

    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
      <div class="search-result">
        <div onclick="recommendation(${
          movie.id
        })" class="col-lg-2 search-result__img">
        ${
          poster
            ? `<img src="https://image.tmdb.org/t/p/w200${poster}" alt="${title} 포스터">`
            : `../JeongChan/No img.png`
        }   
      </div>
        <div class="col-lg-10 search-result__content">
        <div class="search-result__content-title">
          <h2>${title}</h2> <span>(${originalTitle || originalName})</span>
      </div>
          <p>개봉일: ${releaseDate}</p>
          <p>${overview}</p>
        </div>
      </div>
            `;
    searchBoard.appendChild(movieDiv);
  });
};

//추천 영화 데이터를 가져오는 함수
const recommendation = async (id) => {
  const recommendUrl = new URL(
    `https://api.themoviedb.org/3/movie/${id}/similar?language=ko-KR&page=1`
  );
  const response = await fetch(recommendUrl, options);
  const data = await response.json();
  const recommendList = data.results;
  console.log(recommendList);
  recommendRender(recommendList);
};

// 추천 영화 그려주기
const recommendRender = (movies) => {
  let recommendBoard = document.querySelector(".recommend-board");
  recommendBoard.innerHTML = ``;

  if (movies.length === 0) {
    recommendBoard.innerHTML = `<p>이 영화와 비슷한 영화가 없습니다.</p>`;
    return;
  }
  movies.forEach((movie) => {
    const poster = movie.poster_path;
    const title = movie.title || movie.name;

    const recommendDiv = document.createElement("div");
    recommendDiv.innerHTML = `
        <div class="recommend-container"onclick="recommendation(${movie.id})">
        ${
          poster
            ? `<img src="https://image.tmdb.org/t/p/w200${poster}" alt="포스터">`
            : "<p>포스터 이미지가 없습니다.</p>"
        } <div class="recommend__title-area">
            <p>${title}</p>
          </div>
        </div>
            `;
    recommendBoard.appendChild(recommendDiv);
  });
};

//함수를 저장하고 결과에 옮기는.. (잘모름)
document.addEventListener("DOMContentLoaded", () => {
  const searchResultList = JSON.parse(localStorage.getItem("searchResults"));
  render(searchResultList);
});

//페이지네이션

//검색 버튼을 눌렀을 때, 작동하게 해주는 함수
document
  .querySelector("#search-form__result")
  .addEventListener("submit", search);
