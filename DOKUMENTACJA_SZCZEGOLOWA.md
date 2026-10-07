# React + TypeScript — Dokumentacja

 ## 1\. Co robi aplikacja?

 Aplikacja jest listą filmów.

 Można w niej:

 - wyświetlać filmy,
- dodawać nowe filmy,
- dodawać wiele gatunków,
- oznaczać filmy jako obejrzane,
- oceniać filmy od 1 do 5,
- filtrować filmy:
  - wszystkie,
  - obejrzane,
  - nieobejrzane,
- wyczyścić informacje o obejrzeniu i ocenach.

 Aplikacja składa się głównie z dwóch komponentów:

```
App
 └── MovieCard
      └── pojedynczy film
```

 `App` przechowuje dane i logikę aplikacji.

 `MovieCard` wyświetla pojedynczy film.

---

 # 2\. Importy

```
import { useState, type SubmitEvent } from "react";
import MovieCard from "./components/MovieCard";
import initialMovies from "./data/movies.json";
import "./App.css";
```

 ### `useState`

 `useState` służy do przechowywania danych, które mogą się zmieniać.

 Przykład:

```
const [title, setTitle] = useState("");
```

 Mamy tutaj:

 - `title` — aktualna wartość,
- `setTitle` — funkcja zmieniająca wartość,
- `""` — wartość początkowa.

 Jeżeli wykonamy:

```
setTitle("Avatar");
```

 to `title` będzie miało wartość:

```
"Avatar"
```

---

 ### `SubmitEvent`

```
type SubmitEvent
```

 To typ TypeScript opisujący zdarzenie wysłania formularza.

```
const addMovie = (event: SubmitEvent<HTMLFormElement>) => {
```

 Oznacza:

 > `event` jest zdarzeniem wysłania formularza HTML.

---

 ### `MovieCard`

```
import MovieCard from "./components/MovieCard";
```

 Importujemy własny komponent odpowiedzialny za wyświetlanie jednego filmu.

---

 ### `initialMovies`

```
import initialMovies from "./data/movies.json";
```

 Importujemy początkową listę filmów z pliku JSON.

---

 # 3\. Typ `Movie`

```
type Movie = {
  id: number;
  title: string;
  year: number;
  genre: string[];
};
```

 Definiuje, jak wygląda obiekt filmu.

 Film posiada:

```
id      → number
title   → string
year    → number
genre   → string[]
```

 Przykład poprawnego filmu:

```
{
  id: 1,
  title: "Interstellar",
  year: 2014,
  genre: ["Sci-Fi"]
}
```

 `string[]` oznacza:

 > tablica elementów typu `string`.

 Dlatego może być:

```
genre: ["Dramat", "Biograficzny"]
```

---

 # 4\. Komponent `App`

```
function App() {
```

 `App` jest głównym komponentem aplikacji.

 To tutaj znajduje się większość logiki oraz stan aplikacji.

---

 # 5\. Stan filmów

```
const [movies, setMovies] = useState<Movie[]>(initialMovies);
```

 `movies` — aktualna lista filmów.

 `setMovies` — funkcja zmieniająca listę filmów.

 `Movie[]` oznacza:

 > tablica obiektów typu `Movie`.

 `initialMovies` to wartość początkowa.

---

 # 6\. Stan obejrzanych filmów

```
const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
```

 Przechowuje ID obejrzanych filmów.

 Na początku:

```
[]
```

 czyli żaden film nie jest obejrzany.

 Przykład:

```
[1, 3, 5]
```

 oznacza:

```
film 1 → obejrzany
film 3 → obejrzany
film 5 → obejrzany
```

---

 # 7\. Stan ocen

```
const [ratings, setRatings] = useState<Record<number, number>>({});
```

 Przechowuje oceny filmów.

 Przykład:

```
{
  1: 5,
  2: 4,
  5: 3
}
```

 oznacza:

```
film 1 → 5/5
film 2 → 4/5
film 5 → 3/5
```

 `Record<number, number>` oznacza tutaj obiekt:

```
ID filmu → ocena
```

---

 # 8\. Stan filtra

```
const [filter, setFilter] = useState("all");
```

 Przechowuje aktualnie wybrany filtr.

 Możliwe wartości:

```
"all"
"watched"
"unwatched"
```

 Na początku:

```
filter = "all"
```

 czyli pokazujemy wszystkie filmy.

---

 # 9\. Stan formularza

 ## Tytuł

```
const [title, setTitle] = useState("");
```

 Przechowuje tytuł wpisany przez użytkownika.

---

 ## Rok

```
const [year, setYear] = useState("");
```

 Przechowuje rok wpisany w formularzu.

 Jest tutaj `string`, ponieważ wartość pobierana z inputa jest tekstem.

 Później zamieniamy ją na liczbę:

```
Number(year)
```

---

 ## Gatunki

```
const [genres, setGenres] = useState([""]);
```

 Przechowuje tablicę gatunków.

 Na początku:

```
[""]
```

 Po wpisaniu:

```
["Sci-Fi"]
```

 Może też być:

```
["Sci-Fi", "Akcja", "Dramat"]
```

---

 ## Błąd formularza

```
const [formError, setFormError] = useState("");
```

 Przechowuje komunikat błędu.

 Na początku:

```
""
```

 Jeżeli użytkownik poda niepoprawne dane:

```
setFormError("Podaj tytuł filmu i co najmniej jeden gatunek.");
```

---

 # 10\. `toggleWatched`

```
const toggleWatched = (id: number) => {
```

 Funkcja zmienia status filmu:

```
obejrzany ↔ nieobejrzany
```

 Najpierw:

```
if (watchedMovies.includes(id)) {
```

 `includes()` sprawdza, czy dane ID znajduje się w tablicy.

 Przykład:

```
watchedMovies = [1, 3, 5]
```

```
watchedMovies.includes(3)
```

 wynik:

```
true
```

---

 ## Usuwanie filmu z listy obejrzanych

```
setWatchedMovies((current) =>
  current.filter((movieId) => movieId !== id)
);
```

 `filter()` tworzy nową tablicę.

 Przykład:

```
[1, 3, 5]
```

 Usuwamy `3`:

```
[1, 5]
```

---

 ## Dodawanie filmu do listy obejrzanych

```
setWatchedMovies((current) => [...current, id]);
```

 `...current` kopiuje istniejące elementy.

 Przykład:

```
current = [1, 3]
id = 5
```

 wynik:

```
[1, 3, 5]
```

---

 # 11\. `addMovie`

```
const addMovie = (event: SubmitEvent<HTMLFormElement>) => {
```

 Funkcja dodaje nowy film.

---

 ## `preventDefault()`

```
event.preventDefault();
```

 Blokuje domyślne zachowanie formularza.

 Dzięki temu strona nie przeładowuje się po wysłaniu formularza.

 Można powiedzieć:

 > `preventDefault()` pozwala Reactowi samodzielnie obsłużyć formularz.

---

 # 12\. `trim()`

```
const movieTitle = title.trim();
```

 Usuwa spacje z początku i końca tekstu.

 Przykład:

```
"   Matrix   "
```

 zmieni się na:

```
"Matrix"
```

---

 # 13\. Przygotowanie gatunków

```
const movieGenres = genres
  .map((genre) => genre.trim())
  .filter(Boolean);
```

 Najpierw `map()` przechodzi po wszystkich gatunkach i usuwa spacje.

 Przykład:

```
[" Sci-Fi ", " Akcja "]
```

 staje się:

```
["Sci-Fi", "Akcja"]
```

 Potem:

```
filter(Boolean)
```

 usuwa puste elementy.

 Przykład:

```
["Sci-Fi", "", "Akcja"]
```

 staje się:

```
["Sci-Fi", "Akcja"]
```

---

 # 14\. Walidacja formularza

```
if (!movieTitle || movieGenres.length === 0) {
```

 Sprawdzamy:

 1. czy tytuł jest pusty,
2. czy nie podano żadnego gatunku.

 Jeżeli warunek jest spełniony:

```
setFormError("Podaj tytuł filmu i co najmniej jeden gatunek.");
return;
```

 `return` kończy działanie funkcji.

 Film nie zostanie dodany.

---

 # 15\. Tworzenie ID filmu

```
const nextId =
  Math.max(0, ...current.map((movie) => movie.id)) + 1;
```

 Najpierw:

```
current.map((movie) => movie.id)
```

 pobiera wszystkie ID.

 Przykład:

```
[1, 2, 5, 8]
```

 Następnie:

```
Math.max(0, 1, 2, 5, 8)
```

 zwraca:

```
8
```

 Dodajemy `1`:

```
9
```

 Nowy film dostanie ID `9`.

---

 # 16\. Dodanie filmu

```
return [
  ...current,
  {
    id: nextId,
    title: movieTitle,
    year: Number(year),
    genre: movieGenres,
  },
];
```

 Tworzymy nową tablicę zawierającą:

```
stare filmy
+
nowy film
```

 `Number(year)` zamienia rok z tekstu na liczbę.

---

 # 17\. Czyszczenie formularza

 Po dodaniu filmu:

```
setTitle("");
setYear("");
setGenres([""]);
setFormError("");
```

 Czyścimy wszystkie pola formularza.

---

 # 18\. `updateRating`

```
const updateRating = (id: number, rating: number) => {
  setRatings((current) => ({ ...current, [id]: rating }));
};
```

 Zmienia ocenę filmu.

 Przykład:

```
current = {
  1: 5,
  2: 3
}
```

 Wywołujemy:

```
updateRating(2, 4);
```

 Otrzymujemy:

```
{
  1: 5,
  2: 4
}
```

---

 # 19\. `resetMovieProgress`

```
const resetMovieProgress = () => {
  setWatchedMovies([]);
  setRatings({});
};
```

 Czyści:

 - listę obejrzanych filmów,
- wszystkie oceny.

 Nie usuwa filmów.

---

 # 20\. Filtrowanie filmów

```
const filteredMovies = movies.filter((movie) => {
```

 `filter()` tworzy nową tablicę filmów.

---

 ## Filtr „obejrzane”

```
if (filter === "watched") {
  return watchedMovies.includes(movie.id);
}
```

 Pokazuje tylko filmy, których ID znajduje się w `watchedMovies`.

---

 ## Filtr „nieobejrzane”

```
if (filter === "unwatched") {
  return !watchedMovies.includes(movie.id);
}
```

 `!` oznacza negację.

 Czyli:

 > pokaż filmy, których ID NIE znajduje się w `watchedMovies`.

---

 ## Filtr „wszystkie”

```
return true;
```

 Każdy film zostaje pokazany.

---

 # 21\. JSX

```
return (
  <div className="app">
```

 JSX pozwala pisać strukturę interfejsu podobną do HTML wewnątrz Reacta.

 Przykład:

```
<h1>Moja lista filmów</h1>
```

---

 # 22\. `.length`

```
<h3>
  Obejrzane: {watchedMovies.length} / {movies.length}
</h3>
```

 `.length` mówi, ile elementów znajduje się w tablicy.

 Jeżeli:

```
watchedMovies = [1, 2, 5]
```

 to:

```
watchedMovies.length
```

 wynosi:

```
3
```

 Jeżeli wszystkich filmów jest 8:

```
Obejrzane: 3 / 8
```

---

 # 23\. Formularz

```
<form className="movie-form" onSubmit={addMovie}>
```

```
onSubmit={addMovie}
```

 oznacza:

 > Po wysłaniu formularza uruchom funkcję `addMovie`.

---

 # 24\. Controlled input

 Przykład:

```
<input
  type="text"
  value={title}
  onChange={(event) => {
    setTitle(event.target.value);
    setFormError("");
  }}
  required
/>
```

 Jest to **controlled input**.

 Wartość inputa jest kontrolowana przez stan Reacta.

```
value={title}
```

 pobiera wartość ze stanu.

```
onChange
```

 reaguje na wpisywanie.

```
setTitle(event.target.value);
```

 zapisuje nową wartość do stanu.

 Schemat:

```
użytkownik wpisuje tekst
        ↓
onChange
        ↓
setTitle(...)
        ↓
zmiana state
        ↓
React renderuje ponownie
```

---

 # 25\. Input roku

```
<input
  type="number"
  min="1888"
  step="1"
  value={year}
  onChange={(event) => setYear(event.target.value)}
  required
/>
```

 ### `type="number"`

 Pole liczbowe.

 ### `min="1888"`

 Minimalna wartość to 1888.

 ### `step="1"`

 Wartość zwiększa się co 1.

 ### `value={year}`

 Wartość pochodzi ze stanu.

 ### `onChange`

 Aktualizuje stan po wpisaniu wartości.

 ### `required`

 Pole jest wymagane.

---

 # 26\. Dynamiczne gatunki

```
{genres.map((genre, index) => (
```

 Dla każdego elementu tablicy `genres` tworzony jest input.

 Przykład:

```
genres = ["Sci-Fi", "Akcja"]
```

 spowoduje utworzenie dwóch pól.

---

 # 27\. `key`

```
key={index}
```

 `key` pomaga Reactowi identyfikować elementy podczas renderowania listy.

 `index` oznacza numer elementu:

```
Sci-Fi → 0
Akcja → 1
Dramat → 2
```

---

 # 28\. Aktualizacja gatunku

```
const updatedGenres = [...genres];
updatedGenres[index] = event.target.value;
setGenres(updatedGenres);
```

 Najpierw tworzymy kopię tablicy.

 Przykład:

```
["Sci-Fi", "Akcja"]
```

 Następnie zmieniamy konkretny element.

 Jeżeli `index = 1`:

```
["Sci-Fi", "Dramat"]
```

 Na końcu:

```
setGenres(updatedGenres);
```

 zapisujemy nową tablicę do stanu.

---

 # 29\. Dodawanie kolejnego gatunku

```
{index === genres.length - 1 && (
```

 Oznacza:

 > Jeżeli jesteśmy przy ostatnim gatunku, pokaż przycisk `+`.

 Po kliknięciu:

```
setGenres((current) => [...current, ""])
```

 dodajemy pusty element.

 Przykład:

```
["Sci-Fi"]
```

 zmienia się na:

```
["Sci-Fi", ""]
```

 React wyświetli nowe pole.

---

 # 30\. Warunkowe renderowanie

```
{formError && (
  <p className="form-error">
    {formError}
  </p>
)}
```

 Jeżeli `formError` jest pusty:

```
""
```

 komunikat się nie pojawi.

 Jeżeli:

```
"Podaj tytuł filmu..."
```

 komunikat zostanie wyświetlony.

 Jest to przykład **warunkowego renderowania**.

---

 # 31\. Filtry

```
<button onClick={() => setFilter("all")}>
```

 Kliknięcie ustawia:

```
filter = "all"
```

---

```
<button onClick={() => setFilter("watched")}>
```

 Ustawia:

```
filter = "watched"
```

---

```
<button onClick={() => setFilter("unwatched")}>
```

 Ustawia:

```
filter = "unwatched"
```

 Po zmianie stanu React ponownie renderuje komponent.

---

 # 32\. Wyświetlanie filmów

```
{filteredMovies.map((movie) => (
  <MovieCard
```

 Dla każdego filmu tworzony jest komponent:

```
<MovieCard />
```

 Jeżeli mamy 8 filmów, powstanie 8 komponentów `MovieCard`.

---

 # 33\. Props

```
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
```

 Do `MovieCard` przekazujemy dane.

 Są to **propsy**.

 Schemat:

```
App
 |
 | title
 | year
 | genre
 | rating
 | watched
 | onToggle
 | onRate
 ↓
MovieCard
```

---

 # 34\. `??`

```
rating={ratings[movie.id] ?? 0}
```

 Sprawdzamy ocenę filmu.

 Jeśli film ma ocenę:

```
5
```

 przekazujemy `5`.

 Jeżeli oceny nie ma i jest `undefined`:

```
?? 0
```

 ustawia wartość `0`.

 Czyli:

```
jest ocena → użyj oceny
brak oceny → użyj 0
```

 `??` to operator **nullish coalescing**.

---

 # 35\. `watched`

```
watched={watchedMovies.includes(movie.id)}
```

 Sprawdzamy, czy film jest obejrzany.

 Wynik to:

```
true
```

 albo:

```
false
```

---

 # 36\. Callback `onToggle`

```
onToggle={() => toggleWatched(movie.id)}
```

 Przekazujemy funkcję do `MovieCard`.

 Kiedy użytkownik kliknie przycisk w `MovieCard`, zostanie wykonane:

```
toggleWatched(movie.id)
```

 Czyli `MovieCard` może poinformować `App`:

 > Użytkownik zmienił status filmu.

---

 # 37\. Callback `onRate`

```
onRate={(rating) => updateRating(movie.id, rating)}
```

 Podobnie działa ocena.

 Jeżeli użytkownik kliknie 4 gwiazdki:

```
onRate(4)
```

 a następnie w `App`:

```
updateRating(movie.id, 4)
```

 zapisujemy ocenę.

---

 # 38\. `MovieCardProps`

```
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

 Definiuje typ propsów komponentu `MovieCard`.

 Czyli `MovieCard` otrzymuje:

```
title    → string
year     → number
genre    → string[]
rating   → number
watched   → boolean
onToggle → funkcja
onRate   → funkcja
```

---

 # 39\. Destrukturyzacja propsów

```
function MovieCard({
  title,
  year,
  genre,
  rating,
  watched,
  onToggle,
  onRate
}: MovieCardProps) {
```

 Zamiast pisać:

```
props.title
props.year
props.genre
```

 od razu otrzymujemy:

```
title
year
genre
```

 Jest to **destrukturyzacja**.

---

 # 40\. `className` zależny od stanu

```
<div className={watched ? "movie-card watched" : "movie-card"}>
```

 To jest operator ternarny.

 Schemat:

```
warunek ? jeśli prawda : jeśli fałsz
```

 Czyli:

```
watched
  ? "movie-card watched"
  : "movie-card"
```

 Jeżeli film jest obejrzany:

```
movie-card watched
```

 Jeżeli nie:

```
movie-card
```

 Dzięki temu CSS może inaczej wyglądać dla obejrzanych filmów.

---

 # 41\. `join()`

```
<p>Gatunek: {genre.join(", ")}</p>
```

 Jeżeli mamy:

```
["Dramat", "Akcja"]
```

 to:

```
genre.join(", ")
```

 daje:

```
Dramat, Akcja
```

 `join()` łączy elementy tablicy w jeden tekst.

---

 # 42\. Tworzenie gwiazdek

```
{[1, 2, 3, 4, 5].map((value) => (
```

 Tworzymy 5 gwiazdek.

 Tablica:

```
[1, 2, 3, 4, 5]
```

 jest używana przez `map()`.

---

 # 43\. Wybrana gwiazdka

```
className={
  value <= rating
    ? "star-button selected"
    : "star-button"
}
```

 Jeśli ocena wynosi `3`:

```
1 <= 3 → tak
2 <= 3 → tak
3 <= 3 → tak
4 <= 3 → nie
5 <= 3 → nie
```

 Efekt:

```
★★★☆☆
```

---

 # 44\. Kliknięcie gwiazdki

```
onClick={() => onRate(value)}
```

 Jeżeli użytkownik kliknie czwartą gwiazdkę:

```
onRate(4)
```

 Następnie funkcja przekazana z `App` aktualizuje ocenę.

---

 # 45\. Wyświetlanie symbolu gwiazdki

```
{value <= rating ? "★" : "☆"}
```

 Jeśli gwiazdka jest wybrana:

```
★
```

 Jeżeli nie:

```
☆
```

---

 # 46\. Wyświetlanie oceny

```
{rating > 0 ? `${rating}/5` : "Brak oceny"}
```

 Jeżeli:

```
rating = 4
```

 wyświetli:

```
4/5
```

 Jeżeli:

```
rating = 0
```

 wyświetli:

```
Brak oceny
```

 To również jest operator ternarny.

---

 # 47\. Przycisk obejrzenia

```
<button type="button" onClick={onToggle}>
```

 Po kliknięciu uruchamiamy:

```
onToggle()
```

 Funkcja pochodzi z komponentu `App`.

---

 # 48\. Tekst przycisku

```
{watched
  ? "✓ Obejrzany"
  : "Oznacz jako obejrzany"}
```

 Jeżeli:

```
watched = true
```

 pokazuje:

```
✓ Obejrzany
```

 Jeżeli:

```
watched = false
```

 pokazuje:

```
Oznacz jako obejrzany
```

---

 # 49\. Najważniejsze metody tablic

 ## `map()`

 Przechodzi po elementach i tworzy nową tablicę.

```
[1, 2, 3].map(x => x * 2)
```

 wynik:

```
[2, 4, 6]
```

 W projekcie:

```
movies.map(...)
```

 tworzy komponent `MovieCard` dla każdego filmu.

---

 ## `filter()`

 Wybiera elementy spełniające warunek.

```
[1, 2, 3, 4].filter(x => x > 2)
```

 wynik:

```
[3, 4]
```

 W projekcie służy między innymi do filtrowania filmów.

---

 ## `includes()`

 Sprawdza, czy element znajduje się w tablicy.

```
[1, 2, 3].includes(2)
```

 wynik:

```
true
```

---

 ## `join()`

 Łączy elementy tablicy w tekst.

```
["Dramat", "Akcja"].join(", ")
```

 wynik:

```
"Dramat, Akcja"
```

---

 ## `length`

 Zwraca liczbę elementów.

```
[1, 2, 3].length
```

 wynik:

```
3
```

---

 # 50\. Spread operator `...`

 ## Tablice

```
const newArray = [...oldArray, newElement];
```

 Tworzy nową tablicę.

 Przykład:

```
const oldArray = [1, 2];
const newArray = [...oldArray, 3];
```

 wynik:

```
[1, 2, 3]
```

---

 ## Obiekty

```
{
  ...current,
  [id]: rating
}
```

 Kopiuje właściwości starego obiektu i zmienia/dodaje wartość dla danego ID.

---

 # 51\. Operator ternarny `? :`

 Schemat:

```
warunek ? wartośćJeśliPrawda : wartośćJeśliFałsz
```

 Przykład:

```
watched ? "Obejrzany" : "Nieobejrzany"
```

 Jeżeli `watched` jest `true`:

```
Obejrzany
```

 Jeżeli `false`:

```
Nieobejrzany
```

---

 # 52\. Operator `&&`

 Przykład:

```
{formError && <p>{formError}</p>}
```

 Oznacza:

 > Jeżeli `formError` istnieje, pokaż `<p>`.

 Czyli jest to sposób na warunkowe renderowanie.

---

 # 53\. Operator `!`

```
!watchedMovies.includes(movie.id)
```

 `!` oznacza negację.

 Jeżeli:

```
watchedMovies.includes(movie.id)
```

 daje:

```
true
```

 to:

```
!true
```

 daje:

```
false
```

 Czyli:

 > film nie znajduje się na liście obejrzanych.

---

 # 54\. Najważniejszy przepływ danych

 Cała aplikacja działa mniej więcej tak:

```
                         App
                          |
                    przechowuje STATE
                          |
          ┌───────────────┴───────────────┐
          ↓                               ↓
        movies                         ratings
          |                               |
          └───────────────┬───────────────┘
                          ↓
                     MovieCard
                          |
                   użytkownik klika
                          |
                 ┌────────┴────────┐
                 ↓                 ↓
             onToggle            onRate
                 |                 |
                 └────────┬────────┘
                          ↓
                         App
                          |
                     zmiana state
                          |
                          ↓
                  ponowne renderowanie
```

 Najważniejsze:

 > `App` posiada stan, `MovieCard` otrzymuje dane przez propsy, a funkcje `onToggle` i `onRate` pozwalają dziecku poinformować rodzica o działaniach użytkownika.

---

 # 55\. Co to jest state?

 **State** to dane komponentu, które mogą się zmieniać.

 Przykłady w projekcie:

```
movies
watchedMovies
ratings
filter
title
year
genres
formError
```

 Zmiana state powoduje ponowne renderowanie komponentu.

---

 # 56\. Co to są propsy?

 **Props** to dane przekazywane z komponentu rodzica do komponentu dziecka.

 Tutaj:

```
App
 ↓
MovieCard
```

 Przykłady propsów:

```
title
year
genre
rating
watched
onToggle
onRate
```

---

 # 57\. Co to jest callback?

 Callback to funkcja przekazana do innej funkcji lub komponentu.

 Tutaj:

```
onToggle={() => toggleWatched(movie.id)}
```

 oraz:

```
onRate={(rating) => updateRating(movie.id, rating)}
```

 `MovieCard` może wywołać te funkcje, a wtedy zmieni się stan w `App`.

---

 # 58\. Controlled input

 Input jest kontrolowany przez Reacta, gdy jego wartość pochodzi ze state.

 Przykład:

```
<input
  value={title}
  onChange={(event) => setTitle(event.target.value)}
/>
```

 Schemat:

```
użytkownik wpisuje
       ↓
    onChange
       ↓
  setTitle(...)
       ↓
     state
       ↓
  React renderuje
```

---

 # 59\. Najczęstsze pytania na zaliczeniu

 ### Co robi `useState`?

 > `useState` pozwala przechowywać dane, które mogą zmieniać się podczas działania komponentu. Po zmianie stanu React ponownie renderuje komponent.

 ### Co robi `setTitle`?

 > Aktualizuje stan `title`.

 ### Co robi `map()`?

 > Przechodzi po elementach tablicy i tworzy na ich podstawie nową tablicę.

 ### Co robi `filter()`?

 > Tworzy nową tablicę zawierającą tylko elementy spełniające określony warunek.

 ### Co robi `includes()`?

 > Sprawdza, czy dana wartość znajduje się w tablicy. Zwraca `true` lub `false`.

 ### Co robi `join()`?

 > Łączy elementy tablicy w jeden tekst.

 ### Co oznacza `...`?

 > Jest to spread operator. Pozwala skopiować elementy tablicy lub właściwości obiektu.

 ### Co robi `preventDefault()`?

 > Blokuje domyślne zachowanie formularza, np. przeładowanie strony.

 ### Co robi `trim()`?

 > Usuwa spacje z początku i końca tekstu.

 ### Co robi `Number(year)`?

 > Zamienia tekst na liczbę.

 ### Co oznacza `?? 0`?

 > Jeżeli wartość po lewej stronie jest `null` lub `undefined`, używana jest wartość `0`.

 ### Co to są propsy?

 > Dane przekazywane z komponentu rodzica do komponentu dziecka.

 ### Co to jest `MovieCard`?

 > Jest to komponent odpowiedzialny za wyświetlanie pojedynczego filmu.

 ### Co robi `key`?

 > Pozwala Reactowi identyfikować elementy podczas renderowania listy.

 ### Co robi `onClick`?

 > Określa funkcję, która zostanie wykonana po kliknięciu.

 ### Co robi `onChange`?

 > Reaguje na zmianę wartości inputa.

 ### Co robi `onSubmit`?

 > Reaguje na wysłanie formularza.

 ### Co robi `required`?

 > Oznacza, że pole formularza jest wymagane.

 ### Co robi operator `? :`?

 > Jest to operator ternarny, który pozwala wybrać jedną z dwóch wartości w zależności od warunku.

 ### Co robi `&&` w JSX?

 > Pozwala warunkowo wyświetlić element.

---

 # 60\. Najważniejsze rzeczy do zapamiętania

 Jeżeli masz mało czasu, zapamiętaj te 10 rzeczy:

 1. **`useState`** — przechowuje zmienne dane.
2. **`set...`** — zmienia state.
3. **`map()`** — tworzy elementy na podstawie tablicy.
4. **`filter()`** — wybiera elementy spełniające warunek.
5. **`includes()`** — sprawdza, czy element znajduje się w tablicy.
6. **`...`** — kopiuje tablicę lub obiekt.
7. **Props** — dane przekazywane z rodzica do dziecka.
8. **Callback** — funkcja przekazana do komponentu.
9. **`onChange`** — reaguje na zmianę inputa.
10. **`onClick`** — reaguje na kliknięcie.

---

 # 61\. Odpowiedź o całym projekcie — wersja na zaliczenie

 > Jest to aplikacja React napisana w TypeScript do zarządzania listą filmów. Głównym komponentem jest `App`, który przechowuje stan aplikacji za pomocą `useState`. Przechowuję tam listę filmów, obejrzane filmy, oceny, filtr oraz dane formularza.
>
>  Filmy są początkowo pobierane z pliku JSON. Użytkownik może dodać nowy film za pomocą formularza. Dane z formularza są przechowywane w state, a po wysłaniu filmu dodaję do listy.
>
>  Lista filmów jest filtrowana za pomocą `filter()`. Do sprawdzania, czy film został obejrzany, używam `includes()`.
>
>  Każdy film jest wyświetlany przez komponent `MovieCard`. `App` przekazuje do niego dane przez propsy, takie jak tytuł, rok, gatunki, ocena i informacja, czy film został obejrzany.
>
>  `MovieCard` przekazuje natomiast informacje o kliknięciach do `App` za pomocą funkcji `onToggle` i `onRate`. Dzięki zmianie state React ponownie renderuje interfejs i pokazuje aktualne dane.

---

 # 62\. Jedno zdanie do zapamiętania

 > **App przechowuje stan aplikacji, przekazuje dane do MovieCard przez propsy, a MovieCard wyświetla film i używa callbacków, żeby poinformować App o działaniach użytkownika.**