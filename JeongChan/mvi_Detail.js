import API_TOKEN from "./config.js";

let trailerUrl = "";
const movieURL = '653346'; // 1022789, 653346, 519182

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

fetch(`https://api.themoviedb.org/3/movie/${movieURL}?language=ko-KR`, options)
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
      `https://api.themoviedb.org/3/movie/${movieURL}/videos?language=ko-KR`,
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
