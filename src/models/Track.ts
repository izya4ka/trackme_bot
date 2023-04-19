import { Event } from "../api/apiResponse";

export interface Track {
  name?: string;
  value: string;
  expires?: number;
  added: Date;
  state: Event;
}
