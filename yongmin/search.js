const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3Yzg5M2RlN2UxMTFiNjFlNGM1ZDQ2ODIyN2UwYTZjOCIsIm5iZiI6MTcyMTA0OTE1NC4xNTk0MzYsInN1YiI6IjY2OTQ3MjU1YWY2MzU5NDIwZDAyOGNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1ywthX0pc-265Z6X-wSh9LlCdiG75bmTGUvI5cD7HR0";
let searchUrl = new URL(`https://api.themoviedb.org/3/search/multi`);
let recommendUrl;
let searchResultList = [];
const JS_API_KEY = `c6e6f258ddf01e890ce7dc0db97ee5d6`;

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
  const query = document.querySelector("#search-input").value;
  console.log(query);
  searchUrl.searchParams.set("query", query);
  searchUrl.searchParams.set("language", "ko-KR");
  searchUrl.searchParams.set("page", "1");
  const data = await getData(searchUrl);
  searchResultList = data.results;
  console.log(data);
  console.log(searchResultList);
  localStorage.setItem("searchResults", JSON.stringify(searchResultList));
  window.location.href = "search-results.html"; //이쪽으로 이동
};

document.querySelector("#search-form").addEventListener("submit", search);

// 연관 검색어 기능
const MAX_RESULTS = 5; // 연관 검색어 개수


// 검색 창 input 이벤트
document.getElementById('search-input').addEventListener('input', function() {
    const query = document.getElementById('search-input').value;
    console.log("Input event triggered with query:", query);
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
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${JS_API_KEY}&query=${encodeURIComponent(query)}&language=ko-KR`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API response data:", data); // Debugging
      displaySuggestions(data.results);
    } catch (error) {
        console.error("Fetch error: ", error);
    }
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
        li.addEventListener('click', function(event) {
            document.getElementById('search-input').value = movie.title;
            container.innerHTML = ''; 
        });
        container.appendChild(li);
    }
}