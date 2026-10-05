# Szczegółowa dokumentacja projektu

Ten dokument opisuje aktualny kod projektu, jego działanie i walidację danych.
Numery linii odnoszą się do plików w stanie na dzień utworzenia dokumentacji.
Puste linie pominięto w opisie. Jeśli kod zostanie zmieniony, numery mogą się
przesunąć.

## 1. `src/App.tsx` — główny komponent

### Importy i stan: linie 1–15

| Linia | Kod / element | Co robi i dlaczego jest potrzebny |
|---|---|---|
| 1 | `useState`, `SubmitEvent` | `useState` pozwala Reactowi zapamiętywać dane i odświeżać widok po ich zmianie. `SubmitEvent` opisuje typ zdarzenia wysłania formularza. |
| 2 | `MovieCard` | Importuje komponent pojedynczej karty filmu. Dzięki temu główna lista może wielokrotnie użyć tego samego komponentu. |
| 3 | `initialMovies` | Importuje początkowe dane filmów z lokalnego JSON. |
| 4 | `App.css` | Dołącza style aplikacji. |
| 5 | `Movie` | Importuje typ filmu, aby TypeScript sprawdzał zgodność danych. |
| 7 | `function App()` | Deklaruje główny komponent aplikacji. |
| 8 | `movies` | Lista filmów. Na początku dostaje dane z JSON; później może zostać uzupełniona przez formularz. |
| 9 | `watchedMovies` | Tablica ID filmów oznaczonych jako obejrzane. Przechowywane są ID, a nie kopie całych obiektów. |
| 10 | `ratings` | Obiekt ocen. Klucz to ID filmu, wartość to liczba gwiazdek. |
| 11 | `filter` | Wybrany filtr: `"all"`, `"watched"` lub `"unwatched"`. |
| 12 | `title` | Tekst wpisany w polu tytułu. |
| 13 | `year` | Tekst wpisany w polu roku. Input HTML zwraca tekst; konwersja na liczbę następuje przy zapisie filmu. |
| 14 | `genres` | Tablica tekstów wpisanych w pola gatunków. Początkowo zawiera jedno puste pole. |
| 15 | `formError` | Tekst własnego komunikatu walidacyjnego. Pusty tekst oznacza brak błędu. |

`useState` zwraca parę: aktualną wartość i funkcję do jej zmiany. Gdy setter
zmieni stan, React ponownie renderuje komponent.

### Zmiana statusu obejrzenia: linie 17–23

| Linia | Co robi |
|---|---|
| 17 | Definiuje `toggleWatched`; funkcja otrzymuje ID klikniętego filmu. |
| 18 | Sprawdza przez `includes`, czy film już jest oznaczony jako obejrzany. |
| 19 | Jeśli jest, tworzy nową tablicę bez tego ID. `filter` nie zmienia starej tablicy. |
| 20–22 | Jeśli filmu nie ma w tablicy, dodaje jego ID na końcu. Funkcyjna forma settera korzysta z najnowszego stanu. |
| 23 | Kończy funkcję. |

### Dodawanie filmu i walidacja: linie 25–52

| Linia | Co robi i dlaczego |
|---|---|
| 25 | Definiuje obsługę wysłania formularza. Typ `SubmitEvent<HTMLFormElement>` mówi TypeScriptowi, że zdarzenie pochodzi z formularza HTML. |
| 26 | `preventDefault()` blokuje domyślne wysłanie formularza, które przeładowałoby stronę. |
| 28 | `trim()` usuwa spacje z początku i końca tytułu. |
| 29 | `map()` czyści spacje w każdym gatunku, a `filter(Boolean)` usuwa puste teksty. Wynikiem jest tablica gotowa do zapisania. |
| 31 | Waliduje tytuł po `trim()` oraz sprawdza, czy pozostał co najmniej jeden niepusty gatunek. |
| 32 | Ustawia komunikat, gdy walidacja nie przejdzie. |
| 33 | `return` przerywa dodawanie — niepoprawny film nie trafia do listy. |
| 36 | Aktualizuje `movies` na podstawie poprzedniej wartości stanu. |
| 37 | Wyznacza kolejne ID: największe istniejące ID (albo 0 dla pustej listy) plus 1. |
| 38–46 | Tworzy nową tablicę, zachowując poprzednie filmy i dopisując nowy obiekt. |
| 40–45 | Nowy film zawiera `id`, `title`, `year` i `genre`, zgodnie z typem `Movie`. |
| 43 | `Number(year)` zamienia tekst z inputa na liczbę. Input ma walidację przeglądarki opisaną niżej. |
| 44 | Zapisuje gatunki jako `string[]`, a nie pojedynczy tekst. |
| 48–50 | Czyści pola formularza po udanym dodaniu. Tablica gatunków wraca do jednego pustego pola. |
| 51 | Usuwa ewentualny komunikat błędu po poprawnym dodaniu. |
| 52 | Kończy funkcję obsługi formularza. |

### Ocena i reset postępu: linie 54–61

| Linia | Co robi |
|---|---|
| 54 | Definiuje funkcję zapisu oceny dla konkretnego filmu. |
| 55 | Zachowuje pozostałe oceny i aktualizuje ocenę pod kluczem ID tego filmu. |
| 58 | Definiuje funkcję przycisku „Wyczyść wszystkie”. |
| 59 | Czyści tablicę obejrzanych ID, więc wszystkie filmy stają się nieobejrzane. |
| 60 | Czyści obiekt ocen, więc żaden film nie ma już zapisanej oceny. |
| 61 | Kończy funkcję. Filmy pozostają w `movies`; przycisk resetuje postęp, a nie usuwa listę. |

### Filtrowanie: linie 63–73

| Linia | Co robi |
|---|---|
| 63 | Tworzy `filteredMovies` przez `.filter()`. Ta zmienna jest używana do renderowania listy. |
| 64–66 | Dla filtra `"watched"` zostawia tylko filmy z ID w `watchedMovies`. |
| 68–70 | Dla filtra `"unwatched"` zostawia filmy, których ID nie ma w `watchedMovies`. |
| 72 | Dla `"all"` zwraca `true`, czyli nie odrzuca filmu. |
| 73 | Kończy filtrowanie. |

### Nagłówek i licznik: linie 75–81

| Linia | Co robi |
|---|---|
| 75 | Rozpoczyna JSX — składnię opisu elementów interfejsu w komponencie React. |
| 76 | Tworzy główny element strony z klasą CSS `app`. |
| 77 | Wyświetla tytuł aplikacji. |
| 79–81 | Pokazuje licznik `liczba obejrzanych / liczba wszystkich`. Licznik obejrzanych pochodzi z długości `watchedMovies`, a wszystkich — z `movies`. |

### Formularz: linie 83–155

| Linia | Co robi i waliduje |
|---|---|
| 83 | Formularz HTML wywołuje `addMovie` przy wysłaniu. |
| 84 | Nagłówek formularza. |
| 86–97 | Etykieta i input tytułu. `value` łączy input ze stanem; `onChange` aktualizuje stan. `required` blokuje wysłanie pustej wartości w przeglądarce. |
| 91–94 | Przy wpisywaniu aktualizuje tytuł i usuwa wcześniejszy komunikat błędu. |
| 99–109 | Pole roku. Typ `number` ogranicza wprowadzanie do wartości liczbowej; `min="1888"` ustawia najniższy dozwolony rok, `step="1"` wymaga całkowitej wartości, a `required` wymaga podania roku. |
| 105–106 | Wartość roku jest kontrolowana przez stan `year`; zmiana inputa aktualizuje stan. |
| 111–112 | `fieldset` i `legend` grupują pola gatunków i nadają im opis. |
| 113 | `.map()` tworzy wiersz inputa dla każdego elementu stanu `genres`. |
| 114 | `key={index}` daje Reactowi klucz dla każdego wiersza. Tu użyty jest indeks, bo pola można dynamicznie dodawać i usuwać. |
| 115–118 | Input gatunku pokazuje odpowiedni tekst ze stanu. `aria-label` nadaje mu nazwę dla czytników ekranu. |
| 119–124 | Po zmianie tworzy kopię tablicy gatunków, aktualizuje wpisany indeks, zapisuje tablicę w stanie i czyści błąd. |
| 125 | `required` wymaga wypełnienia tego pola. Jeśli użytkownik doda kolejne pole, ono również jest wymagane, dopóki nie zostanie usunięte. |
| 127–138 | Dla pól od drugiego wzwyż pokazuje przycisk `−`. Kliknięcie usuwa wybrany indeks przez `filter`. Pierwsze pole nie może być usunięte. |
| 139–149 | Tylko ostatni wiersz ma przycisk `+`. Kliknięcie dopisuje nowy pusty gatunek do stanu, co powoduje pojawienie się nowego inputa. |
| 153 | Własny błąd jest renderowany tylko wtedy, gdy `formError` nie jest pusty. `role="alert"` informuje technologie asystujące o komunikacie. |
| 154 | Przycisk `submit` wysyła formularz. |
| 155 | Kończy formularz. |

### Filtry i reset: linie 157–177

| Linia | Co robi |
|---|---|
| 157 | Kontener przycisków sterujących listą. |
| 158–160 | Ustawia filtr `"all"` — pokaż wszystkie filmy. |
| 162–164 | Ustawia filtr `"watched"` — pokaż obejrzane filmy. |
| 166–168 | Ustawia filtr `"unwatched"` — pokaż nieobejrzane filmy. |
| 170–176 | Przycisk resetu. `type="button"` zapobiega przypadkowemu wysłaniu formularza. `onClick` uruchamia `resetMovieProgress`. |
| 171 | Klasa służy do osobnego stylowania przycisku w CSS. |
| 175 | Tekst widoczny na przycisku. Pomimo nazwy przycisk nie usuwa filmów. |
| 177 | Kończy kontener filtrów. |

### Karty oraz pusty wynik: linie 179–201

| Linia | Co robi |
|---|---|
| 179 | Kontener listy filmów. |
| 180 | `.map()` tworzy widok dla każdego elementu `filteredMovies`. |
| 181 | Tworzy `MovieCard`. |
| 182 | `key={movie.id}` daje Reactowi stabilny identyfikator karty w liście. |
| 183–185 | Przekazuje do karty tytuł, rok i tablicę gatunków. |
| 186 | Przekazuje ocenę; `?? 0` oznacza, że brak wpisu w `ratings` jest traktowany jako brak oceny. |
| 187 | Przekazuje informację, czy ID filmu jest w `watchedMovies`. |
| 188 | Przekazuje funkcję zmiany statusu. |
| 189 | Przekazuje funkcję zapisu oceny. |
| 190–192 | Kończą kartę, `.map()` i kontener listy. |
| 194–196 | Jeżeli filtr nie zwrócił filmów, wyświetla komunikat „Brak filmów do wyświetlenia”. |
| 197–199 | Kończą element główny, JSX i funkcję komponentu. |
| 201 | Eksportuje `App`, aby można go było zaimportować w `main.tsx`. |

## 2. Walidacja formularza — dokładnie co jest sprawdzane

1. **Tytuł jest wymagany przez HTML** — `required` na linii 95.
2. **Tytuł nie może składać się wyłącznie ze spacji** — `trim()` w linii 28 i
   warunek w linii 31 wykrywają pusty tytuł po usunięciu spacji.
3. **Rok jest wymagany** — `required` na linii 107.
4. **Rok ma być liczbą całkowitą nie mniejszą niż 1888** — `type="number"`,
   `min="1888"` i `step="1"` w liniach 101–104. Walidację wykonuje przeglądarka.
5. **Co najmniej jeden gatunek musi być niepusty** — `trim()` i `filter(Boolean)`
   w linii 29 usuwają puste gatunki; warunek w linii 31 odrzuca brak gatunków.
6. **Każde widoczne pole gatunku jest wymagane przez HTML** — `required` w linii
   125. Dodane, ale niewypełnione pole trzeba wypełnić lub usunąć przyciskiem `−`.
7. **Puste lub składające się ze spacji gatunki nie są zapisywane** — czyszczenie
   z linii 29.

Walidacja nie sprawdza, czy rok jest wcześniejszy od bieżącego roku, czy tytuł
jest unikalny, czy gatunki się powtarzają ani czy wpis ma maksymalną długość.
Takich reguł nie ma w wymaganiach. Atrybuty HTML zapewniają walidację w
przeglądarce; nie jest to walidacja serwerowa.

## 3. `src/components/MovieCard.tsx` — pojedynczy film

| Linia | Co robi i dlaczego |
|---|---|
| 1–9 | `MovieCardProps` określa dane i funkcje otrzymywane przez kartę. `genre` jest `string[]`, `rating` liczbą, `watched` wartością logiczną. Funkcje callback nie zwracają wartości. |
| 11 | Komponent odbiera wszystkie dane przez props. |
| 12 | Rozpoczyna zwracany JSX. |
| 13 | Ustawia klasę `movie-card`; dopisuje `watched`, jeśli film obejrzano, aby CSS mógł wyróżnić kartę. |
| 14 | Wyświetla tytuł. |
| 15 | Wyświetla rok. |
| 16 | `join(", ")` łączy wiele gatunków w jeden czytelny tekst. |
| 18–19 | Tworzy sekcję oceny z etykietą. |
| 20 | Grupuje przyciski ocen i zapewnia grupie dostępną nazwę. |
| 21 | Tworzy pięć przycisków przez `.map()`, po jednym dla każdej oceny 1–5. |
| 22–31 | Renderuje pojedynczą gwiazdkę. |
| 23 | Dodaje klasę `selected`, gdy wartość gwiazdki jest nie większa niż aktualna ocena. |
| 24 | `type="button"` zapobiega wysłaniu formularza, jeśli komponent znalazłby się wewnątrz formularza. |
| 25 | Klucz Reacta dla elementu listy gwiazdek. |
| 26 | `aria-label` opisuje przycisk czytnikowi ekranu, podając film i liczbę gwiazdek. |
| 27 | `aria-pressed` komunikuje, czy ta konkretna ocena jest zaznaczona. |
| 28 | Po kliknięciu przekazuje wybraną wartość do `App` przez `onRate`. |
| 30 | Wyświetla pełną gwiazdkę, jeśli jej wartość mieści się w ocenie; w przeciwnym razie pustą. |
| 34 | Pokazuje `n/5` lub tekst „Brak oceny”. |
| 37–39 | Przycisk obejrzenia wywołuje `onToggle`; tekst zależy od `watched`. |
| 40–42 | Kończy element karty i komponent. |
| 44 | Eksportuje `MovieCard`. |

## 4. `src/types.ts` — typ filmu

| Linia | Znaczenie |
|---|---|
| 1 | Eksportuje deklarację typu `Movie`. |
| 2 | `id` jest liczbą i identyfikuje film. |
| 3 | `title` jest tekstem. |
| 4 | `year` jest liczbą. |
| 5 | `genre` jest tablicą tekstów; jeden film może mieć kilka gatunków. |
| 6 | Kończy definicję typu. |

Typ jest używany w stanie `movies`, żeby TypeScript zgłaszał błąd, jeśli
do listy trafi obiekt o niezgodnym kształcie.

## 5. `src/data/movies.json` — początkowe dane

| Linia / fragment | Znaczenie |
|---|---|
| 1 | Rozpoczyna tablicę filmów JSON. |
| 2–7 | Pierwszy film: ID 1, tytuł, rok i tablica gatunków. |
| 8–13 | Drugi film: ID 2 i jego dane. |
| 14–19 | Trzeci film: ID 3 i jego dane. |
| 20–25 | Czwarty film. Ma dwa gatunki: „Dramat” i „Biograficzny”. |
| 26–31 | Piąty film. |
| 32–37 | Szósty film. |
| 38–43 | Siódmy film. |
| 44–49 | Ósmy film. |
| 50 | Kończy tablicę JSON. |

Każdy element tablicy ma taki sam kształt, jaki opisuje typ `Movie`.
Identyfikatory początkowych filmów są unikalne.

## 6. `src/main.tsx` — uruchomienie Reacta

| Linia | Znaczenie |
|---|---|
| 1 | Importuje `StrictMode`, który pomaga wykrywać problemy w trybie developerskim. |
| 2 | Importuje `createRoot`, funkcję montującą aplikację React w HTML. |
| 3 | Importuje główny komponent `App`. |
| 5 | Znajduje element HTML o ID `root` i tworzy korzeń Reacta. `!` informuje TypeScript, że element istnieje. |
| 6–8 | Renderuje `App` wewnątrz `StrictMode`. |
| 9 | Kończy wywołanie renderowania. |

## 7. `index.html` — strona startowa

| Linia | Znaczenie |
|---|---|
| 1 | Deklaruje dokument HTML5. |
| 2 | Ustawia polski jako język strony. |
| 4 | Ustawia kodowanie UTF-8, potrzebne m.in. dla polskich znaków. |
| 5 | Wskazuje ikonę strony. |
| 6 | Ustawia stronę tak, aby poprawnie działała na różnych szerokościach ekranu. |
| 7 | Ustawia tytuł widoczny na karcie przeglądarki. |
| 10 | Element `root`, w którym React wyświetla aplikację. |
| 11 | Ładuje punkt startowy `src/main.tsx`. |

## 8. `src/App.css` — style

CSS opisuje wygląd, nie zmienia danych ani funkcjonalności. Najważniejsze
sekcje:

| Linie | Znaczenie |
|---|---|
| 1–6 | Podstawowe ustawienia strony: margines, tło, kolor tekstu i font. |
| 8–12 | Maksymalna szerokość aplikacji, wyśrodkowanie i odstępy od krawędzi. |
| 14–31 | Duży tytuł oraz dekoracyjna bursztynowa kropka dodana przez `::after`. |
| 33–38 | Wygląd licznika obejrzanych filmów. |
| 40–56 | Formularz jako siatka; nagłówek, gatunki i błąd rozciągają się na szerokość formularza. |
| 58–82 | Nagłówek, etykiety i pola formularza. |
| 84–105 | Układ dynamicznych pól gatunków i przycisków obok nich. |
| 107–110 | Kolor komunikatu walidacyjnego. |
| 112–146 | Ogólny wygląd przycisków, przycisku dodawania oraz usuwania gatunku. |
| 148–168 | Układ i wygląd przycisków filtrowania. |
| 170–184 | Wygląd przycisku resetu. Selektor `:disabled` zadziała tylko wtedy, gdy element ma atrybut `disabled`. |
| 186–190 | Układa karty w trzy kolumny z odstępem. |
| 192–222 | Tło i obramowanie karty, kolorowy pasek na jej górze oraz wygląd filmu obejrzanego. |
| 224–235 | Wygląd tytułu i szczegółów filmu. |
| 237–266 | Układ i wygląd oceny oraz gwiazdek. |
| 268–272 | Widoczny obrys fokusu dla klawiatury. |
| 274–288 | Przy szerokości do 800 pikseli lista ma dwie kolumny; formularz zmienia układ. |
| 290–310 | Przy szerokości do 560 pikseli formularz i filmy przechodzą do jednej kolumny. |

## 9. Stan i ograniczenia aplikacji

- Filmy, oceny i statusy są przechowywane w `useState`, czyli tylko w pamięci
  działającej aplikacji. Odświeżenie strony przywraca filmy z JSON i resetuje
  pozostałe zmiany.
- Nie ma zapisu do pliku JSON, localStorage ani serwera.
- Filmy można dodawać, ale interfejs nie ma funkcji usuwania pojedynczego filmu.
- „Wyczyść wszystkie” oznacza reset obejrzenia i ocen, a nie skasowanie filmów.
- Oceny i lista obejrzanych filmów są trzymane osobno od obiektów filmów; są
  powiązane z filmami po ich `id`.

## 10. Polecenia npm

W `package.json` zdefiniowano:

- `npm run dev` — uruchamia serwer developerski Vite.
- `npm run build` — sprawdza projekt TypeScriptem, a potem buduje pliki strony.
- `npm run lint` — uruchamia Oxlint.
- `npm run preview` — uruchamia podgląd gotowego buildu.
