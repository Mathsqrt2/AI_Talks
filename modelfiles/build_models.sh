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
  [en_speaker1]="/build/modelfiles/en.speaker.config.modelfile"
  [en_speaker2]="/build/modelfiles/en.speaker.config.modelfile"
  [en_summarizer]="/build/modelfiles/en.summarizer.config.modelfile"
  [en_injector]="/build/modelfiles/en.injector.config.modelfile"
  [pl_speaker1]="/build/modelfiles/pl.speaker.config.modelfile"
  [pl_speaker2]="/build/modelfiles/pl.speaker.config.modelfile"
  [pl_summarizer]="/build/modelfiles/pl.summarizer.config.modelfile"
  [pl_injector]="/build/modelfiles/pl.injector.config.modelfile"
)

for LANGUAGE in pl en; do
  for ROLE in speaker1 speaker2 summarizer injector; do
    KEY="${LANGUAGE}_${ROLE}"
    FILE="${FILES[$KEY]}"

    if [[ ! -f "$FILE" ]]; then
      echo "File not found: $FILE"
      exit 1
    fi
    TMPFILE=$(mktemp)
    echo "FROM ${MODEL}" > "$TMPFILE"
    tail -n +2 "$FILE" >> "$TMPFILE"
    ollama create "${LANGUAGE}_${MODEL}_${ROLE}" -f "$TMPFILE"
    rm "$TMPFILE"
  done
done

kill $SERVE_PID
wait $SERVE_PID