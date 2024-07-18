import API_TOKEN from "../JeongChan/config.js"
// import API_TOKEN from "./config.js";

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

const pfxImage = "https://media.themoviedb.org/t/p/w220_and_h330_face";
let tmp = ``;
// https://media.themoviedb.org/t/p/w220_and_h330_face/lapab2EdLTL6srTus5ktgr64bqF.jpg

fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=ko-KR`, options)
  .then((response) => response.json())
  .then((response) => {
    document.querySelector(
      "#detail-poster-img"
    ).src = `${pfxImage}${response.poster_path}`;

    document.querySelector("#detail-background-img").src = `${pfxImage}${response.backdrop_path})`;

    document.querySelector("#detail-title").textContent = response.title;
    document.querySelector(
      "#detail-release-date"
    ).textContent = `(${response.release_date.substring(0, 4)})`;
    document.querySelector(".detail-release").textContent =
      response.release_date;

    response.genres.forEach((element) => {
      tmp += `<a href="" data-id="${element.id}">${element.name}</a>`;
    });
    document.querySelector(".detail-genres").innerHTML = tmp;
    tmp = ``;
    document.querySelector(".detail-runtime").textContent = convertIntToTime(
      response.runtime
    );
    document.querySelector(".detail-rating").textContent =
      response.vote_average.toString().substring(0,4);

    document.querySelector(".detail-tagline").textContent = response.tagline;

    document.querySelector(".detail-overview").textContent = response.overview;

    fetch(
      `https://api.themoviedb.org/3/movie/${movieID}/videos?language=ko-KR`,
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


      fetch(`https://api.themoviedb.org/3/movie/${movieID}/images?`, options)
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


    // document.querySelector('#detail-container').innerHTML = result;
  })
  .catch((err) => console.error(err));

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


// 출연진area
const apiKey = '718c396eba4b86e15ded8489c7a51df3';  
const defaultImage = './No img.png';  // 출연진 사진이 없을 경우 사용할 기본 이미지 경로.


/**
 * 특정 영화의 출연진 정보를 가져오는 함수.
 */
async function fetchCredits() {
  try {
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${apiKey}&language=ko-KR`);
    if (!creditsResponse.ok) {
      throw new Error(`HTTP error! status: ${creditsResponse.status}`);
    }
    const creditsData = await creditsResponse.json();
    displayCredits(creditsData.cast);
  } catch (error) {
    console.error(`Error fetching credits for movie ${movieID}:`, error);
    const creditsDiv = document.getElementById('castMembers');
    creditsDiv.innerHTML = '<p>출연진 정보를 가져오는 도중 오류가 발생했습니다.</p>';
  }
}

// 출연진정보
function displayCredits(cast) {
  const creditsDiv = document.getElementById('castMembers');
  creditsDiv.innerHTML = '';  

  if (cast.length === 0) {
    creditsDiv.innerHTML = '<p>출연진 정보가 없습니다.</p>';  // 출연진 정보가 없을 경우 메시지를 표시.
    return;
  }

const castHtml = `
  <div class="cast-area">
    <p class="cast-title">출연진</p>
    <ul class="cast-list">
      ${cast.map(actor => `
        <li class="cast-item">
          <div class="cast-information">
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : defaultImage}" 
                 alt="${actor.name} 사진" 
                 onerror="this.onerror=null;this.src='${defaultImage}';"/>
            <div class="cast-details">
              <p class="cast-name">${actor.name}</p>
              <p class="cast-character">${actor.character}</p>
            </div>
          </div>
        </li>
      `).join('')}
    </ul>
  </div>
  `;

  creditsDiv.innerHTML = castHtml;  // 출연진 정보 목록을 한 번에 출력합니다.
}

/**
 * 오류 메시지를 화면에 표시하는 함수.
 * @param {string} message - 표시할 오류 메시지.
 */
function displayError(message) {
  const resultsDiv = document.getElementById('castMembers');
  resultsDiv.innerHTML = `<p>${message}</p>`;
}

fetchCredits();