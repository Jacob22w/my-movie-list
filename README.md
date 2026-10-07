# Moja lista filmów

To jest prosta aplikacja React + TypeScript, która pokazuje listę filmów z pliku JSON,
pozwala je oznaczać jako obejrzane, dodawać nowe filmy i wystawiać im oceny od 1 do 5.

## Co robi ta aplikacja

- pokazuje listę filmów z lokalnego pliku `src/data/movies.json`
- wyświetla licznik: obejrzane / wszystkie
- pozwala filtrować filmy: wszystkie, obejrzane, nieobejrzane
- pozwala dodać nowy film przez formularz
- pozwala zaznaczyć film jako obejrzany
- pozwala ustawić ocenę dla filmu od 1 do 5 gwiazdek
- ma przycisk `Wyczyść wszystkie`, który resetuje status obejrzenia i oceny

## Uruchomienie projektu

```bash
npm install
npm run dev
```

Dodatkowe polecenia:

```bash
npm run build
npm run lint
npm run preview
```

## Struktura projektu

- `src/App.tsx` — główny komponent aplikacji, stan, formularz, filtry i lista filmów
- `src/components/MovieCard.tsx` — pojedyncza karta filmu
- `src/types.ts` — typ `Movie`
- `src/data/movies.json` — dane startowe filmów
- `src/App.css` — style strony
- `src/main.tsx` — punkt wejścia Reacta
- `KOD_KROK_PO_KROKU.md` — dokładne, proste wyjaśnienie działania kodu krok po kroku
- `DOKUMENTACJA_SZCZEGOLOWA.md` — bardziej techniczna dokumentacja projektu
- `index.html` — plik HTML z elementem `root`

## Typ danych filmu

Każdy film ma taki format:

```ts
type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string[];
};
```

To oznacza:

- `id` — liczba, unikalny identyfikator filmu
- `title` — tekst, tytuł filmu
- `year` — liczba, rok produkcji
- `genre` — tablica tekstów, np. `["Sci-Fi", "Akcja"]`

Tak wygląda przykładowy film w JSON:

```json
{
  "id": 1,
  "title": "Interstellar",
  "year": 2014,
  "genre": ["Sci-Fi"]
}
```

## Jak działa `App.tsx`

Najważniejsze elementy to stan Reacta:

```tsx
const [movies, setMovies] = useState<Movie[]>(initialMovies);
const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
const [ratings, setRatings] = useState<Record<number, number>>({});
const [filter, setFilter] = useState("all");
const [title, setTitle] = useState("");
const [year, setYear] = useState("");
const [genres, setGenres] = useState([""]);
const [formError, setFormError] = useState("");
```

To są zmienne, które React „zapamiętuje” podczas działania strony.

- `movies` — wszystkie filmy
- `watchedMovies` — lista ID obejrzanych filmów
- `ratings` — oceny filmów, zapisane jako obiekt typu `{ [idFilmu]: ocena }`
- `filter` — aktywny filtr: `all`, `watched`, `unwatched`
- `title`, `year`, `genres` — dane formularza
- `formError` — komunikat o błędzie walidacji

### Funkcja `toggleWatched`

```tsx
const toggleWatched = (id: number) => {
  if (watchedMovies.includes(id)) {
    setWatchedMovies((current) => current.filter((movieId) => movieId !== id));
  } else {
    setWatchedMovies((current) => [...current, id]);
  }
};
```

To sprawdza, czy film jest już oznaczony jako obejrzany:

- jeśli tak — usuwa jego ID z listy
- jeśli nie — dodaje ID do listy

### Funkcja `addMovie`

```tsx
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
```

Ta funkcja:

1. blokuje domyślne wysłanie formularza
2. czyści tekst z tytułu i gatunków
3. sprawdza, czy tytuł nie jest pusty i czy jest przynajmniej jeden gatunek
4. oblicza nowe ID dla filmu
5. dodaje nowy obiekt do tablicy `movies`
6. czyści formularz po dodaniu filmu

### Walidacja formularza

W formularzu są pola:

- `title` — wymagane
- `year` — wymagane, liczba
- `genres` — co najmniej jeden niepusty gatunek

Walidacja jest prosta i oparta na warunkach:

```tsx
if (!movieTitle || movieGenres.length === 0) {
  setFormError("Podaj tytuł filmu i co najmniej jeden gatunek.");
  return;
}
```

Jeżeli dane są niepoprawne, użytkownik widzi komunikat:

```tsx
{formError && <p className="form-error" role="alert">{formError}</p>}
```

### Filtrowanie listy

```tsx
const filteredMovies = movies.filter((movie) => {
  if (filter === "watched") {
    return watchedMovies.includes(movie.id);
  }

  if (filter === "unwatched") {
    return !watchedMovies.includes(movie.id);
  }

  return true;
});
```

Tak działa logika filtrów:

- `all` — wszystkie filmy
- `watched` — tylko obejrzane
- `unwatched` — tylko nieobejrzane

### Reset statusów

```tsx
const resetMovieProgress = () => {
  setWatchedMovies([]);
  setRatings({});
};
```

Przycisk `Wyczyść wszystkie`:

- resetuje listę obejrzanych filmów
- czyści wszystkie oceny
- nie usuwa filmów z listy

## Jak działa `MovieCard`

```tsx
type MovieCardProps = {
  title: string;
  year: number;
  genre: string[];
  rating: number;
  watched: boolean;
  onToggle: () => void;
  onRate: (rating: number) => void;
};
```

Karta filmu dostaje dane przez props:

- `title` — tytuł
- `year` — rok produkcji
- `genre` — gatunki
- `rating` — ocena
- `watched` — czy film jest obejrzany
- `onToggle` — funkcja zmieniająca status obejrzenia
- `onRate` — funkcja zapisująca ocenę

Wewnątrz karty jest renderowana ocena:

```tsx
{[1, 2, 3, 4, 5].map((value) => (
  <button key={value} type="button" onClick={() => onRate(value)}>
    {value <= rating ? "★" : "☆"}
  </button>
))}
```

To tworzy 5 przycisków gwiazdek. Jeżeli `value <= rating`, wyświetla pełną gwiazdkę, a jeśli nie — pustą.

## Dodatkowe informacje

- `FormEvent` użyty w `addMovie` opisuje zdarzenie wysłania formularza
- `useState` przechowuje dane tylko w pamięci aplikacji podczas działania strony
- po odświeżeniu strony dane wracają do rozmiaru z `movies.json`
- aplikacja nie zapisuje danych do lokalnego magazynu przeglądarki ani bazy danych

## Wersja zadania

Projekt spełnia wymagania zadania React + TypeScript:

- React
- TypeScript
- komponenty
- props
- useState
- zdarzenia `onClick` / `onSubmit`
- `.map()`
- `.filter()`
- dane z pliku JSON
- formularz dodawania filmu
- system ocen
- filtrowanie listy
