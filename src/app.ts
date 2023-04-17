import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { addUser } from "./database/addUser";
import express from "express";
import cors from "cors";

const port = "55353";
const app = express();

app.use(express.json())
app.use(cors())

const db_url = "127.0.0.1:27017";
const db_name = "trackme_db";

const web_app_url = "https://google.com/";

const token = "";
const bot = new TelegramBot(token, { polling: true });

const db_client = new MongoClient(`mongodb://${db_url}/`);

db_client.connect().then((db_con) => {
  console.log("[Bot and MongoDB] Started!");
  bot.onText(/\/start/, async (msg) => {
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
