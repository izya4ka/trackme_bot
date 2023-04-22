import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { addUser } from "../database/addUser";

export const handleUser = async (
  msg: TelegramBot.Message,
  client: MongoClient,
  bot: TelegramBot,
  send_opts: TelegramBot.SendMessageOptions
) => {
  const chat_id = msg.chat.id;
  const user_id = msg.from?.id;

  if (user_id === undefined) return 1;

  try {
    await addUser(client, user_id, chat_id);
    console.log("Added user with ID: " + user_id);
  } catch (err) {
    console.log(err);
  }

  await bot.sendMessage(chat_id, "Выберите опцию", send_opts);
};
