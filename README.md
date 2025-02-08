# AI Talks V3 (W przygotowaniu)

Projekt przekierowuje prompty między dwoma modelami językowymi. Każdy z nich otrzymał prompta,
według, którego rozmawia z człowiekiem i ma za wszelką cenę potrzymywać konwersację i uciekać w dygresje.

```bash
docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
```

Trzecia wersja ma pozwolić na wstrzyknięcie treści do rozmowy (w celu moderacji, lub zabarwienia wątku),
oraz pozwalać na dynamiczne zarządzanie kontekstem. Cała aplikacja będzie osadzona w jednym serwisie.
...

```bash
npm run start:conversation
```