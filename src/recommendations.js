document.addEventListener("DOMContentLoaded", function() {
    var searchButton = document.getElementById("search_button");
    searchButton.addEventListener("click", searchMovie);
  });
  function searchMovie() {
    var movieInput = document.getElementById("movie_input");
    var searchedMovie = movieInput.value.trim();
    if (searchedMovie === "") {
      alert("Please enter a movie title.");
      return;
    }
    fetch(`http://www.omdbapi.com/?apikey=eb6f5f5f&s=${searchedMovie}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        var movieList = document.getElementById("movie_list");
        movieList.innerHTML = "";
        if (data.Response === "False") {
          alert("No movie found. Please try again with a different title.");
          return;
        }
        var movies = data.Search;
        var promises = movies.map((movie) => {
          return fetch(`http://www.omdbapi.com/?apikey=eb6f5f5f&i=${movie.imdbID}`)
            .then((response) => response.json());
        });
        Promise.all(promises)
          .then((moviesData) => {
            var moviesWithDetails = movies.map((movie, index) => {
              return {
                ...movie,
                details: moviesData[index]
              };
            });
            moviesWithDetails.sort((a, b) => parseFloat(b.details.imdbRating) - parseFloat(a.details.imdbRating));
            moviesWithDetails.forEach((movie) => {
              var movieContainer = createMovieContainer(movie);
              movieList.appendChild(movieContainer);
            });
          })
          .catch((error) => {
            console.log("Error:", error);
            alert("An error occurred while fetching movie data. Please try again later.");
          });
      });
    movieInput.value = "";
  }
  function createMovieContainer(movie) {
    var movieContainer = document.createElement("div");
    movieContainer.className = "movie-item";
    var moviePoster = document.createElement("img");
    moviePoster.src = movie.Poster;
    movieContainer.appendChild(moviePoster);
    var movieTitle = document.createElement("p");
    movieTitle.textContent = "TITLE: " + movie.Title;
    movieContainer.appendChild(movieTitle);
    var movieID = document.createElement("p");
    movieID.textContent = "MOVIE ID: " + movie.imdbID;
    movieContainer.appendChild(movieID);
    var movieSynopsis = document.createElement("p");
    movieSynopsis.textContent = "SYNOPSIS: " + (movie.details.Plot || "N/A");
    movieContainer.appendChild(movieSynopsis);
    var movieCastAndCrew = document.createElement("p");
    movieCastAndCrew.textContent = "CAST AND CREW: " + (movie.details.Actors || "N/A");
    movieContainer.appendChild(movieCastAndCrew);
    var movieReleaseDate = document.createElement("p");
    movieReleaseDate.textContent = "RELEASE DATE: " + (movie.details.Released || "N/A");
    movieContainer.appendChild(movieReleaseDate);
    var movieRatings = document.createElement("p");
    movieRatings.textContent = "RATINGS: " + (movie.details.imdbRating || "N/A");
    movieContainer.appendChild(movieRatings);
    var addToWatchlistButton = document.createElement("button");
    addToWatchlistButton.textContent = "ADD TO WATCHLIST";
    addToWatchlistButton.classList.add("button-style"); // Add the CSS class
    addToWatchlistButton.addEventListener("click", function () {
      addToWatchlist(movie);
    });
    movieContainer.appendChild(addToWatchlistButton);
    return movieContainer;
  }
  function addToWatchlist(movie) {
    var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist.push(movie);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    alert("Movie added to watchlist!");
  }