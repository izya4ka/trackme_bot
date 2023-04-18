import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { addUser } from "./database/addUser";
import express from "express";
import cors from "cors";
require('dotenv').config();


const port = "55353";
const app = express();

app.use(express.json())
app.use(cors())

const db_url = process.env.MONGODB_URL;
const db_name = process.env.MONGODB_DATABASE;
const db_user = process.env.MONGODB_USER
const db_password = process.env.MONGODB_PASSWORD

const web_app_url = process.env.WEB_APP_URL || ""

const token = process.env.TELEGRAM_TOKEN || ""

const bot = new TelegramBot(token, { polling: true });

const db_client = new MongoClient(`mongodb://${db_user}:${db_password}@${db_url}/${db_name}`);

db_client.connect().then((db_con) => {
  console.log("[Bot and MongoDB] Started!");
  bot.onText(/\/start/m, async (msg) => {
    const chat_id = msg.chat.id;
    const user_id = msg.from?.id;

    if (user_id === undefined) return 1;
    try {
      await addUser(db_con, user_id);
      console.log("Added user with ID: " + user_id);
    } catch (err) {
      console.log(err);
    }
    await bot.sendMessage(chat_id, "Выберите опцию", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Редактировать треки", web_app: { url: web_app_url } }],
        ],
      },
    });
  });
  
  app.listen(port, () => console.log("[Express] Started!"));
});
