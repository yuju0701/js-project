const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Yzg5M2RlN2UxMTFiNjFlNGM1ZDQ2ODIyN2UwYTZjOCIsIm5iZiI6MTcyMTA0OTE1NC4xNTk0MzYsInN1YiI6IjY2OTQ3MjU1YWY2MzU5NDIwZDAyOGNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1ywthX0pc-265Z6X-wSh9LlCdiG75bmTGUvI5cD7HR0";
let searchUrl = new URL(`https://api.themoviedb.org/3/search/multi`);
let recommendUrl;
let searchResultList = [];

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
    return data;
  } catch (error) {
    console.error("Fetch error: ", error);
  }
};

const search = async (event) => {
  event.preventDefault();
  const query = document.querySelector("#search-input__result").value;
  console.log(query);
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("language", "ko-KR");
  searchUrl.searchParams.set("page", "1");
  const data = await getData(searchUrl);
  searchResultList = data.results;
  console.log(data);
  console.log(searchResultList);
  localStorage.setItem("searchResults", JSON.stringify(searchResultList));
  render(searchResultList);
};

const render = (movies) => {
  let searchBoard = document.querySelector(".search-board");
  searchBoard.innerHTML = ``;

  if (movies.length === 0) {
    searchBoard.innerHTML = `<p>검색 결과가 없습니다.</p>`;
    return;
  }

  movies.forEach((movie) => {
    const title = movie.title;
    const name = movie.name;
    const originalTitle = movie.original_title;
    const originalName = movie.original_name;
    const releaseDate = movie.release_date;
    const firstAirDate = movie.first_air_date;
    const overview = movie.overview;
    const poster = movie.poster_path;

    const movieDiv = document.createElement("div");
    movieDiv.innerHTML = `
      <div class="search-result">
        <div onclick="recommendation(${
          movie.id
        })" class="col-lg-4 search-result__img">
        ${
          poster
            ? `<img src="https://image.tmdb.org/t/p/w200${poster}" alt="${
                title || name
              } 포스터">`
            : "<p>포스터 이미지가 없습니다.</p>"
        }   
      </div>
        <div class="col-lg-8">
          <h2>${title || name} (${originalTitle || originalName})</h2>
          <p>개봉일: ${releaseDate || firstAirDate}</p>
          <p>${overview}</p>
        </div>
      </div>
            `;
    searchBoard.appendChild(movieDiv);
  });
};

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

const recommendRender = (movies) => {
  let recommendBoard = document.querySelector(".recommend-board");
  recommendBoard.innerHTML = ``;

  if (movies.length === 0) {
    recommendBoard.innerHTML = `<p>이 영화와 비슷한 영화가 없습니다.</p>`;
    return;
  }
  movies.forEach((movie) => {
    const poster = movie.poster_path;

    const recommendDiv = document.createElement("div");
    recommendDiv.innerHTML = `
        <div onclick="recommendation(${movie.id})">
        ${
          poster
            ? `<img src="https://image.tmdb.org/t/p/w200${poster}" alt="포스터">`
            : "<p>포스터 이미지가 없습니다.</p>"
        }   
        </div>
            `;
    recommendBoard.appendChild(recommendDiv);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const searchResultList = JSON.parse(localStorage.getItem("searchResults"));
  render(searchResultList);
});

document
  .querySelector("#search-form__result")
  .addEventListener("submit", search);
