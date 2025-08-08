MODEL="$1"
echo "Pulling model: $MODEL"

ollama serve &
SERVE_PID=$!

while ! ollama list | grep -q 'NAME'; do
  sleep 1
done

echo ${MODEL} >> model.diag.txt

ollama pull ${MODEL}

kill $SERVE_PID
wait $SERVE_PID
