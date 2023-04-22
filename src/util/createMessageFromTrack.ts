import { Track } from "../models/Track";

export const createMessageFromTrack = (track: Track) => {
  const message = [
    `[Трек] ${track.value}`,
    `[Место] ${track.state.operationPlaceName}`,
    `[Время] ${track.state.operationDateTime}`,
    `[Операция] ${track.state.operationAttribute}`,
  ];
  if (track.name) message.unshift(`[Название] ${track.name}`);
  return message.join("\n");
};
