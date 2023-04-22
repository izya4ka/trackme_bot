import { MongoClient } from "mongodb";
import { getTracks } from "./getTracks";
import { receiveTrackFromApi } from "../api/receiveTrackFromApi";
import { Track } from "../models/Track";

export const refreshTrackState = async (client: MongoClient, id: number) => {
    const tracks_from_user = await getTracks(id, client);
    const not_refreshed_tracks: Track[] = []
    const refreshed_tracks: Track[] = []

    tracks_from_user.forEach(async (track) => {
        const track_new_state = (await receiveTrackFromApi(track.value)).data.lastPoint
        if (track_new_state.id !== track.state.id) refreshed_tracks.push({...track, state: track_new_state})
        else not_refreshed_tracks.push(track)
    })

    const users = client.db().collection("users");
    await users.updateOne({ id }, { $set: { tracks: [...not_refreshed_tracks, ...refreshed_tracks] } });

    return refreshed_tracks
}
