# Ollama Chatbot Interface

This project is a frontend chatbot interface using React and Next.js, designed to communicate with the Ollama API for generating AI responses. It supports conversational interactions and formats messages using markdown, including syntax highlighting for code blocks.

## Features

- **Chat Interface**: Allows users to send and receive messages in a chat-like interface.
- **AI Integration**: Communicates with the Ollama API for generating AI responses.
- **Markdown Support**: AI responses are formatted using markdown with code block syntax highlighting.
- **Error Handling**: Displays error messages when the AI service is unavailable or an error occurs.
- **Loading Indicator**: Shows a loading state when waiting for the AI to respond.

## Prerequisites

- Node.js (v14.x or later)
- Yarn or npm (package manager)
- Ollama API running locally on `http://localhost:11434`
- Download Ollama here `https://ollama.com/` 
- Edit file `src/pages/api/chat.ts` 
- Replace model at line *23* - `model: "gemma2:latest"` with your model

## Installation

1. Clone the repository:

``` git clone https://github.com/MisfitsDevelopment/Ollama-Chatbot-Interface.git ```
``` cd Ollama-Chatbot-Interface ```

2. Install the dependencies:

``` yarn install or npm install ```

3. Start the development server:

``` yarn dev or npm run dev ```


4. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Type a message in the input box and click "Send" to communicate with the AI.
- Responses will be shown in the chat interface.

## API

The chatbot uses the Ollama API to generate responses. Ensure that the Ollama API is running locally on `http://localhost:11434`. The chat messages are sent to the `/api/chat` endpoint, which handles the communication with the Ollama API.

## License

This project is licensed under the MIT License.
