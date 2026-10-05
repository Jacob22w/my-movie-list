# Moja lista filmów

Prosta aplikacja React + TypeScript do przeglądania i prowadzenia listy filmów.
Dane początkowe są w pliku JSON. Można dodawać filmy, wybierać kilka gatunków,
oznaczać filmy jako obejrzane, filtrować listę i przyznawać oceny od 1 do 5.

## Uruchomienie

```bash
npm install
npm run dev
```

Przydatne polecenia:

- `npm run build` — sprawdza typy TypeScript i buduje aplikację.
- `npm run lint` — uruchamia Oxlint.
- `npm run preview` — podgląd zbudowanej aplikacji.

## Pliki projektu

- `src/main.tsx` — uruchamia React i renderuje komponent `App`.
- `src/App.tsx` — główna logika, stan aplikacji, formularz, filtry i lista.
- `src/components/MovieCard.tsx` — pokazuje szczegóły jednego filmu oraz jego  ocenę i status obejrzenia.
- `src/types.ts` — typ TypeScript opisujący film.
- `src/data/movies.json` — początkowa lista filmów.
- `src/App.css` — style strony, kart, formularza i przycisków.
- `index.html` — dokument HTML, który zawiera element, w którym React renderuje
  aplikację.

## Dane filmu

Każdy film ma identyfikator, tytuł, rok i tablicę gatunków:

```json
{
  "id": 1,
  "title": "Przykładowy film",
  "year": 2024,
  "genre": ["Dramat", "Biograficzny"]
}
```

Pole `genre` jest tablicą tekstów (`string[]`), dlatego film może należeć do
więcej niż jednego gatunku. Ten sam format jest używany w JSON, typie `Movie`
i formularzu.

## Jak działa aplikacja

### Główny komponent `App`

`App` importuje początkowe filmy z `movies.json` i przechowuje je w stanie Reacta.
Stan jest używany, ponieważ dodanie filmu lub zmiana oceny/statusu ma od razu
odświeżyć widok.

Główne wartości stanu:

- `movies` — wszystkie filmy, początkowo z JSON.
- `watchedMovies` — identyfikatory filmów oznaczonych jako obejrzane.
- `ratings` — oceny zapisane pod identyfikatorami filmów.
- `filter` — wybrany widok: wszystkie, obejrzane albo nieobejrzane.
- `title`, `year`, `genres` — aktualne wartości pól formularza.
- `formError` — komunikat o brakującym tytule lub gatunku.

### Oznaczanie jako obejrzany

Funkcja `toggleWatched` dostaje ID filmu. Jeżeli ID znajduje się już w
`watchedMovies`, usuwa je. W przeciwnym razie dodaje je do tablicy.
`MovieCard` otrzymuje status oraz tę funkcję przez props.

### Licznik i filtrowanie

Licznik pokazuje liczbę ID w `watchedMovies` oraz całkowitą liczbę filmów.
`filteredMovies` tworzy listę do wyświetlenia przy użyciu `.filter()`:

- `all` — pokazuje wszystkie filmy;
- `watched` — pokazuje ID znajdujące się w `watchedMovies`;
- `unwatched` — pokazuje pozostałe filmy.

Lista kart jest renderowana przez `.map()`. Każda karta ma `key={movie.id}`,
żeby React mógł rozróżniać elementy listy.

### Dodawanie filmu

Formularz wywołuje `addMovie` przy wysłaniu. Funkcja:

1. Zapobiega domyślnemu przeładowaniu strony.
2. Usuwa zbędne spacje z tytułu i gatunków.
3. Pomija puste gatunki i sprawdza, czy podano tytuł oraz co najmniej jeden
   gatunek.
4. Wyznacza nowe ID na podstawie największego ID na liście.
5. Dodaje film do stanu `movies`.
6. Czyści pola formularza.

Pola tytułu, roku i gatunków są kontrolowane przez React: ich `value` pochodzi
ze stanu, a `onChange` aktualizuje stan.

Przycisk `+` dopisuje kolejne puste pole do `genres`. Przy każdym polu gatunku
wyświetla się przycisk `−` (poza pierwszym), który usuwa dane pole. Przy
wysłaniu formularza gatunki są zbierane w tablicę `string[]`.

### Oceny

`ratings` przechowuje ocenę jako liczbę 1–5 pod ID filmu. `MovieCard` wyświetla
pięć przycisków. Kliknięcie gwiazdki wywołuje `onRate`, a `App` zapisuje ocenę.
Nieoceniony film ma ocenę `0` w widoku i pokazuje „Brak oceny”.

### Reset statusów i ocen

Przycisk „Wyczyść wszystkie” wywołuje `resetMovieProgress`. Funkcja czyści
`watchedMovies` i `ratings`. Nie usuwa filmów — po kliknięciu wszystkie są
nieobejrzane i nie mają ocen.

### Komunikat o braku filmów

Jeżeli aktywny filtr nie zwraca żadnego wyniku, aplikacja wyświetla komunikat
„Brak filmów do wyświetlenia”.

## Komponent `MovieCard`

Komponent dostaje dane filmu oraz jego stan przez props:

- `title`, `year`, `genre` — dane wyświetlane na karcie;
- `watched` — informacja, czy film obejrzano;
- `rating` — ocena od 0 do 5, gdzie 0 oznacza brak oceny;
- `onToggle` — funkcja wywoływana przy zmianie statusu;
- `onRate` — funkcja wywoływana po wybraniu oceny.

`genre.join(", ")` zamienia tablicę gatunków na czytelny tekst. Status
`watched` dodaje klasę CSS, dzięki której obejrzana karta może wyglądać inaczej.

## Typ `FormEvent`

`FormEvent<HTMLFormElement>` określa typ zdarzenia wysłania formularza:

```tsx
const addMovie = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};
```

`FormEvent` to typ zdarzenia formularza Reacta. Nie należy mylić go z
`FormEventHandler` — w zainstalowanych typach Reacta ten drugi jest oznaczony
jako przestarzały. Jeśli edytor przekreśla `FormEvent`, warto sprawdzić import
z `react` i uruchomić w VS Code polecenie „TypeScript: Restart TS Server”.

## Ważna informacja o zapisie

Nowe filmy, statusy obejrzenia i oceny istnieją w stanie aplikacji tylko
podczas bieżącego uruchomienia. Nie są zapisywane w JSON ani w przeglądarce.
Po odświeżeniu strony lista wróci do danych z `src/data/movies.json`.
