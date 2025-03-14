ollama serve &
SERVE_PID=$!

while ! ollama list | grep -q 'NAME'; do
  sleep 1
done

ollama create gemma3.4b_speaker1 -f  /build/modelfiles/speaker.config.modelfile
ollama create gemma3.4b_speaker2 -f  /build/modelfiles/speaker.config.modelfile
ollama create gemma3.4b_summarizer -f /build/modelfiles/summarizer.config.modelfile
ollama create gemma3.4b_injector -f /build/modelfiles/injector.config.modelfile

kill $SERVE_PID