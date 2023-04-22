import { MongoClient } from "mongodb";
import TelegramBot from "node-telegram-bot-api";
import { User } from "../models/User";
import { refreshTrackState } from "../database/refreshTrackState";
import { createMessageFromTrack } from "../util/createMessageFromTrack";

export const refreshAllTracksStates = async (
  client: MongoClient,
  bot: TelegramBot
) => {
  client
    .db()
    .collection<User>("users")
    .find({})
    .forEach((user) => {
      if (user.tracks === undefined) return;
      user.tracks.forEach(async (track) => {
        const new_track = await refreshTrackState(client, track, user.id);
        if (new_track) {
          await bot.sendMessage(
            user.chat_id,
            createMessageFromTrack(new_track)
          );
        }
      });
    });
  console.log("[#] Refreshed");
};
