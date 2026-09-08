import { useState } from "react";
import MovieCard from "./components/MovieCard";
import movies from "./data/movies.json";
import "./App.css";

function App() {
  const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
  const [filter, setFilter] = useState("all");

  const toggleWatched = (id: number) => {
    if (watchedMovies.includes(id)) {
      setWatchedMovies(watchedMovies.filter((movieId) => movieId !== id));
    } else {
      setWatchedMovies([...watchedMovies, id]);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    if (filter === "watched") {
      return watchedMovies.includes(movie.id);
    }

    if (filter === "unwatched") {
      return !watchedMovies.includes(movie.id);
    }

    return true;
  });

  return (
    <div className="app">
      <h1>Moja lista filmów</h1>

      <h3>
        Obejrzane: {watchedMovies.length} / {movies.length}
      </h3>

      <div className="filters">
        <button onClick={() => setFilter("all")}>
          Wszystkie
        </button>

        <button onClick={() => setFilter("watched")}>
          Obejrzane
        </button>

        <button onClick={() => setFilter("unwatched")}>
          Nieobejrzane
        </button>
      </div>

      <div className="movies">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            genre={movie.genre}
            watched={watchedMovies.includes(movie.id)}
            onToggle={() => toggleWatched(movie.id)}
          />
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <p>Brak filmów do wyświetlenia.</p>
      )}
    </div>
  );
}

export default App;