ollama serve &
SERVE_PID=$!

while ! ollama list | grep -q 'NAME'; do
  sleep 1
done

ollama pull gemma2:9b

kill $SERVE_PID
