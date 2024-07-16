const apiKey = 'c6e6f258ddf01e890ce7dc0db97ee5d6';  // 발급받은 API 키를 여기에 입력하세요
const defaultImage = './No img.png';  // 출연진 사진이 없을 경우 사용할 기본 이미지 경로.

/**
 * 사용자가 입력한 검색어를 기반으로 영화를 검색하는 함수.
 */
async function searchMovie() {
  const query = document.getElementById('query').value;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ko-KR`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    displayResults(data.results);
  } catch (error) {
    console.error('Error fetching data:', error);
    displayError('영화 검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
  }
}

/**
 * 영화 검색 결과를 화면에 표시하는 함수.
 * @param {Array} movies - 검색된 영화 목록.
 */
function displayResults(movies) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';  // 이전 검색 결과를 지웁니다

  if (movies.length === 0) {
    resultsDiv.innerHTML = '<p>검색 결과가 없습니다.</p>';
    return;
  }

  // 각 영화별로 UI 요소를 생성하고 결과를 표시합니다.
  movies.forEach(async movie => {
    const movieDiv = document.createElement('div');
    movieDiv.innerHTML = `
      <h2>${movie.title}</h2>
      ${movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} 포스터">` : '<p>포스터 이미지가 없습니다.</p>'}
      
      <div id="credits-${movie.id}"></div>
    `;
    resultsDiv.appendChild(movieDiv);

    // 출연진 정보를 가져와서 표시합니다.
    fetchCredits(movie.id, movieDiv);
  });
}

/**
 * 특정 영화의 출연진 정보를 가져오는 함수.
 * @param {number} movieId - 영화 ID입니다.
 * @param {HTMLElement} movieDiv - 출연진 정보를 표시할 부모 요소.
 */
async function fetchCredits(movieId, movieDiv) {
  try {
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=ko-KR`);
    if (!creditsResponse.ok) {
      throw new Error(`HTTP error! status: ${creditsResponse.status}`);
    }
    const creditsData = await creditsResponse.json();
    displayCredits(movieId, creditsData.cast, movieDiv);
  } catch (error) {
    console.error(`Error fetching credits for movie ${movieId}:`, error);
    const creditsDiv = movieDiv.querySelector(`#credits-${movieId}`);
    creditsDiv.innerHTML = '<p>출연진 정보를 가져오는 도중 오류가 발생했습니다.</p>';
  }
}

/**
 * 출연진 정보를 화면에 표시하는 함수.
 * @param {number} movieId - 영화 ID입니다.
 * @param {Array} cast - 출연진 데이터 배열입니다.
 * @param {HTMLElement} movieDiv - 출연진 정보를 표시할 부모 요소.
 */
function displayCredits(movieId, cast, movieDiv) {
  const creditsDiv = movieDiv.querySelector(`#credits-${movieId}`);
  creditsDiv.innerHTML = '';  // 이전 출연진 결과를 지웁니다.

  if (cast.length === 0) {
    creditsDiv.innerHTML = '<p>출연진 정보가 없습니다.</p>';  // 출연진 정보가 없을 경우 메시지를 표시.
    return;
  }

  // 출연진 정보
  const castHtml = `
    <p>출연진</p>
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
  `;

  creditsDiv.innerHTML = castHtml;  // 출연진 정보 목록을 한 번에 출력합니다.
}

/**
 * 오류 메시지를 화면에 표시하는 함수.
 * @param {string} message - 표시할 오류 메시지.
 */
function displayError(message) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p>${message}</p>`;
}
