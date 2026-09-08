import { useState } from "react";

type MovieCardProps = {
  title: string;
  year: number;
  genre: string;
  watched: boolean;
  onToggle: () => void;
};

function MovieCard({ title, year, genre, watched, onToggle }: MovieCardProps) {
  return (
    <div className={watched ? "movie-card watched" : "movie-card"}>
      <h2>{title}</h2>
      <p>Rok: {year}</p>
      <p>Gatunek: {genre}</p>

      <button onClick={onToggle}>
        {watched ? "✓ Obejrzany" : "Oznacz jako obejrzany"}
      </button>
    </div>
  );
}

export default MovieCard;