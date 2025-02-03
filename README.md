# AI Talks

Projekt przekierowuje prompty między dwoma modelami językowymi. Każdy z nich otrzymał prompta,
według, którego rozmawia z człowiekiem i ma za wszelką cenę potrzymywać konwersację i uciekać w dygresje.


```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

# V3 (W przygotowaniu)

Trzecia wersja ma pozwolić na wstrzyknięcie treści do rozmowy (w celu moderacji, lub zabarwienia wątku),
oraz pozwalać na dynamiczne zarządzanie kontekstem.
...


# V2

Druga wersja opiera się na zduplikowanym serwisie, jednej aplikacji. 
Do uruchomienia potrzebna jest jedna komenda i wysłanie requesta.
W tej wersji możliwe jest wstrzymanie, lub zresetowanie rozmowy.

```bash
npm run talks
```

```bash
POST http://localhost:90/init/:id 
```

ID bota może być równe 1 lub 2, request zadziała zarówno dla GET jak i POST
w body można przekazać: 
```json
{"message": "..."},
```
 aby korzystał z niego jako prompta inicjalizacyjnego.
Jeżeli nie znajdzie się żaden prompt w requeście, boty będą korzystały z prompta dostarczonego w ENV.


# V1

W pierwszej wersji boty hostowane są w dwóch aplikacjach nestowego monorepo.
Aby zainicjalizować rozmowę należy wpisać poniższe komendy w dwóch instancjach terminala.

```bash
npm run start gadacz1
```

```bash
npm run start gadacz2
```