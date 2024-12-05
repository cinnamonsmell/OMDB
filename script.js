//Элементы
const main = document.getElementsByClassName("main")[0];
const movieTitle = document.getElementsByClassName("movieTitle")[0];
const simularMovieTitle = document.getElementsByClassName("movieTitle")[1];
const movie = document.getElementsByClassName("movie")[0];

// Кнопки
const themeBtn = document.getElementById("themeChange");
const searchBtn = document.getElementById("searchBtn");

// Слушатели событий
themeBtn.addEventListener("click", changeTheme);
searchBtn.addEventListener("click", findMovie);
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
     findMovie()
  }
});

// Смена темы
function changeTheme() {
  const body = document.querySelector("body");
  body.classList.toggle("dark");
}

// Поиск фильма
async function findMovie() {
  let search = document.querySelector('[name="search"]')?.value || '';
  
  // if (!search.trim()) {
  //   alert("Введите название фильма!");
  //   return;
  // }
  
  let loader = document.getElementsByClassName("loader")[0];
  loader.style.display = "block";

  let data = { apikey: "1b7ff984", t: search };
  
  try {
    let result = await sendRequest("http://www.omdbapi.com/", "GET", data);
    loader.style.display = "none";

    if (result.Response.toLowerCase() === "false") {
      main.style.display = "block";
      movieTitle.style.display = "block";
      movieTitle.innerHTML = `${result.Error}`;
    } else {
      showMovie(result);
      findSimularMovies();
      console.log(result);
    }
  } catch (error) {
    loader.style.display = "none";
    alert("Произошла ошибка при загрузке данных. Попробуйте позже.");
    console.error(error);
  }
}

// Показать фильм
function showMovie(movie) {
  main.style.display = "block";
  movieTitle.style.display = "block";
  document.getElementsByClassName("movie")[0].style.display = "flex";
  
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : "default-poster.jpg";
  document.getElementById("movieImg").style.backgroundImage = `url(${posterUrl})`;
  movieTitle.innerHTML = `${movie.Title}`;

  const movieDesc = document.getElementsByClassName("movieDescription")[0];
  movieDesc.innerHTML = "";

  let params = [
    "imdbRating", "Year", "Released", "Genre", "Country", "Language", "Director", "Writer", "Actors",
  ];
  
  params.forEach((key) => {
    movieDesc.innerHTML += `
       <div class="desc">
            <span class="title">${key}</span>
            <span class="subtitle">${movie[key] || "N/A"}</span>
       </div>`;
  });
}

// Похожие фильмы
async function findSimularMovies() {
  const search = document.getElementsByName("search")[0].value;
  const simularMovieTitle = document.getElementsByClassName("movieTitle")[1];
  const data = { apikey: "1b7ff984", s: search };
  const result = await sendRequest("http://www.omdbapi.com/", "GET", data);
  console.log(result);
  if (result.response == "False") {
  } else {
    simularMovieTitle.style.display = "block";
    simularMovieTitle.innerHTML = `Найдено похожих фильмов: ${result.totalResults}`;
    console.log(result.Search);
    showSimularMovies(result.Search);
  }
}

function showSimularMovies(movies) {
  const simularMovies = document.getElementsByClassName("simularMovie")[0];
  simularMovies.innerHTML = "";
  simularMovies.style.display = "grid";
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    if(movie.Poster != "N/A"){
      let simularMovie = `
       <div class="simularMovieCard" style="background-image: url('${movie.Poster}');">
                <div class="saved" onclick="addSaved()" 
                data-imdbID="${movie.imdbID}" data-title="${movie.Title}" data-poster="${movie.Poster}">
                </div>
                <div class="simularMovieTitle"  > 
                    ${movie.Title}
                </div>
            </div>`;
      simularMovies.innerHTML+=simularMovie
    }
  }  
}

async function sendRequest(url, method, data) {
  if (method == "POST") {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    response = await response.json();
    return response;
  } else if (method == "GET") {
    url = url + "?" + new URLSearchParams(data);
    let response = await fetch(url, {
      method: "GET",
    });
    response = await response.json();
    return response;
  }
}