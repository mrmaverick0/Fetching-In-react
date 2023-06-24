import React, { useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import { useEffect } from "react";
import { useCallback } from "react";
import AddMovie from "./components/AddMovie";

function App() {
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://react-http-822f3-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();

      const transformMovie = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovie(transformMovie);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);
  async function addMovieHandler(movie) {
    console.log(movie);
    const response = await fetch('https://react-http-822f3-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body: JSON.stringify(movie),
      headers:{
        'Content-type': 'application/json'
      }
    })
    const data= await response.json();
    console.log(data)
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMovies}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && movie.length > 0 && <MoviesList movies={movie} />}
        {!isLoading && movie.length === 0 && !error && <p>Found no Movies</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
