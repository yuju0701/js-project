// 연관 검색어 기능
const MAX_RESULTS = 5; // 연관 검색어 개수
const JS_API_KEY = `c6e6f258ddf01e890ce7dc0db97ee5d6`;

// 검색 창 input 이벤트
document.getElementById('search-input__result').addEventListener('input', function() {
    const query = document.getElementById('search-input__result').value;
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
            document.getElementById('search-input__result').value = movie.title;
            container.innerHTML = ''; 
        });
        container.appendChild(li);
    }
}