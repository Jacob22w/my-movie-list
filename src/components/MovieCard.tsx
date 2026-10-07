type MovieCardProps = {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  watched: boolean;
  onToggle: () => void;
  onRate: (rating: number) => void;
};

function MovieCard({ title, year, genre, rating, watched, onToggle, onRate }: MovieCardProps) {
  return (
    <div className={watched ? "movie-card watched" : "movie-card"}>
      <h2>{title}</h2>
      <p>Rok: {year}</p>
      <p>Gatunek: {genre.join(", ")}</p>

      <div className="rating">
        <span>Ocena:</span>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              className={value <= rating ? "star-button selected" : "star-button"}
              type="button"
              key={value}
              onClick={() => onRate(value)}
            >
              {value <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
        <span className="rating-value">{rating > 0 ? `${rating}/5` : "Brak oceny"}</span>
      </div>

      <button type="button" onClick={onToggle}>
        {watched ? "✓ Obejrzany" : "Oznacz jako obejrzany"}
      </button>
    </div>
  );
}

export default MovieCard;