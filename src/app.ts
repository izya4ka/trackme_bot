import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { addUser } from "./database/addUser";
import express from "express";
import cors from "cors";
import checkTracks from "./util/checkTracks";
import { addTracks } from "./database/addTracks";
import { refreshTrackState } from "./database/refreshTrackState";
import { User } from "./models/User";
require("dotenv").config();

const port = "55353";
const app = express();
app.use(express.json());
app.use(cors());

const track_refresh_interval = process.env.TRACK_REFRESH_INTERVAL

const db = {
  url: process.env.MONGODB_URL,
  name: process.env.MONGODB_DATABASE,
  user: process.env.MONGODB_USER,
  password: process.env.MONGODB_PASSWORD,
};

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
  `mongodb://${db.user}:${db.password}@${db.url}/${db.name}`
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
      await addUser(db_con, user_id, chat_id);
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

    const checked_tracks = await checkTracks(
      match.input.split("\n"),
      track_regex,
      user_id,
      db_con
    );

    addTracks(checked_tracks.valid, user_id, db_con).then(() =>
      console.log(`Added ${checked_tracks.valid.length} for user ${user_id}`)
    );

    const message = [
      ...checked_tracks.valid.map((track) => `[+] Трек ${track} принят`),
      ...checked_tracks.invalid.map((track) => `[-] Трек ${track} неккоректен`),
      ...checked_tracks.already_exist.map(
        (track) => `[!] Трек ${track} уже добавлен`
      ),
    ].join("\n");

    await bot.sendMessage(chat_id, message, send_opts);
  });

  app.listen(port, () => console.log("[Express] Started!"));

  setInterval(() => {
    db_con
      .db()
      .collection<User>("users")
      .find({})
      .forEach((user) => {
        refreshTrackState(db_con, user.id).then((refreshed_tracks) => {
          const message = refreshed_tracks.map((track) => {
            const data = `
            [Место] ${track.state.operationPlaceName}\n
            [Время] ${track.state.operationDateTime}\n
            [Операция] ${track.state.operationAttribute}\n
          `;
          });
          bot.sendMessage(user.id, message.join("\n"), send_opts)
        });
      });
  }, parseInt(track_refresh_interval || "7200000"));
});
