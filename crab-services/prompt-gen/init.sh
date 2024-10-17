#!/bin/bash

# Install curl if it's not already available
if ! command -v curl &> /dev/null; then
    echo "Curl is not installed. Installing curl..."
    apt update && apt install -y curl
fi

# Start the ollama service with "serve" argument in the background
/bin/ollama serve &

# Wait for 5 seconds to give the service time to start
sleep 5

# Run the curl command to query localhost
curl -X POST http://localhost:11434/api/pull -d '{"name": "qwen2:0.5b"}'
tail -f /dev/null
