import { MongoClient } from "mongodb";
import { User } from "../models/User";

export const deleteTrack = async (
  client: MongoClient,
  id: number,
  track_value: string
) => {
  const users = client.db().collection<User>("users");
  users.updateOne({ id }, { $pull: { tracks: { value: track_value } } });
};
