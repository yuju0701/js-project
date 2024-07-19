const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Yzg5M2RlN2UxMTFiNjFlNGM1ZDQ2ODIyN2UwYTZjOCIsIm5iZiI6MTcyMTA0OTE1NC4xNTk0MzYsInN1YiI6IjY2OTQ3MjU1YWY2MzU5NDIwZDAyOGNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1ywthX0pc-265Z6X-wSh9LlCdiG75bmTGUvI5cD7HR0";

let searchUrl = new URL(`https://api.themoviedb.org/3/search/movie`);
let searchResultList = [];
let totalResults = 0; // totalResults 변수 추가
let page = 1; // 현재 페이지를 저장하는 변수
const pageSize = 20; // 페이지당 항목 수
const groupSizes = 5; // 페이지네이션 그룹 크기

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

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

const search = async (event) => {
  event.preventDefault();
  const query = document.querySelector("#search-input__result").value;
  console.log(query); // 검색어 확인

  page = 1; // 새로운 검색 시 페이지 번호를 1로 초기화
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("language", "ko-KR");
  searchUrl.searchParams.set("page", page); // 페이지 번호 설정
  searchUrl.searchParams.set("include_adult", "false");
  searchUrl.searchParams.set("region", "KR");

  const data = await getData(searchUrl);
  searchResultList = data.results;
  totalResults = data.total_results; // totalResults 값 설정
  localStorage.setItem("searchResults", JSON.stringify(searchResultList));
  localStorage.setItem("totalResults", totalResults);
  localStorage.setItem("currentPage", page);
  localStorage.setItem("query", query);
  render(searchResultList);
  paginationRender();
};

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
    let overview = movie.overview || "설명이 없습니다."; // let으로 변경
    const poster = movie.poster_path;

    // overview 길이 제한
    if (overview.length > 200) {
      overview = overview.substring(0, 200) + "...";
    }

    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
      <div class="search-result">
        <div class="col-lg-2 search-result__img">
          <img src="${
            poster
              ? `https://image.tmdb.org/t/p/w200${poster}`
              : "./JeongChan/No img.png"
          }" alt="${title} 포스터">
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

document.addEventListener("DOMContentLoaded", () => {
  const storedSearchResults = JSON.parse(localStorage.getItem("searchResults"));
  const storedTotalResults = parseInt(localStorage.getItem("totalResults"), 10);
  const storedQuery = localStorage.getItem("query");
  const storedPage = parseInt(localStorage.getItem("currentPage"), 10);

  if (storedSearchResults) {
    searchResultList = storedSearchResults;
    totalResults = storedTotalResults;
    page = storedPage;
    searchUrl.searchParams.set("query", storedQuery);
    searchUrl.searchParams.set("language", "ko-KR");
    searchUrl.searchParams.set("page", page);
    render(searchResultList);
    paginationRender();
  }
});

const paginationRender = () => {
  const totalPages = Math.ceil(totalResults / pageSize);
  const pageGroup = Math.ceil(page / groupSizes);
  let lastPage = pageGroup * groupSizes;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSizes - 1) <= 0 ? 1 : lastPage - (groupSizes - 1);

  let paginationHTML = `
    <li class="page-item" onclick="moveToPage(${1})">
      <a class="page-link" href="#"><<</a>
    </li>
    <li class="page-item" onclick="moveToPage(${page - 1})">
      <a class="page-link" href="#">Previous</a>
    </li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})">
      <a class="page-link" href="#">${i}</a>
    </li>`;
  }

  paginationHTML += `
    <li class="page-item" onclick="moveToPage(${page + 1})">
      <a class="page-link" href="#">Next</a>
    </li>
    <li class="page-item" onclick="moveToPage(${totalPages})">
      <a class="page-link" href="#">>></a>
    </li>`;

  document.querySelector(".pagination").innerHTML = paginationHTML;

  if (page === 1) {
    document
      .querySelector(".pagination li:first-child")
      .classList.add("hidden");
    document
      .querySelector(".pagination li:nth-child(2)")
      .classList.add("hidden");
  }

  if (page === totalPages) {
    document.querySelector(".pagination li:last-child").classList.add("hidden");
    document
      .querySelector(".pagination li:nth-last-child(2)")
      .classList.add("hidden");
  }
};

const moveToPage = async (pageNum) => {
  page = pageNum;
  const query = localStorage.getItem("query");
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("language", "ko-KR");
  searchUrl.searchParams.set("page", page);
  searchUrl.searchParams.set("include_adult", "false");
  searchUrl.searchParams.set("region", "KR");
  const data = await getData(searchUrl);
  searchResultList = data.results;
  render(searchResultList);
  paginationRender();
};

document
  .querySelector("#search-form__result")
  .addEventListener("submit", search);
