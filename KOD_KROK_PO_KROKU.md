# Kod projektu wyjaśniony krok po kroku

Ten przewodnik jest dla osoby, która dopiero poznaje programowanie. Zawiera
kod najważniejszych plików aplikacji oraz wyjaśnia, czym są użyte elementy
i jak współpracują.

Kod w blokach odpowiada plikom projektu. Opisy pod blokami są objaśnieniem,
a nie częścią kodu. Numery linii odnoszą się do aktualnych plików; po zmianie
kodu mogą się przesunąć.

## Najpierw: kilka podstawowych pojęć

- **Wartość** to konkretna informacja, np. tekst `"Interstellar"` albo liczba
  `2014`.
- **Zmienna** to nazwana wartość. W JavaScript często zapisuje się ją przez
  `const` albo `let`. `const` oznacza, że nie przypisujemy tej nazwie nowej
  wartości. Nie oznacza, że zawartość tablicy lub obiektu nigdy się nie zmieni.
- **Tablica** to uporządkowana lista wartości, zapisana w nawiasach
  kwadratowych, np. `["Dramat", "Biograficzny"]`. Elementy mają pozycje:
  pierwszy ma indeks `0`, następny `1`.
- **Obiekt** grupuje nazwane właściwości w nawiasach klamrowych, np.
  `{ title: "Film", year: 2024 }`. `title` i `year` to właściwości.
- **Funkcja** to nazwany fragment programu, który można uruchomić. Może
  przyjmować dane wejściowe w nawiasach i zwracać wynik.
- **Typ** opisuje, jakiego rodzaju wartość jest dozwolona: np. `string`
  (tekst), `number` (liczba), `boolean` (`true`/`false`) lub `string[]`
  (tablica tekstów).
- **JSX** to składnia podobna do HTML używana w React. Pozwala opisać elementy
  strony wewnątrz kodu JavaScript/TypeScript.
- **Stan Reacta** to dane, które mogą się zmieniać w trakcie działania strony.
  Po zmianie stanu React ponownie wyświetla interfejs z nowymi danymi.
- **Props** (właściwości komponentu) to dane przekazywane z jednego komponentu
  do drugiego.
- **Zdarzenie** to działanie użytkownika, np. kliknięcie (`onClick`), wpisanie
  tekstu (`onChange`) lub wysłanie formularza (`onSubmit`).

---

## 1. `src/App.tsx` — logika i główny widok

Poniżej znajduje się pełny kod głównego komponentu. Po nim omawiam fragmenty
po kolei.

```tsx
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
```

### Importy — linie 1–5

- **Linia 1:** `import` pobiera rzeczy z biblioteki React. `useState` jest
  funkcją Reacta do pamiętania zmiennych stanu. `SubmitEvent` jest typem
  opisującym zdarzenie wysłania formularza. Słowo `type` mówi TypeScriptowi,
  że importujemy tylko opis typu, nie działającą funkcję.
- **Linia 2:** pobiera komponent `MovieCard` z innego pliku.
- **Linia 3:** pobiera tablicę filmów z lokalnego pliku JSON i nadaje jej nazwę
  `initialMovies` („filmy początkowe”).
- **Linia 4:** dołącza plik wyglądu. CSS nie jest danymi ani funkcją.
- **Linia 5:** pobiera typ `Movie`, aby sprawdzać poprawność filmów w
  TypeScripcie.

### Funkcja główna i `useState` — linie 7–15

- **Linia 7:** `function App()` tworzy funkcję komponentu. React uruchamia tę
  funkcję, aby dowiedzieć się, co ma pokazać na stronie.
- **Linia 8:**
  ```tsx
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  ```
  To zapis stanu Reacta. `useState(...)` zwraca dwie rzeczy: bieżącą wartość
  oraz funkcję, która tę wartość zmieni. Składnia nawiasów kwadratowych
  `[movies, setMovies]` nazywa te dwie zwrócone rzeczy:
  - `movies` — aktualna tablica filmów;
  - `setMovies` — funkcja do ustawiania nowej tablicy filmów.

  `<Movie[]>` mówi TypeScriptowi, jaki ma być typ stanu: `Movie[]` znaczy
  „tablica elementów typu `Movie`”. `initialMovies` jest wartością początkową,
  pobraną z JSON. Początkowo więc lista na stronie zawiera filmy z tego pliku.

  **Dlaczego nie zmieniamy `movies` bezpośrednio?** React powinien dostać nową
  tablicę przez `setMovies`. Wtedy wie, że dane się zmieniły i może odświeżyć
  widok. Dlatego przy dodawaniu tworzymy nową tablicę zamiast dopisywać element
  do starej.
- **Linia 9:** `watchedMovies` jest tablicą liczb (`number[]`). Są w niej ID
  filmów obejrzanych przez użytkownika. Na początku `[]` oznacza pustą tablicę,
  czyli jeszcze żaden film nie jest oznaczony.
- **Linia 10:** `ratings` jest obiektem ocen. `Record<number, number>` oznacza
  w uproszczeniu: „obiekt, w którym kluczem jest numer ID filmu, a wartością
  jest liczba oceny”. `{}` to pusty obiekt, czyli na początku nie ma ocen.
  Przykład po ocenieniu: `{ 1: 4, 2: 5 }` oznacza ocenę 4 dla filmu nr 1 i 5
  dla filmu nr 2.
- **Linia 11:** `filter` przechowuje nazwę wybranego filtra. Początkowo `"all"`
  oznacza pokazywanie wszystkich filmów.
- **Linia 12:** `title` przechowuje treść pola tytułu. Początkowo jest pustym
  tekstem `""`.
- **Linia 13:** `year` przechowuje wpisany rok jako tekst. Pole HTML zwraca
  tekst; zamieniamy go na liczbę dopiero podczas dodawania filmu.
- **Linia 14:** `genres` to tablica wpisywanych gatunków. `[""]` oznacza
  tablicę z jednym pustym tekstem, czyli na starcie widoczne jest jedno pole.
- **Linia 15:** `formError` przechowuje tekst błędu. Pusty tekst oznacza, że
  nie ma błędu do pokazania.

### Oznaczanie filmu — linie 17–23

```tsx
const toggleWatched = (id: number) => {
  if (watchedMovies.includes(id)) {
    setWatchedMovies((current) => current.filter((movieId) => movieId !== id));
  } else {
    setWatchedMovies((current) => [...current, id]);
  }
};
```

- `const toggleWatched = ...` tworzy funkcję o nazwie `toggleWatched`
  („przełącz obejrzenie”).
- `(id: number)` oznacza, że funkcja przyjmuje jeden argument o nazwie `id`,
  który musi być liczbą. To będzie identyfikator filmu.
- `=>` to zapis funkcji strzałkowej; można go czytać jako „wykonaj”.
- `if (...)` oznacza „jeśli warunek jest prawdziwy, wykonaj kod w nawiasach
  klamrowych”.
- `watchedMovies.includes(id)` pyta: „czy tablica `watchedMovies` zawiera to
  ID?” Wynikiem jest `true` (tak) albo `false` (nie).
- `setWatchedMovies(...)` przekazuje Reactowi nową wartość stanu.
- `(current) => ...` to funkcja przekazana do settera. React podaje jej
  najnowszy stan pod nazwą `current`. Dzięki temu operacja bazuje na aktualnej
  tablicy, nawet gdy kilka zmian wydarzy się szybko.
- `current.filter((movieId) => movieId !== id)` przechodzi po elementach
  tablicy. `filter` tworzy nową tablicę tylko z tymi elementami, dla których
  warunek jest prawdziwy. `!==` znaczy „nie jest równe”. W tym miejscu zostają
  wszystkie ID oprócz klikniętego filmu — film zostaje odznaczony.
- `else` oznacza „w przeciwnym razie”, czyli gdy filmu jeszcze nie było w
  tablicy.
- `[...current, id]` tworzy nową tablicę. `...current` kopiuje do niej
  dotychczasowe elementy, a `id` dopisuje na końcu. To oznacza zaznaczenie
  filmu jako obejrzanego.
- Średniki kończą instrukcje. Nawiasy klamrowe wyznaczają początek i koniec
  funkcji lub bloku `if`.

Przykład: jeśli `watchedMovies` wynosi `[1, 3]` i klikniemy film o ID `3`,
`filter` utworzy `[1]`. Jeśli klikniemy film o ID `2`, operator `...` utworzy
`[1, 3, 2]`.

### Dodawanie filmu — linie 25–52

- **Linia 25:** definiuje funkcję `addMovie`. Przyjmuje `event`, czyli obiekt
  informacji o wysłaniu formularza. `SubmitEvent<HTMLFormElement>` określa jego
  typ: zdarzenie wysłania formularza HTML.
- **Linia 26:** `event.preventDefault()` zatrzymuje zwykłe zachowanie
  przeglądarki, które przeładowałoby stronę po wysłaniu formularza.
- **Linia 28:** `title.trim()` tworzy tekst tytułu bez spacji na początku
  i końcu. Oryginalna wartość pola pozostaje w stanie do czasu wyczyszczenia.
- **Linia 29:** `genres.map(...)` przechodzi przez każdy wpis gatunku.
  `genre.trim()` usuwa z niego skrajne spacje. Następnie `.filter(Boolean)`
  usuwa puste teksty. Wynik jest nową tablicą czystych gatunków.
- **Linia 31:** `if` sprawdza walidację własną. `!movieTitle` znaczy „tytuł
  jest pusty”; `||` znaczy „lub”; `movieGenres.length === 0` znaczy „nie ma
  ani jednego gatunku”.
- **Linia 32:** w przypadku błędu zapisuje komunikat do stanu. React pokaże go
  w formularzu.
- **Linia 33:** `return` natychmiast kończy tę funkcję. Błędny film nie jest
  dodawany.
- **Linia 36:** rozpoczyna zmianę tablicy filmów. Funkcyjna forma
  `setMovies((current) => ...)` dostaje najnowszą tablicę jako `current`.
- **Linia 37:** `current.map(...)` tworzy tymczasową listę samych ID.
  `Math.max(0, ...)` wybiera największy numer, a `+ 1` wyznacza nowe ID.
  `...` przekazuje elementy tablicy jako osobne argumenty funkcji.
- **Linie 38–46:** zwracają nową tablicę: `...current` kopiuje stare filmy,
  a obiekt w nawiasach klamrowych dodaje jeden nowy film.
- **Linia 41:** wpisuje wyliczony identyfikator.
- **Linia 42:** wpisuje oczyszczony tytuł.
- **Linia 43:** `Number(year)` zamienia tekst pola roku na liczbę.
- **Linia 44:** wpisuje tablicę gatunków. To zgodne z typem `string[]`.
- **Linie 48–51:** po udanym dodaniu resetują pola oraz komunikat błędu.
- **Linia 52:** zamyka funkcję dodawania.

### Oceny i reset — linie 54–61

- **Linia 54:** `updateRating` przyjmuje ID filmu i nową ocenę.
- **Linia 55:** `(current) => ({ ...current, [id]: rating })` tworzy nowy
  obiekt ocen:
  - `{ ...current }` kopiuje wszystkie wcześniejsze oceny;
  - `[id]` oznacza, że nazwą właściwości jest wartość zmiennej `id`;
  - `: rating` przypisuje tej właściwości wybraną liczbę.
  Przykładowo dla `id = 4` i `rating = 5` powstaje właściwość `4: 5`.
- **Linia 58:** definiuje funkcję resetującą postęp filmów.
- **Linia 59:** ustawia listę obejrzanych ID na pustą tablicę. Filmy stają się
  nieobejrzane.
- **Linia 60:** ustawia oceny na pusty obiekt. Oceny znikają.
- Funkcja nie zmienia `movies`, więc filmy pozostają na liście. Nazwa przycisku
  „Wyczyść wszystkie” jest trochę nieprecyzyjna: czyści statusy i oceny, nie
  usuwa filmów.

### Filtrowanie — linie 63–73

- **Linia 63:** `movies.filter(...)` tworzy nową tablicę widocznych filmów.
- **Linia 64:** sprawdza, czy wybrany filtr to `"watched"`.
- **Linia 65:** zwraca `true` dla obejrzanych filmów. `includes` sprawdza,
  czy ich ID jest w tablicy obejrzanych.
- **Linia 68:** sprawdza filtr `"unwatched"`.
- **Linia 69:** `!` odwraca wynik. Pokazane zostaną filmy, których ID nie ma
  w `watchedMovies`.
- **Linia 72:** jeżeli nie wybrano żadnego z tych dwóch filtrów, zwraca
  `true`, czyli zachowuje film na liście.

### Widok nagłówka i licznika — linie 75–81

- **Linia 75:** słowo `return` oznacza, że funkcja zwraca opis widoku.
- **Linia 76:** `<div className="app">` tworzy element podobny do HTML `div`.
  `className` wskazuje klasę CSS. W JSX używa się `className`, a nie
  `class`, bo `class` jest słowem języka JavaScript.
- **Linia 77:** `<h1>` wyświetla główny nagłówek.
- **Linie 79–81:** wyświetlają licznik. Klamry `{...}` w JSX pozwalają
  wstawić wartość z JavaScriptu. `.length` oznacza liczbę elementów tablicy.

### Formularz i walidacja przeglądarki — linie 83–155

- **Linia 83:** `<form>` tworzy formularz. `onSubmit={addMovie}` mówi:
  „po wysłaniu uruchom funkcję `addMovie`”.
- **Linia 84:** nagłówek formularza.
- **Linie 86–97:** etykieta i pole tytułu. `value={title}` pokazuje tekst ze
  stanu. `onChange` uruchamia się przy pisaniu. `event.target.value` to nowa
  wartość pola. `setTitle(...)` zapisuje ją do stanu. `required` to wbudowana
  walidacja przeglądarki: pole nie może być puste.
- **Linie 99–109:** pole roku. `type="number"` używa inputa liczbowego,
  `min="1888"` ustawia minimalną wartość, `step="1"` wymaga kroku co 1
  (czyli pełnych lat), a `required` wymaga wpisania wartości. `onChange`
  zapisuje ją w `year`. W czasie dodawania `Number(year)` zmienia ten tekst
  na liczbę.
- **Linia 111:** `<fieldset>` grupuje powiązane pola gatunków.
- **Linia 112:** `<legend>` jest opisem grupy inputów.
- **Linia 113:** `genres.map(...)` tworzy jeden wiersz formularza dla każdego
  gatunku w tablicy stanu.
- **Linia 114:** `key={index}` daje Reactowi numer, dzięki któremu potrafi
  rozpoznać wiersz listy. `index` jest pozycją w tablicy, liczona od zera.
- **Linie 115–118:** tworzą input tekstowy. `aria-label` to opis pola dla
  czytników ekranu. `value={genre}` pokazuje wartość odpowiadającą temu
  wierszowi.
- **Linie 119–124:** przy wpisywaniu tworzy kopię tablicy przez
  `const updatedGenres = [...genres]`, zmienia element pod indeksem i
  przekazuje nową tablicę do `setGenres`. Kopia jest ważna, bo Reactowi należy
  przekazać nową wartość, a nie po cichu zmieniać starą tablicę.
- **Linia 125:** `required` wymaga wpisania wartości w każdy widoczny input
  gatunku. Puste dodatkowe pole trzeba wypełnić albo usunąć przyciskiem `−`.
- **Linie 127–138:** warunek `index > 0` oznacza „to nie jest pierwsze pole”.
  Dla takich pól wyświetlany jest przycisk `−`. Kliknięcie usuwa wybrany
  element z tablicy przez `.filter(...)`. Pierwsze pole zostaje zawsze.
- **Linie 139–149:** warunek `index === genres.length - 1` sprawdza, czy to
  ostatnie pole. Tylko przy nim jest przycisk `+`. Kliknięcie tworzy nową
  tablicę z `...current` i dopisanym pustym tekstem `""`.
- **Linia 153:** `formError && ...` można czytać: „jeśli `formError` nie jest
  pusty, pokaż ten paragraf”. `role="alert"` pomaga czytnikowi ekranu zauważyć
  błąd.
- **Linia 154:** przycisk `type="submit"` wysyła formularz.
- **Linia 155:** zamyka formularz.

#### Wszystkie walidacje formularza w jednym miejscu

1. **Tytuł wymagany:** atrybut HTML `required` na polu tytułu blokuje puste
   pole. Dodatkowo `trim()` usuwa spacje, a warunek `!movieTitle` blokuje
   tytuł składający się tylko ze spacji.
2. **Rok wymagany:** `required` w polu roku. `type="number"` wymaga wartości
   liczbowej, `min="1888"` ustawia dolną granicę, a `step="1"` wymaga
   całkowitej wartości.
3. **Co najmniej jeden gatunek:** `.trim()` oczyszcza pola, `.filter(Boolean)`
   usuwa puste wartości, a sprawdzenie `movieGenres.length === 0` blokuje
   brak gatunku.
4. **Każde widoczne pole gatunku:** ma `required`. Jeśli użytkownik doda
   drugie pole i zostawi je puste, przeglądarka poprosi o jego wypełnienie
   albo usunięcie.
5. **Tytuł i gatunek po trimowaniu:** dodatkowy warunek w `addMovie` pokazuje
   własny komunikat. Jest to potrzebne szczególnie dla tekstu złożonego
   wyłącznie ze spacji.

Nie ma sprawdzania, czy film o takim tytule już istnieje, czy rok jest
mniejszy od aktualnego, czy gatunki się powtarzają ani czy tekst jest
krótszy od określonego limitu. Takie zasady nie są obecnie dodane.

### Filtry, karty i pusty wynik — linie 157–201

- **Linia 157:** kontener przycisków filtrowania.
- **Linie 158–160:** kliknięcie przycisku „Wszystkie” zapisuje `"all"` w stanie
  `filter`.
- **Linie 162–164:** kliknięcie „Obejrzane” zapisuje `"watched"`.
- **Linie 166–168:** kliknięcie „Nieobejrzane” zapisuje `"unwatched"`.
- **Linie 170–176:** przycisk resetu. `type="button"` oznacza zwykły przycisk,
  a nie wysłanie formularza. `onClick` uruchamia `resetMovieProgress`.
- **Linie 179–180:** rozpoczynają listę i przechodzą przez widoczne filmy
  metodą `.map()`.
- **Linia 181:** `<MovieCard>` tworzy kartę filmu. Zapis z dużej litery
  wskazuje na komponent React.
- **Linia 182:** `key={movie.id}` daje karcie unikalny klucz w tej liście.
- **Linie 183–185:** przekazują dane filmu do karty jako propsy.
- **Linia 186:** przekazuje ocenę. `ratings[movie.id]` odczytuje ocenę z
  obiektu; `?? 0` znaczy „jeśli jej nie ma (`null`/`undefined`), użyj zera”.
- **Linia 187:** przekazuje `true` lub `false` — czy ID znajduje się w
  tablicy obejrzanych.
- **Linia 188:** przekazuje funkcję zmieniającą status obejrzenia. Zapis
  `() => ...` tworzy krótką funkcję, która uruchomi się dopiero po kliknięciu.
- **Linia 189:** przekazuje funkcję zapisującą ocenę wybraną w karcie.
- **Linie 194–196:** jeśli liczba widocznych filmów wynosi `0`, pojawia się
  komunikat o pustym wyniku.
- **Linia 201:** `export default App` udostępnia komponent innym plikom.

---

## 2. `src/components/MovieCard.tsx` — karta jednego filmu

### Pełny kod

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

function MovieCard({ title, year, genre, rating, watched, onToggle, onRate }: MovieCardProps) {
  return (
    <div className={watched ? "movie-card watched" : "movie-card"}>
      <h2>{title}</h2>
      <p>Rok: {year}</p>
      <p>Gatunek: {genre.join(", ")}</p>

      <div className="rating">
        <span>Ocena:</span>
        <div className="rating-stars" role="group" aria-label={`Ocena filmu ${title}`}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              className={value <= rating ? "star-button selected" : "star-button"}
              type="button"
              key={value}
              aria-label={`Oceń ${title}: ${value} ${value === 1 ? "gwiazdka" : "gwiazdki"}`}
              aria-pressed={rating === value}
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
```

### Wyjaśnienie kodu

- **Linia 1:** `type MovieCardProps = { ... }` tworzy opis danych, które karta
  musi otrzymać. To nie jest film, tylko instrukcja dla TypeScriptu, jak
  powinny wyglądać propsy karty.
- **Linia 2:** `title` musi być tekstem (`string`).
- **Linia 3:** `year` musi być liczbą (`number`).
- **Linia 4:** `genre` musi być tablicą tekstów (`string[]`).
- **Linia 5:** `rating` jest liczbą od 0 do 5. `0` oznacza brak oceny.
- **Linia 6:** `watched` jest wartością logiczną: `true` albo `false`.
- **Linia 7:** `onToggle` jest funkcją bez argumentów, która niczego nie
  zwraca. Rodzaj funkcji zapisuje się jako `() => void`.
- **Linia 8:** `onRate` jest funkcją, która przyjmuje liczbę oceny.
- **Linia 11:** funkcja komponentu odbiera propsy. Nawiasy klamrowe w
  argumentach wyciągają ich właściwości bezpośrednio, zamiast pisać
  `props.title`, `props.year` itd.
- **Linia 12:** `return` zwraca elementy strony.
- **Linia 13:** wyrażenie `warunek ? wartośćA : wartośćB` to skrócony warunek:
  jeśli `watched` jest prawdą, użyj `"movie-card watched"`, w przeciwnym
  razie `"movie-card"`.
- **Linia 14:** pokazuje tytuł.
- **Linia 15:** pokazuje rok.
- **Linia 16:** `.join(", ")` łączy elementy tablicy gatunków, np.
  `["Dramat", "Biograficzny"]` w tekst `"Dramat, Biograficzny"`.
- **Linie 18–20:** tworzą sekcję oceny. `aria-label` daje jej zrozumiałą nazwę
  dla czytników ekranu.
- **Linia 21:** tablica `[1, 2, 3, 4, 5]` to pięć możliwych ocen.
  `.map()` wykonuje funkcję dla każdej liczby i tworzy z niej przycisk.
- **Linia 23:** jeśli wartość gwiazdki jest mniejsza lub równa ocenie, dostaje
  klasę `selected`. Zmienna `value` jest kolejno 1, 2, 3, 4 i 5.
- **Linia 24:** `type="button"` oznacza przycisk, który nie wysyła formularza.
- **Linia 25:** `key={value}` daje każdemu przyciskowi gwiazdki osobny klucz.
- **Linia 26:** `aria-label` zawiera tekst dla czytnika ekranu, np.
  „Oceń Interstellar: 3 gwiazdki”.
- **Linia 27:** `aria-pressed` informuje, czy to dokładnie ta gwiazdka jest
  wybraną oceną.
- **Linia 28:** po kliknięciu uruchamia `onRate` i przekazuje wybraną liczbę.
- **Linia 30:** operator `? :` wybiera pełną gwiazdkę `★` dla oceny i pustą
  `☆` dla pozostałych.
- **Linia 34:** jeśli `rating > 0`, wyświetla np. `4/5`; jeśli nie, tekst
  „Brak oceny”. Zapis `` `${rating}/5` `` wstawia wartość do tekstu.
- **Linia 37:** tworzy przycisk statusu obejrzenia i podłącza `onToggle`.
- **Linia 38:** tekst przycisku zależy od statusu filmu.
- **Linie 40–42:** zamykają elementy JSX i funkcję komponentu.
- **Linia 44:** eksportuje komponent, żeby `App.tsx` mógł go zaimportować.

---

## 3. `src/types.ts` — opis filmu dla TypeScriptu

```ts
export type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string[];
};
```

- `export` udostępnia typ innym plikom.
- `type Movie` nadaje nazwę opisowi danych filmu.
- Nawiasy `{ ... }` grupują właściwości jednego filmu.
- `id: number` oznacza, że identyfikator jest liczbą.
- `title: string` oznacza, że tytuł jest tekstem.
- `year: number` oznacza, że rok jest liczbą.
- `genre: string[]` oznacza tablicę tekstów. Nawiasy `[]` po typie znaczą
  „lista takich wartości”.
- Średniki oddzielają właściwości obiektu.

Ten opis pomaga TypeScriptowi wykryć np. próbę zapisania tekstu zamiast
tablicy gatunków.

---

## 4. `src/data/movies.json` — dane filmów

```json
[
  {
    "id": 1,
    "title": "Interstellar",
    "year": 2014,
    "genre": ["Sci-Fi"]
  },
  {
    "id": 2,
    "title": "Inception",
    "year": 2010,
    "genre": ["Sci-Fi"]
  },
  {
    "id": 3,
    "title": "The Dark Knight",
    "year": 2008,
    "genre": ["Akcja"]
  },
  {
    "id": 4,
    "title": "Forrest Gump",
    "year": 1994,
    "genre": ["Dramat", "Biograficzny"]
  },
  {
    "id": 5,
    "title": "The Matrix",
    "year": 1999,
    "genre": ["Sci-Fi"]
  },
  {
    "id": 6,
    "title": "The Hangover",
    "year": 2009,
    "genre": ["Komedia"]
  },
  {
    "id": 7,
    "title": "Gladiator",
    "year": 2000,
    "genre": ["Historyczny"]
  },
  {
    "id": 8,
    "title": "Titanic",
    "year": 1997,
    "genre": ["Romans"]
  }
]
```

- Nawiasy kwadratowe na zewnątrz oznaczają tablicę, czyli listę filmów.
- Każda para nawiasów klamrowych `{ ... }` oznacza obiekt, czyli jeden film.
- W obiekcie tekst przed dwukropkiem, np. `"title"`, jest nazwą właściwości.
- Wartość po dwukropku jest jej danymi.
- Przecinki oddzielają właściwości lub kolejne obiekty.
- Cudzysłowy są wymagane wokół nazw właściwości i wartości tekstowych JSON.
- `genre` jest zawsze tablicą, nawet jeśli film ma tylko jeden gatunek.
- Forrest Gump ma dwa gatunki. To pokazuje, że jedno pole może zawierać
  kilka wartości.

JSON jest formatem danych, nie kodem JavaScript. Nie wpisuje się w nim funkcji
ani komentarzy.

---

## 5. `src/main.tsx` — miejsce startu strony

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- Pierwsza linia pobiera narzędzie `StrictMode` z Reacta. Pomaga ono wykrywać
  niektóre błędy w trybie developerskim.
- Druga linia pobiera `createRoot`, czyli funkcję, która uruchamia Reacta
  w wybranym elemencie HTML.
- Trzecia linia pobiera komponent `App`.
- `document.getElementById('root')` znajduje element `<div id="root">` w HTML.
- Wykrzyknik `!` po wywołaniu informuje TypeScript, że element istnieje.
  To założenie programisty; sam wykrzyknik nie tworzy elementu.
- `.render(...)` mówi Reactowi, co ma wyświetlić wewnątrz `root`.
- `<StrictMode>` otacza aplikację trybem developerskim.
- `<App />` to uruchomienie komponentu `App` w JSX.

---

## 6. `index.html` — szkielet strony

```html
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Moja lista filmów</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- `<!doctype html>` informuje przeglądarkę, że to dokument HTML5.
- `<html lang="pl">` rozpoczyna stronę i ustawia język polski.
- `<head>` zawiera ustawienia strony, zwykle niewidoczne w jej głównej treści.
- `charset="UTF-8"` ustawia kodowanie, które obsługuje polskie znaki.
- `<link ...>` wskazuje plik ikony przeglądarki.
- `viewport` pomaga dopasować stronę do szerokości telefonu lub komputera.
- `<title>` ustawia tekst na karcie przeglądarki.
- `<body>` zawiera widoczną zawartość strony.
- `<div id="root"></div>` jest pustym miejscem, w którym React wyświetli
  aplikację.
- `<script ...>` ładuje plik startowy `main.tsx`.
- Znaczniki z ukośnikiem, np. `</body>`, zamykają wcześniej otwarte elementy.

---

## 7. `src/App.css` — wygląd strony

CSS to język stylów. Selektor wybiera element, a deklaracje w nawiasach
klamrowych określają jego wygląd. Przykładowo:

```css
button {
  background: #66d1c2;
  color: #10202b;
}
```

`button` wybiera wszystkie przyciski. `background` ustawia ich tło, a `color`
kolor tekstu. Właściwości oddziela się średnikami. Kolory zapisane jako `#...`
to kody szesnastkowe.

Poniżej opisane są wszystkie główne bloki obecnego pliku CSS:

| Selektor / fragment | Co oznacza |
|---|---|
| `body` | Styl całej strony: usuwa domyślny margines, ustawia tło, kolor tekstu i rodzinę fontów. |
| `.app` | Kropka oznacza selektor klasy. Ustawia maksymalną szerokość, wyśrodkowanie i odstępy głównego kontenera. |
| `h1` | Styluje główny nagłówek. `clamp(min, płynna wartość, max)` dopasowuje jego rozmiar do ekranu. |
| `h1::after` | `::after` dodaje ozdobny element po tekście nagłówka. `content: ""` jest wymagane, by pseudo-element był widoczny. |
| `h3` | Styluje licznik obejrzanych filmów. |
| `.movie-form` | `display: grid` układa elementy formularza w siatce; `grid-template-columns` ustala kolumny; `gap` odstępy; `padding` wewnętrzny margines. |
| `.movie-form h2, .genre-fields, .form-error` | Przecinki łączą selektory: wszystkie wskazane elementy zajmują całą szerokość siatki przez `grid-column`. |
| `.movie-form h2` | Styl nagłówka formularza. Zapis ze spacją wybiera `h2` znajdujące się wewnątrz elementu `.movie-form`. |
| `.movie-form label` | Układa etykietę i pole jedno pod drugim oraz nadaje kolor i rozmiar tekstu. |
| `.movie-form input` | Styl pól formularza: szerokość, obramowanie, tło, tekst i odstępy wewnętrzne. |
| `.genre-fields` | Układa dynamiczne wiersze gatunków, usuwa domyślne obramowanie `fieldset`. |
| `.genre-fields legend` | Wygląd opisu grupy gatunków. |
| `.genre-input-row` | Układa input i przyciski `+`/`−` obok siebie przez flexbox. |
| `.genre-input-row input` | `flex: 1` pozwala polu zająć wolną szerokość w wierszu. |
| `.form-error` | Kolor własnego komunikatu walidacji. |
| `button` | Podstawowy wygląd przycisków. `cursor: pointer` pokazuje kursor ręki. |
| `button:hover` | `:hover` stosuje styl, kiedy wskaźnik myszy znajduje się nad przyciskiem. |
| `.movie-form > button` | Znak `>` wybiera bezpośrednie dziecko formularza — tutaj przycisk „Dodaj”. Ustawia go w kolumnie siatki. |
| `.genre-input-row button` | Zmienia rozmiar przycisków obok pól gatunków. |
| `.remove-genre-button` | Klasa przycisku `−`; nadaje mu inny kolor. |
| `.remove-genre-button:hover` | Zmienia jego wygląd po najechaniu. |
| `.filters` | Ustawia filtry jako rząd elastycznych przycisków; `flex-wrap` pozwala im przejść do kolejnego wiersza. |
| `.filters button` | Osobny wygląd przycisków filtrów. |
| `.filters button:hover` | Wygląd filtra po najechaniu. |
| `.filters .clear-all-button` | Wybiera reset tylko wewnątrz filtrów. Klasa specjalna odróżnia go od filtrów. |
| `.filters .clear-all-button:hover:not(:disabled)` | Styl najechania tylko wtedy, gdy przycisk nie jest wyłączony. `:not(...)` oznacza „nie pasuje do”. |
| `.filters .clear-all-button:disabled` | Styl przycisku z atrybutem HTML `disabled`. Obecnie przycisk nie dostaje tego atrybutu, więc ten styl nie zmienia jego wyglądu. |
| `.movies` | Siatka kart. `repeat(3, minmax(0, 1fr))` tworzy trzy równe kolumny; `gap` ustawia odstęp. |
| `.movie-card` | Wygląd każdej karty filmu, jej tło, obramowanie, wewnętrzny odstęp i minimalna wysokość. |
| `.movie-card::before` | Dekoracyjny pasek na górze karty. `position: absolute` pozycjonuje go względem karty. |
| `.movie-card:nth-child(3n + 2)::before` | Wybiera co trzecią kartę, zaczynając od drugiej, i zmienia kolor jej paska. |
| `.movie-card:nth-child(3n)::before` | Wybiera co trzecią kartę, zaczynając od trzeciej. |
| `.movie-card.watched` | Selektor z dwiema klasami wybiera kartę, która ma jednocześnie `movie-card` i `watched`. |
| `.movie-card h2` | Styl tytułu znajdującego się w karcie. |
| `.movie-card p` | Styl tekstów z rokiem i gatunkami. |
| `.rating` | Układa etykietę, gwiazdki i tekst oceny obok siebie; zawijanie chroni układ na węższej karcie. |
| `.rating-stars` | Układa pięć gwiazdek w jednym rzędzie. |
| `.star-button` | Styluje przyciski gwiazdek oddzielnie od zwykłych przycisków. |
| `.star-button:hover, .star-button.selected` | Wspólny styl dla najechanej gwiazdki i gwiazdek należących do wybranej oceny. |
| `.rating-value` | Styl tekstu `3/5` lub „Brak oceny”. |
| `button:focus-visible, input:focus-visible` | Widoczny obrys, gdy element jest zaznaczony klawiaturą, np. klawiszem Tab. |
| `@media (max-width: 800px)` | Reguły wewnątrz działają przy szerokości ekranu do 800 pikseli: lista ma dwie kolumny i zmienia się układ formularza. |
| `@media (max-width: 560px)` | Reguły dla małego ekranu: zmniejszają odstępy, formularz i lista układają się w jednej kolumnie. |

W CSS:

- `.` na początku nazwy, np. `.movie-card`, oznacza klasę HTML;
- `#` w kodzie koloru, np. `#101b28`, rozpoczyna zapis koloru;
- `{` rozpoczyna zestaw ustawień selektora, a `}` go kończy;
- `:` oddziela nazwę właściwości od jej wartości;
- `;` kończy jedną deklarację stylu.

---

## 8. `package.json` — uruchamianie i biblioteki

Najważniejsze polecenia w pliku `package.json`:

- `npm run dev` uruchamia lokalną stronę do pracy nad projektem;
- `npm run build` sprawdza typy TypeScript i buduje gotową aplikację;
- `npm run lint` sprawdza kod narzędziem Oxlint;
- `npm run preview` uruchamia podgląd zbudowanej aplikacji.

`react` i `react-dom` są bibliotekami używanymi przez stronę. TypeScript,
Vite, typy Reacta i Oxlint są narzędziami używanymi podczas tworzenia
i sprawdzania projektu.

Pełna zawartość aktualnego `package.json`:

```json
{
  "name": "my-movie-list",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.4",
    "@vitejs/plugin-react": "^6.1.0",
    "oxlint": "^1.79.0",
    "typescript": "~6.0.2",
    "vite": "^8.2.2"
  }
}
```

- JSON ma zewnętrzny obiekt `{ ... }`.
- `name`, `private`, `version` i `type` opisują projekt i sposób ładowania
  modułów.
- `scripts` jest obiektem z nazwami poleceń i odpowiadającymi im komendami.
- `dependencies` wymienia biblioteki potrzebne aplikacji podczas działania.
- `devDependencies` wymienia narzędzia potrzebne głównie przy tworzeniu,
  sprawdzaniu i budowaniu projektu.

## 9. Pełny kod `src/App.css`

Poniższy blok to cały aktualny CSS. Opis znaczenia reguł znajduje się w
sekcji 7 powyżej. W nim nie ma funkcji ani danych filmu — są tylko reguły
wyglądu.

```css
body {
  margin: 0;
  background: #101b28;
  color: #f5f1e8;
  font-family: "Trebuchet MS", Arial, sans-serif;
}

.app {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 32px 64px;
}

h1 {
  margin: 0;
  color: #f5f1e8;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.8rem, 7vw, 5.5rem);
  font-weight: normal;
  letter-spacing: -3px;
}

h1::after {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 0 0 8px 12px;
  border-radius: 50%;
  background: #f4b942;
  content: "";
}

h3 {
  margin: 8px 0 32px;
  color: #9eabb7;
  font-size: 1rem;
  font-weight: normal;
}

.movie-form {
  display: grid;
  grid-template-columns: 1fr 170px auto;
  align-items: end;
  gap: 16px;
  margin-bottom: 30px;
  padding: 22px;
  border: 1px solid #314455;
  border-radius: 16px;
  background: #1a2a3a;
}

.movie-form h2,
.genre-fields,
.form-error {
  grid-column: 1 / -1;
}

.movie-form h2 {
  margin: 0 0 2px;
  color: #66d1c2;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.45rem;
  font-weight: normal;
}

.movie-form label {
  display: grid;
  gap: 7px;
  color: #c2cbd1;
  font-size: 0.9rem;
}

.movie-form input {
  box-sizing: border-box;
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #405669;
  border-radius: 8px;
  background: #111f2c;
  color: #f5f1e8;
  font: inherit;
}

.genre-fields {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  border: 0;
}

.genre-fields legend {
  margin-bottom: 7px;
  color: #c2cbd1;
  font-size: 0.9rem;
}

.genre-input-row {
  display: flex;
  gap: 8px;
}

.genre-input-row input {
  flex: 1;
}

.form-error {
  margin: 0;
  color: #f4b942;
}

button {
  padding: 11px 17px;
  border: 0;
  border-radius: 8px;
  background: #66d1c2;
  color: #10202b;
  font: inherit;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #8be2d5;
}

.movie-form > button {
  grid-column: 3;
  grid-row: 2;
  white-space: nowrap;
}

.genre-input-row button {
  min-width: 42px;
  padding: 8px;
  font-size: 1.2rem;
}

.remove-genre-button {
  background: #405669;
  color: #f5f1e8;
}

.remove-genre-button:hover {
  background: #536b7e;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0 0 22px;
}

.filters button {
  padding: 8px 15px;
  border: 1px solid #405669;
  border-radius: 20px;
  background: transparent;
  color: #c2cbd1;
  font-weight: normal;
}

.filters button:hover {
  border-color: #66d1c2;
  background: #1a2a3a;
  color: #66d1c2;
}

.filters .clear-all-button {
  margin-left: auto;
  border-color: #cf8068;
  color: #f0b29e;
}

.filters .clear-all-button:hover:not(:disabled) {
  background: #3a2930;
  color: #f5f1e8;
}

.filters .clear-all-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.movies {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.movie-card {
  position: relative;
  overflow: hidden;
  min-height: 190px;
  padding: 22px;
  border: 1px solid #314455;
  border-radius: 14px;
  background: #1a2a3a;
}

.movie-card::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 5px;
  background: #66d1c2;
  content: "";
}

.movie-card:nth-child(3n + 2)::before {
  background: #f4b942;
}

.movie-card:nth-child(3n)::before {
  background: #cf8068;
}

.movie-card.watched {
  background: #223747;
}

.movie-card h2 {
  margin: 4px 0 14px;
  color: #f5f1e8;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.55rem;
  font-weight: normal;
}

.movie-card p {
  color: #b5c0c8;
  line-height: 1.5;
}

.rating {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin: 16px 0;
  color: #c2cbd1;
}

.rating-stars {
  display: flex;
}

.star-button {
  padding: 2px;
  background: transparent;
  color: #83909a;
  font-size: 1.4rem;
}

.star-button:hover,
.star-button.selected {
  background: transparent;
  color: #f4b942;
}

.rating-value {
  color: #9eabb7;
  font-size: 0.85rem;
}

button:focus-visible,
input:focus-visible {
  outline: 2px solid #f4b942;
  outline-offset: 3px;
}

@media (max-width: 800px) {
  .movies {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .movie-form {
    grid-template-columns: 1fr 150px;
  }

  .movie-form > button {
    grid-column: 1 / -1;
    grid-row: auto;
    justify-self: start;
  }
}

@media (max-width: 560px) {
  .app {
    padding: 32px 18px 44px;
  }

  .movie-form {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .movie-form h2,
  .genre-fields,
  .form-error,
  .movie-form > button {
    grid-column: 1;
  }

  .movies {
    grid-template-columns: 1fr;
  }
}
```

## 10. Co jest zapamiętywane?

Wszystkie zmienne utworzone przez `useState` są przechowywane w pamięci
działającej strony. Aplikacja nie zapisuje ich na stałe do serwera ani do
przeglądarkowego `localStorage`. Po odświeżeniu:

- filmy wracają do zawartości `movies.json`;
- oznaczenia obejrzenia i oceny są puste;
- formularz jest pusty.

Najważniejszy przepływ działania:

1. Użytkownik klika przycisk lub wpisuje tekst.
2. React wywołuje funkcję zdarzenia, np. `onClick`, `onChange` lub `onSubmit`.
3. Funkcja aktualizuje stan za pomocą odpowiedniego `set...`.
4. React ponownie uruchamia komponent i tworzy widok z nowymi wartościami.
5. Przeglądarka pokazuje zaktualizowaną stronę.
## 9. Co jest zapamiętywane?

`useState` przechowuje dane tylko w działającej karcie przeglądarki. Program
nie zapisuje zmian do serwera, pliku JSON ani `localStorage`. Po odświeżeniu
strony:

- filmy wracają do wartości z `movies.json`;
- obejrzane statusy są puste;
- oceny są puste;
- formularz jest wyczyszczony.

Warto zapamiętać najważniejszy przepływ:

1. Użytkownik klika lub wpisuje tekst.
2. Zdarzenie uruchamia funkcję, np. `onClick` albo `onChange`.
3. Funkcja zmienia stan przez setter `set...`.
4. React ponownie renderuje komponent z nowym stanem.
5. Widok pokazuje aktualne dane.
