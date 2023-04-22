import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import checkTracks from "../util/checkTracks";
import { addTracks } from "../database/addTracks";

export const handleIncomingTracks = async (
  client: MongoClient,
  bot: TelegramBot,
  send_opts: TelegramBot.SendMessageOptions,
  msg: TelegramBot.Message,
  match: RegExpExecArray,
  track_regex: RegExp
) => {
  const user_id = msg.from?.id;
  const chat_id = msg.chat.id;
  if (!user_id) throw new Error("No user");
  const checked_tracks = await checkTracks(
    match.input.split("\n"),
    track_regex,
    user_id,
    client
  );

  addTracks(checked_tracks.valid, user_id, client).then(() =>
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
};
