import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { addUser } from "./database/addUser";
import express from "express";
import cors from "cors";
import checkTracks from "./util/checkTracks";
require("dotenv").config();

const port = "55353";
const app = express();
app.use(express.json());
app.use(cors());

const db_url = process.env.MONGODB_URL;
const db_name = process.env.MONGODB_DATABASE;
const db_user = process.env.MONGODB_USER;
const db_password = process.env.MONGODB_PASSWORD;

const web_app_url = process.env.WEB_APP_URL || "";

const token = process.env.TELEGRAM_TOKEN || "";
const bot = new TelegramBot(token, { polling: true });

const track_regex = /^([a-zA-Z]{2}\d{9}[a-zA-Z]{2})$|^(\d{13,14})$/gm;

const send_opts = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Редактировать треки", web_app: { url: web_app_url } }],
    ],
  },
};

const db_client = new MongoClient(
  `mongodb://${db_user}:${db_password}@${db_url}/${db_name}`
);

db_client.connect().then((db_con) => {
  console.log("[Bot and MongoDB] Started!");

  bot.onText(
    /^[Мм]еню$/,
    async (msg) =>
      await bot.sendMessage(msg.chat.id, "Выберите опцию", send_opts)
  );
  bot.onText(/^\/start$/, async (msg) => {
    const chat_id = msg.chat.id;
    const user_id = msg.from?.id;

    if (user_id === undefined) return 1;

    try {
      await addUser(db_con, user_id);
      console.log("Added user with ID: " + user_id);
    } catch (err) {
      console.log(err);
    }

    await bot.sendMessage(chat_id, "Выберите опцию", send_opts);
  });

  bot.onText(track_regex, async (msg, match) => {
    const chat_id = msg.chat.id;
    const user_id = msg.from?.id;

    if (user_id === undefined || match === null) return 1;

    const checked_tracks = await checkTracks(match.input.split("\n"), track_regex)

    const message = [...checked_tracks.valid.map(track => `[+] Трек ${track} принят`), ...checked_tracks.invalid.map(track => `[-] Трек ${track} неккоректен`)].join("\n")
    await bot.sendMessage(chat_id, message, send_opts)

  });

  app.listen(port, () => console.log("[Express] Started!"));
});
