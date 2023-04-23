import { MongoClient } from "mongodb";
import { Track } from "../models/Track";
import { receiveTrackFromApi } from "../api/receiveTrackFromApi";
import { User } from "../models/User";
import { deleteTrack } from "./deleteTrack";

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
    if (track.state.icon === "delivered" || new_track_state.icon === "delivered") {
      await deleteTrack(client, id, track.value)
    }
    return { ...track, state: new_track_state };
  } else return null;
};
