// import { MongoClient } from "mongodb";
// import { getTracks } from "./getTracks";
// import { receiveTrackFromApi } from "../api/receiveTrackFromApi";
// import { Track } from "../models/Track";

// export const refreshTrackState = async (client: MongoClient, id: number) => {
//     const tracks = await getTracks(id, client);
//     const refreshed_tracks: Track[] = []
//     const users = client.db().collection("users");
//     users.updateOne({ id }, { $set: { tracks: refreshed_tracks } });
// }
