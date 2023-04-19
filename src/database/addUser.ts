import { randomUUID } from "crypto";
import { MongoClient } from "mongodb";
import { User } from "../models/User";

export const addUser = async (client: MongoClient, id: number, chat_id: number) => {
  const db = client.db();
  const users = db.collection("users");
  const user_found = await users.findOne<User>({ id });
  if (user_found !== null) throw new Error("User already in database");

  const user: User = { id, key: randomUUID(), added: new Date() , chat_id};
  await users.insertOne(user);
};
