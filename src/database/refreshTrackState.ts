import { MongoClient } from "mongodb";
import { getTracks } from "./getTracks";
import { receiveTrackFromApi } from "../api/receiveTrackFromApi";
import { Track } from "../models/Track";

interface RefreshedOrNot {
    new_id: boolean,
    track: Track
}

export const refreshTrackState = async (client: MongoClient, id: number) => {
    const tracks_from_user = await getTracks(id, client);
    const bad = []
    const good = []
    
    for (let track of tracks_from_user) {
        const new_track_state = (await receiveTrackFromApi(track.value)).data.lastPoint
        if (new_track_state.id !== track.state.id) good.push({...track, state: new_track_state})
        else bad.push(track)
    }

    const users = client.db().collection("users");
    await users.updateOne({ id }, { $set: { tracks: [...bad, ...good] } });

    return good
}
