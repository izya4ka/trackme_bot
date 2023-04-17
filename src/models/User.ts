import { Track } from "./Track";

export interface User {
    id: number,
    tracks?: Track[],
    key: string,
    added: number,
}
