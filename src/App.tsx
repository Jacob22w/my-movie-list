import { useState, type SubmitEvent } from "react";
import MovieCard from "./components/MovieCard";
import initialMovies from "./data/movies.json";
import "./App.css";
import type { Movie } from "./types";

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genres, setGenres] = useState([""]);
  const [formError, setFormError] = useState("");

  const toggleWatched = (id: number) => {
    if (watchedMovies.includes(id)) {
      setWatchedMovies((current) => current.filter((movieId) => movieId !== id));
    } else {
      setWatchedMovies((current) => [...current, id]);
    }
  };

  const addMovie = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const movieTitle = title.trim();
    const movieGenres = genres.map((genre) => genre.trim()).filter(Boolean);

    if (!movieTitle || movieGenres.length === 0) {
      setFormError("Podaj tytuł filmu i co najmniej jeden gatunek.");
      return;
    }

    setMovies((current) => {
      const nextId = Math.max(0, ...current.map((movie) => movie.id)) + 1;
      return [
        ...current,
        {
          id: nextId,
          title: movieTitle,
          year: Number(year),
          genre: movieGenres,
        },
      ];
    });
    setTitle("");
    setYear("");
    setGenres([""]);
    setFormError("");
  };

  const updateRating = (id: number, rating: number) => {
    setRatings((current) => ({ ...current, [id]: rating }));
  };

  const resetMovieProgress = () => {
    setWatchedMovies([]);
    setRatings({});
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

      <form className="movie-form" onSubmit={addMovie}>
        <h2>Dodaj nowy film</h2>

        <label>
          Tytuł
          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setFormError("");
            }}
            required
          />
        </label>

        <label>
          Rok
          <input
            type="number"
            min="1888"
            step="1"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
          />
        </label>

        <fieldset className="genre-fields">
          <legend>Gatunki</legend>
          {genres.map((genre, index) => (
            <div className="genre-input-row" key={index}>
              <input
                type="text"
                aria-label={`Gatunek ${index + 1}`}
                value={genre}
                onChange={(event) => {
                  const updatedGenres = [...genres];
                  updatedGenres[index] = event.target.value;
                  setGenres(updatedGenres);
                  setFormError("");
                }}
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  className="remove-genre-button"
                  aria-label={`Usuń gatunek ${index + 1}`}
                  onClick={() =>
                    setGenres((current) => current.filter((_, genreIndex) => genreIndex !== index))
                  }
                >
                  −
                </button>
              )}
              {index === genres.length - 1 && (
                <button
                  type="button"
                  className="add-genre-button"
                  aria-label="Dodaj kolejne pole gatunku"
                  onClick={() => setGenres((current) => [...current, ""])}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </fieldset>

        {formError && <p className="form-error" role="alert">{formError}</p>}
        <button type="submit">Dodaj</button>
      </form>

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

        <button
          className="clear-all-button"
          type="button"
          onClick={resetMovieProgress}
        >
          Wyczyść wszystkie
        </button>
      </div>

      <div className="movies">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            year={movie.year}
            genre={movie.genre}
            rating={ratings[movie.id] ?? 0}
            watched={watchedMovies.includes(movie.id)}
            onToggle={() => toggleWatched(movie.id)}
            onRate={(rating) => updateRating(movie.id, rating)}
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