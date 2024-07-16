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
  window.location.href = "search-results.html";
};

document.querySelector("#search-form").addEventListener("submit", search);
