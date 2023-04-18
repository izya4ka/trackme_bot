import { MongoClient } from "mongodb";
import { User } from "../models/User";

export const getTracks = async (id: number, client: MongoClient) => {
  const users = client.db().collection("users");
  const user_found = await users.findOne<User>({ id });
  if (!user_found) throw new Error("User not found");
  return user_found.tracks || [];
};
