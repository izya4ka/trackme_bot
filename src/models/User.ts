import { Track } from "./Track";

export interface User {
  id: number;
  tracks?: Track[];
  key: string;
  added: Date;
  chat_id: number;
}
