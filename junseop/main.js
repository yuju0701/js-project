// 발급받은 API 키(준섭)
const apiKey = 'c6e6f258ddf01e890ce7dc0db97ee5d6';

// 기본 URL + API key
const url = `https://api.themoviedb.org/3/api_key=${apiKey}&language=ko-KR`;

// 개봉일 날짜 - 빼고 년월일 넣는 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // 월, 일을 '월'이라는 문자열로 대체하여 포맷팅
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}년 ${month}월 ${day}일`;
}

// 최신 영화 불러오는 함수 (Latest는 하나만 불러오기에 Trend로 불러와야 함.)
const getLatestMovie = async () => {
    let latestURL = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=ko-KR`;
    const options = { 
        method: 'GET', 
        headers: { 
            accept: 'application/json', 
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmU2ZjI1OGRkZjAxZTg5MGNlN2RjMGRiOTdlZTVkNiIsIm5iZiI6MTcyMTEwODE0MS45NDQ0MDcsInN1YiI6IjY2OTRmZDRiNmU0ZTVjMDBlZjY2MDZkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ySS8Z3tUy6tNo7lZ3hUyM-wzWDl3VRlHWSqX7xfYTaQ'
        }
    };

    const response = await fetch(latestURL, options);
    const data = await response.json();
    for (let i = 0; i < 20; i++) {
        const latestMovie = data.results[i];
        latestMovieRender(latestMovie);
    }
}

// 최신 영화 Render
const latestMovieRender = (movie) => {
    const formattedDate = formatDate(movie.release_date);
    let latestHTML = `
    <div class = "MovieInfo">
        ${movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} 포스터" style="width: 200px; height: 300px; border-radius: 5%; border-radius: 5%; border: 0.01px solid gray; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);">` : '<p>포스터 이미지가 없습니다.</p>'}
        <h1>${movie.title}</h1>
        <p>${formattedDate}</p>
    </div>
    `;
    document.getElementById('latest-movie-board').innerHTML += latestHTML;
}

// 인기 영화 불러오는 함수
const getPopularMovie = async () => {
    let popularURL = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ko-KR`;
    const options = { 
        method: 'GET', 
        headers: { 
            accept: 'application/json', 
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNmU2ZjI1OGRkZjAxZTg5MGNlN2RjMGRiOTdlZTVkNiIsIm5iZiI6MTcyMTEwODE0MS45NDQ0MDcsInN1YiI6IjY2OTRmZDRiNmU0ZTVjMDBlZjY2MDZkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ySS8Z3tUy6tNo7lZ3hUyM-wzWDl3VRlHWSqX7xfYTaQ'
        }
    };

    const response = await fetch(popularURL, options);
    const data = await response.json();
    for (let i = 0; i < 10; i++) {
        const popularMovie = data.results[i];
        popularMovieRender(popularMovie);
    }
}

// 인기 영화 Render
const popularMovieRender = (movie) => {
    const formattedDate = formatDate(movie.release_date);
    let popularHTML = `
    <div class = "MovieInfo">
        ${movie.poster_path ? `<img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title} 포스터" style="width: 200px; height: 300px; border-radius: 5%; border: 0.01px solid gray; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);">` : '<p>포스터 이미지가 없습니다.</p>'}
        <h1>${movie.title}</h1>
        <p>${formattedDate}</p>
    </div>
    `;
    document.getElementById('popular-movie-board').innerHTML += popularHTML;
}

// 연관 검색어 기능
const MAX_RESULTS = 5; // 연관 검색어 개수

// 검색 창 input 이벤트
document.getElementById('search-input').addEventListener('input', function() {
    const query = document.getElementById('search-input').value;
    if (query) {
        // 검색어가 있을 때 영화 제목 함수 호출
        getMovieTitles(query); 
    } else {
        // 검색어가 없으면 연관 검색어 리스트 비움
        document.getElementById('suggestions').innerHTML = '';
    }
});

// 영화 제목을 불러오는 함수
const getMovieTitles = async (query) => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ko-KR`;

    const response = await fetch(url);
    const data = await response.json();
    displaySuggestions(data.results);
}

const displaySuggestions = (movies) => {
    const container = document.getElementById('suggestions');
    container.innerHTML = ''; 
    // 반복문 설명 *Math.min(movies.length, MAX_RESULTS)*
    // 5개를 넘지 않게 반복문 돌리게 하려고 넣음
    // 예를 들어 movies.length가 3이면 3개만 나옴
    for (let i = 0; i < Math.min(movies.length, MAX_RESULTS); i++) {
        const movie = movies[i];
        const li = document.createElement('li');
        li.className = 'suggestion';
        li.textContent = movie.title;
        li.addEventListener('mousedown', function(event) {
            document.getElementById('search-input').value = movie.title;
            container.innerHTML = ''; 
        });
        container.appendChild(li);
    }
}

window.onload = () => {
    getLatestMovie();
    getPopularMovie();
};