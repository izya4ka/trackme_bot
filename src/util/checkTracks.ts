import { MongoClient } from "mongodb";
import { getTracks } from "../database/getTracks";

interface checkedTracks {
  valid: string[];
  invalid: string[];
  already_exist: string[];
}

const checkTracks = async (
  tracks: string[],
  regex: RegExp,
  id: number,
  client: MongoClient
) => {
  const checked_tracks: checkedTracks = {
    valid: [],
    invalid: [],
    already_exist: [],
  };

  const existed_tracks = (await getTracks(id, client)).map(
    (track) => track.value
  );

  tracks.forEach((track) => {
    if (track.match(regex) && !existed_tracks.includes(track))
      checked_tracks.valid.push(track);
    else if (existed_tracks.includes(track))
      checked_tracks.already_exist.push(track);
    else checked_tracks.invalid.push(track);
  });

  return checked_tracks;
};

export default checkTracks;
