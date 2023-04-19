import { MongoClient } from "mongodb";
import { getTracks } from "./getTracks";
import { Track } from "../models/Track";
import { receiveTrackFromApi } from "../api/receiveTrackFromApi";

export const addTracks = async (
  tracks: string[],
  id: number,
  client: MongoClient
) => {
  const existed_raw_tracks = await getTracks(id, client);

  const tracks_to_add: Track[] = await Promise.all(tracks.map(async (track) => {
    return {
      value: track,
      added: new Date(),
      state: (await receiveTrackFromApi(track)).data.lastPoint
    };
  }));

  const users = client.db().collection("users");
  await users.updateOne(
    { id },
    { $set: { tracks: [...existed_raw_tracks, ...tracks_to_add] } }
  );
};
