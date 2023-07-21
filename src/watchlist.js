document.addEventListener("DOMContentLoaded", function() {
  displayWatchlist();
});
function displayWatchlist() {
  var watchlistDiv = document.getElementById("watchlist");
  watchlistDiv.innerHTML = "";
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlist.forEach(function(movie) {
    fetchMovieDetails(movie.imdbID)
      .then(function(details) {
        var movieWithDetails = {
          ...movie,
          details: details
        };
        var movieContainer = createMovieContainer(movieWithDetails);
        watchlistDiv.appendChild(movieContainer);
      })
      .catch(function(error) {
        console.log("Error:", error);
      });
  });
}
function fetchMovieDetails(imdbID) {
  return fetch(`http://www.omdbapi.com/?apikey=eb6f5f5f&i=${imdbID}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      return data;
    });
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
  var movieStatus = document.createElement("p");
  movieStatus.textContent = "MOVIE STATUS: " + (movie.Status || "unwatched");
  movieContainer.appendChild(movieStatus);
  var removeFromWatchlistButton = document.createElement("button");
  removeFromWatchlistButton.textContent = "REMOVE FROM WATCHLIST";
  removeFromWatchlistButton.className = "remove-button"; 
  removeFromWatchlistButton.addEventListener("click", function() {
    removeFromWatchlist(movie);
  });
  movieContainer.appendChild(removeFromWatchlistButton);
  var updateButton = document.createElement("button");
  updateButton.textContent = "UPDATE MOVIE STATUS";
  updateButton.className = "update-button"; 
  updateButton.addEventListener("click", function() {
    updateMovieInWatchlist(movie);
  });
  movieContainer.appendChild(updateButton);
  return movieContainer;
}
function removeFromWatchlist(movie) {
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  var updatedWatchlist = watchlist.filter(function(item) {
    return item.imdbID !== movie.imdbID;
  });
  localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  displayWatchlist();
}
function updateMovieInWatchlist(movie) {
  var watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  var movieIndex = watchlist.findIndex(function(item) {
    return item.imdbID === movie.imdbID;
  });
  if (movieIndex !== -1) {
    watchlist[movieIndex].Status = "watched";
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    displayWatchlist();
  }
}

