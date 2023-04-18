export interface Track {
  name?: string;
  value: string;
  expires?: number;
  added: Date;
  state?: State;
}

export interface State {
  current_state: string;
  previuos_states?: string[];
}
