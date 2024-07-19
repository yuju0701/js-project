import API_TOKEN from "../config.js";

let trailerUrl = "";
let movieID = '653346'; // 1022789, 653346, 519182

// URL에서 쿼리 파라미터를 추출하는 함수
function getQueryParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get('movieID');
  if (paramValue){
    console.log(paramValue);
    movieID = paramValue;
  }
}

getQueryParameter();

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
};

const pfxImage = "https://media.themoviedb.org/t/p/original";
let tmp = ``;
// https://media.themoviedb.org/t/p/w220_and_h330_face/lapab2EdLTL6srTus5ktgr64bqF.jpg


const detailMovieSearch = async (ID) => {
  console.log(ID);
  await fetch(`https://api.themoviedb.org/3/movie/${ID}?language=ko-KR`, options)
    .then((response) => response.json())
    .then((response) => {
      document.querySelector(".mvi-poster").style.backgroundImage = `url(${pfxImage}${response.poster_path}`;
  
      // document.querySelector("#detail-background-img").src = `${pfxImage}${response.backdrop_path})`;
  
      document.querySelector("#detail-title").textContent = response.title;
      document.querySelector(
        "#detail-release-date"
      ).textContent = `${response.release_date.substring(0, 4)}`;
      document.querySelector(".detail-release").textContent = response.release_date;
  
      response.genres.forEach((element) => {
        tmp += `<a href="" data-id="${element.id}">${element.name}</a>`;
      });
      document.querySelector(".detail-genres").innerHTML = tmp;
      tmp = ``;
      document.querySelector(".detail-runtime").textContent = convertIntToTime(
        response.runtime
      );
      // document.querySelector(".detail-rating").textContent =
      //   response.vote_average.toString().substring(0,4);
  
      // document.querySelector(".detail-tagline").textContent = response.tagline;
  
      document.querySelector("#detail-overview").textContent = response.overview;

      getYoutube(ID);
  
      getSlideImage(ID);

      fetchCredits(ID)

      recommendation(ID);
  
  
      // document.querySelector('#detail-container').innerHTML = result;
    })
    .catch((err) => console.error(err));

    
  
}

const getSlideImage = async (ID) => {
  await fetch(`https://api.themoviedb.org/3/movie/${ID}/images?`, options)
          .then(response => response.json())
          .then(response => {
            let j = 1;
            for (let i = 0; i < response.posters.length; i++) {
              if(response.posters[i].aspect_ratio < 1.0){
                document.querySelector(`#slide${j} img`).src = `${pfxImage}${response.posters[i].file_path}`;
                j++;
                if (j >= 6) break;
              }
            }
          })
          .catch(err => console.error(err));
}

const getYoutube = async (ID) => {
  await fetch(
    `https://api.themoviedb.org/3/movie/${ID}/videos?language=ko-KR`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      for (let i = 0; i < response.results.length; i++) {
        if (
          response.results[i].site === "YouTube" &&
          response.results[i].type === "Trailer"
        ) {
          trailerUrl = `https://www.youtube.com/embed/${response.results[i].key}`;
          document.querySelector(".detail-trailer iframe").src = trailerUrl;
          break;
        }
      }
    })
    .catch((err) => console.error(err));
}

function convertIntToTime(minutes) {
  let hours = Math.floor(minutes / 60); // 시간 계산
  let remainingMinutes = minutes % 60; // 분 계산
  return `${hours}h ${remainingMinutes}m`;
}

document.querySelector(".btn-close").addEventListener("click", function () {
  document.querySelector("#videoModal iframe").src = "";
});

document
  .getElementById("videoModal")
  .addEventListener("show.bs.modal", function () {
    document.querySelector("#videoModal iframe").src = `${trailerUrl}`; // 원래 동영상 URL로
  });






const apiKey = 'c6e6f258ddf01e890ce7dc0db97ee5d6';  // 발급받은 API 키를 여기에 입력하세요
const defaultImage = '../No img.png';  // 출연진 사진이 없을 경우 사용할 기본 이미지 경로.

// /**
//  * 사용자가 입력한 검색어를 기반으로 영화를 검색하는 함수.
//  */
// async function searchMovie() {
//   const query = document.getElementById('query').value;
//   const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ko-KR`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     displayResults(data.results);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     displayError('영화 검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
//   }
// }

// /**
//  * 영화 검색 결과를 화면에 표시하는 함수.
//  * @param {Array} movies - 검색된 영화 목록.
//  */
// function displayResults(movies) {
//   const resultsDiv = document.getElementById('results');
//   resultsDiv.innerHTML = '';  // 이전 검색 결과를 지웁니다

//   if (movies.length === 0) {
//     resultsDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
//     return;
//   }

//   // 각 영화별로 UI 요소를 생성하고 결과를 표시합니다.
//   movies.forEach(async movie => {
//     const movieDiv = document.createElement('div');
//     movieDiv.innerHTML = `
//       <h2>${movie.title}</h2>
//       ${movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} 포스터">` : '<p>포스터 이미지가 없습니다.</p>'}
      
//       <div id="credits-${movie.id}"></div>
//     `;
//     resultsDiv.appendChild(movieDiv);

//     // 출연진 정보를 가져와서 표시합니다.
//     fetchCredits(movie.id, movieDiv);
//   });
// }

/**
 * 특정 영화의 출연진 정보를 가져오는 함수.
 * @param {number} movieId - 영화 ID입니다.
 * @param {HTMLElement} movieDiv - 출연진 정보를 표시할 부모 요소.
 */
async function fetchCredits(ID) {
  try {
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${ID}/credits?api_key=${apiKey}&language=ko-KR`);
    if (!creditsResponse.ok) {
      throw new Error(`HTTP error! status: ${creditsResponse.status}`);
    }
    const creditsData = await creditsResponse.json();
    displayCredits(creditsData.cast);
  } catch (error) {
    console.error(`Error fetching credits for movie ${ID}:`, error);
    const creditsDiv = document.querySelector(`#results`);
    creditsDiv.innerHTML = '<p>출연진 정보를 가져오는 도중 오류가 발생했습니다.</p>';
  }
}

/**
 * 출연진 정보를 화면에 표시하는 함수.
 * @param {number} movieId - 영화 ID입니다.
 * @param {Array} cast - 출연진 데이터 배열입니다.
 * @param {HTMLElement} movieDiv - 출연진 정보를 표시할 부모 요소.
 */
function displayCredits(cast) {
  const creditsDiv = document.querySelector(`#results`);
  creditsDiv.innerHTML = '';  // 이전 출연진 결과를 지웁니다.

  if (cast.length === 0) {
    creditsDiv.innerHTML = '<p>출연진 정보가 없습니다.</p>';  // 출연진 정보가 없을 경우 메시지를 표시.
    return;
  }

  // 출연진 정보
  const castHtml = `
    <p>출연진</p>
    <div class="cast-list slider">
      ${cast.map(actor => `
        <div class="cast-item slide" draggable="false";>
          <div class="cast-information" draggable="false";>
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : defaultImage}" 
                 alt="${actor.name} 사진 " 
                 onerror="this.onerror=null;this.src='${defaultImage}';" draggable="false";/>
            <div class="cast-details" draggable="false";>
              <p class="cast-name" draggable="false";>${actor.name}</p>
              <p class="cast-character" draggable="false";>${actor.character}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  creditsDiv.innerHTML = castHtml;  // 출연진 정보 목록을 한 번에 출력합니다.

  detailSlider();
}

/**
 * 오류 메시지를 화면에 표시하는 함수.
 * @param {string} message - 표시할 오류 메시지.
 */
function displayError(message) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p>${message}</p>`;
}






function detailSlider() {
  const slider = document.querySelector('.slider');
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', function(e) {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener('mouseleave', function() {
    isDown = false;
  });

  slider.addEventListener('mouseup', function() {
    isDown = false;
  });

  slider.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // 드래그 이동 거리에 따라 2배 속도로 슬라이드 이동
    slider.scrollLeft = scrollLeft - walk;
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
    if(poster){
    recommendDiv.innerHTML = `
          <div class="recommend-container">
        
            
              <img src="${poster?`https://image.tmdb.org/t/p/original${poster}`: defaultImage}" alt="포스터">
              "<p>포스터 이미지가 없습니다.</p>"
          <div class="recommend__title-area">
              <p>${title}</p>
            </div>
          </div>
              `;
      recommendDiv.addEventListener('click', function() {
        detailMovieSearch(movie.id);
      });
      recommendBoard.appendChild(recommendDiv);
    }
  });
};


detailMovieSearch(movieID);