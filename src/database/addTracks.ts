import { MongoClient } from "mongodb";
import { getTracks } from "./getTracks";
import { Track } from "../models/Track";

export const addTracks = async (
  tracks: string[],
  id: number,
  client: MongoClient
) => {
  const existed_raw_tracks = await getTracks(id, client);

  const tracks_to_add: Track[] = tracks.map((track) => {
    return {
      value: track,
      added: new Date(),
    };
  });

  const users = client.db().collection("users");
  await users.updateOne(
    { id },
    { $set: { tracks: [...existed_raw_tracks, ...tracks_to_add] } }
  );
};
