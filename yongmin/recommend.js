//추천 영화 데이터를 가져오는 함수
const recommendation = async (id) => {
  const recommendUrl = new URL(
    `https://api.themoviedb.org/3/movie/${id}/recommendations?language=ko-KR&page=1`
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
    <div>추천 영화</div><div></div>
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
