#!/bin/bash
set -e

export $(grep -v '^#' .env | xargs)

ollama serve &
SERVE_PID=$!

while ! ollama list | grep -q 'NAME'; do
  sleep 1
done

for ROLE in speaker1 speaker2 summarizer injector; do
  FILE="/build/modelfiles/${ROLE}.config.modelfile"
  TMPFILE=$(mktemp)
  echo "FROM ${MODEL}" > "$TMPFILE"
  tail -n +2 "$FILE" >> "$TMPFILE"
  ollama create "${MODEL}_${ROLE}" -f "$TMPFILE"
  rm "$TMPFILE"
done

kill $SERVE_PID