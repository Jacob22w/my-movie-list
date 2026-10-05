# Moja lista filmów

Aplikacja React + TypeScript do prowadzenia listy filmów. Umożliwia filtrowanie
filmów według statusu obejrzenia, oznaczanie ich jako obejrzane, ocenianie
w skali od 1 do 5 gwiazdek oraz dodawanie nowych pozycji.

## Dane filmu

Filmy początkowe znajdują się w `src/data/movies.json`. Każdy film ma
identyfikator, tytuł, rok wydania i tablicę gatunków, np.:

```json
{
  "id": 1,
  "title": "Przykładowy film",
  "year": 2024,
  "genre": ["Dramat", "Biograficzny"]
}
```

Nowe filmy można dodać za pomocą formularza nad listą. Przycisk `+` dodaje
kolejne pole gatunku. Oceny, status obejrzenia i nowe filmy są przechowywane
w stanie aplikacji podczas bieżącej sesji.

## Uruchamianie

- `npm install` — instalacja zależności
- `npm run dev` — uruchomienie serwera deweloperskiego
- `npm run build` — sprawdzenie typów i zbudowanie aplikacji
- `npm run lint` — uruchomienie lintera
