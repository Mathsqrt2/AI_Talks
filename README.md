# AI Talks

### 📚 About the Project

**AI Talks** is an application that facilitates conversations between two language models.
Each model receives a specialized prompt, guiding them to maintain dialogue
and intentionally drift into digressions, making conversations engaging and varied.

---

### 🚀 Getting Started

Follow these steps to get the project up and running locally:

#### 1. Clone the Repository

```bash
git clone https://github.com/Mathsqrt2/AI_Talks.git
```

#### 2. Environment Variable Configuration

The application includes default settings for basic functionality.
However, if you want Telegram integration to access conversations externally,
configure these optional variables in a [.env](.env.d.ts) file:

```env
TOKEN1=bot2_telegram_token       # Optional Telegram token for the first bot
TOKEN2=bot1_telegram_token       # Optional Telegram token for the second bot

PUBLIC_TELEGRAM_CHAT_ID=chat_id  # Optional public Telegram chat ID
GROUP_CHAT_ID=group_chat_id      # Optional Telegram group chat ID
```
**Note:** These values are optional, but without them, 
the application will not send any messages to Telegram.
At least one text channel and one bot are required for Telegram integration.
You can configure either one bot with one channel or two bots with two channels.
You can get these informations from [botFather](https://telegram.me/BotFather).

#### 3. Build Docker Container

Make sure Docker is installed, then run:

```bash
docker compose up -d
```

#### 4. Using the Application

Send an HTTP request using tools like **Postman** or **Insomnia**:

```http
POST http://localhost:13000/init/1
```

---

### 📄 Documentation

All available functionalities and system behavior are described in the [Swagger](https://swagger.io/) documentation.
It provides a user-friendly interface to explore and test API endpoints directly from the browser.
You can check available routes, required parameters, and expected responses.
The documentation is automatically generated and accessible at:

```http
GET http://localhost:13000/api
```

---

### 📄 Features

1. **Managing Four Services**  
   The application runs four essential services in Docker containers: **a MySQL database**, **an Ollama server** (for handling language models), **Adminer** (for viewing and managing the database), and **a NestJS application**, which serves as the core backend system.

2. **Remote Conversation Control**  
   The application exposes a REST API controller that allows remote management of conversations. Users can start, pause, resume, or terminate conversations at any time by sending appropriate HTTP requests.

3. **Settings Management**  
   The application provides a dedicated controller for managing various settings, including context length, bot names, message logging, Telegram message display, and other configurable parameters.

4. **Event-Driven Architecture**  
   The system operates based on events emitted within a single service. It broadcasts a "message" event, dynamically switches context, and ensures that the conversation remains coherent and uninterrupted.

5. **State Archiving and Recovery**  
   The application stores all its states in the database, allowing it to restore the last conversation state in case of a system failure or unexpected shutdown.

6. **Error Handling and Retry Mechanism**  
   If message generation or delivery fails, the application will attempt a predefined number of retries as specified in the settings. If all retries fail, it will save its state and gracefully terminate the conversation.

---

### 🛠️ Tech Stack

- [**NestJS**](https://nestjs.com/) – Node.js framework for scalable backend applications.
- [**TypeScript**](https://www.typescriptlang.org/) – Strongly-typed superset of JavaScript.
- [**MySQL**](https://www.mysql.com/) – Popular open-source relational database.
- [**TelegramBot API**](https://www.npmjs.com/package/node-telegram-bot-api) – API for integrating Telegram bot functionality.
- [**TypeORM**](https://typeorm.io/) – Powerful ORM for database interactions in Node.js applications.
- [**Docker**](https://www.docker.com/) – Tool for containerizing applications and their dependencies.

---

### 📌 License

This project is available under the MIT License. For more details, see the [LICENSE](LICENSE) file.