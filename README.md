# AI Talks V2

Projekt przekierowuje prompty między dwoma modelami językowymi. Każdy z nich otrzymał prompta,
według, którego rozmawia z człowiekiem i ma za wszelką cenę potrzymywać konwersację i uciekać w dygresje.


```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Druga wersja opiera się na zduplikowanym serwisie, jednej aplikacji. 
Do uruchomienia potrzebna jest jedna komenda i wysłanie requesta.
W tej wersji możliwe jest wstrzymanie, lub zresetowanie rozmowy.

```bash
npm run start:talks
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