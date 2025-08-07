#!/bin/bash
set -e

MODEL="$1"
echo "Building models with base: $MODEL"

ollama serve &
SERVE_PID=$!

while ! ollama list | grep -q 'NAME'; do
  sleep 1
done

declare -A FILES
FILES=(
  [speaker1]="/build/modelfiles/speaker.config.modelfile"
  [speaker2]="/build/modelfiles/speaker.config.modelfile"
  [summarizer]="/build/modelfiles/summarizer.config.modelfile"
  [injector]="/build/modelfiles/injector.config.modelfile"
)


for ROLE in speaker1 speaker2 summarizer injector; do
  FILE="${FILES[$ROLE]}"
  TMPFILE=$(mktemp)
  echo "FROM ${MODEL}" > "$TMPFILE"
  tail -n +2 "$FILE" >> "$TMPFILE"
  ollama create "${MODEL}_${ROLE}" -f "$TMPFILE"
  rm "$TMPFILE"
done

kill $SERVE_PID