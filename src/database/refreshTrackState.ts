import { MongoClient } from "mongodb";
import { Track } from "../models/Track";
import { receiveTrackFromApi } from "../api/receiveTrackFromApi";
import { User } from "../models/User";

export const refreshTrackState = async (
  client: MongoClient,
  track: Track,
  id: number
): Promise<Track | null> => {
  const new_track_state = (await receiveTrackFromApi(track.value)).data
    .lastPoint;
  if (new_track_state.id !== track.state.id) {
    const users = client.db().collection<User>("users");
    const update_document = { id, "tracks.value": track.value };
    users.updateOne(update_document, {
      $set: { "tracks.$.state": new_track_state },
    });
    return { ...track, state: new_track_state };
  } else return null;
};
