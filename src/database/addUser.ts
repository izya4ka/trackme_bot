import { randomUUID } from "crypto";
import { MongoClient } from "mongodb";
import { User } from "../models/User";

export const addUser = async (client: MongoClient, id: number) => {
  const db = client.db("trackme_db");
  const users = db.collection("users");
  const user_found = await users.findOne<User>({ id });
  if (user_found !== null) throw new Error("User already in database");

  const user: User = { id: id, key: randomUUID(), added: Date.now() };
  await users.insertOne(user);
};
