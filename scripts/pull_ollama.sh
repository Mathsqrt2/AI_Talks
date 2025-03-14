ollama serve &
SERVE_PID=$!

while ! ollama list | grep -q 'NAME'; do
  sleep 1
done

ollama pull gemma3:4b

kill $SERVE_PID
