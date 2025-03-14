# AI Talks

## 📚 About the Project

**AI Talks** is an application that facilitates conversations between two language models.
Each model receives a specialized prompt, guiding them to maintain dialogue
and intentionally drift into digressions, making conversations engaging and varied.

## 🚀 Getting Started

Follow these steps to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Mathsqrt2/AI_Talks.git
```

### 2. Environment Variable Configuration

The application includes default settings for basic functionality.
However, if you want Telegram integration to access conversations externally,
configure these optional variables in a (.env)[.env.d.ts] file:

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
You can get these informations from (botFather)[https://telegram.me/BotFather].

### 3. Build Docker Container

Make sure Docker is installed, then run:

```bash
docker compose up -d
```

### 4. Using the Application

Send an HTTP request using tools like **Postman** or **Insomnia**:

```http
POST http://localhost:13000/init/1
```

## Documentation


```http
POST http://localhost:13000/api
```


## 🛠️ Tech Stack

- [**NestJS**](https://nestjs.com/) – Node.js framework for scalable backend applications.
- [**TypeScript**](https://www.typescriptlang.org/) – Strongly-typed superset of JavaScript.
- [**MySQL**](https://www.mysql.com/) – Popular open-source relational database.
- [**TelegramBot API**](https://www.npmjs.com/package/node-telegram-bot-api) – API for integrating Telegram bot functionality.
- [**TypeORM**](https://typeorm.io/) – Powerful ORM for database interactions in Node.js applications.
- [**Docker**](https://www.docker.com/) – Tool for containerizing applications and their dependencies.

## 📌 License

This project is available under the MIT License. For more details, see the [LICENSE](LICENSE) file.

