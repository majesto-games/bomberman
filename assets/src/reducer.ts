import { exhaustSwitchCase } from "./utils";

export interface Action {
  type: string;
  payload: any;
}
export interface JoinAction extends Action {
  type: "join";
  payload: {
    id: string;
    players: Player[];
  }
}
export interface JoinedAction extends Action {
  type: "joined";
  payload: {
    player: Player;
  }
}
export interface LeftAction extends Action {
  type: "left";
  payload: {
    player_id: string;
  }
}
export interface MoveAction extends Action {
  type: "move";
  payload: {
    id: string;
    x: number;
    y: number;
  }
}

export type AllActions = JoinAction | MoveAction | JoinedAction | LeftAction

export interface Player {
  id: string;
  x: number;
  y: number;
}

export interface State {
  id: string | null;
  players: Player[]
}

export const initialState: State = {
  id: null,
  players: []
};

export function reducer(state: State, action: AllActions): State {
  switch (action.type) {
    case "join": {
      return {
        ...state,
        ...action.payload,
      }}
    case "move": {
      const { id, x, y } = action.payload;
      return {
        ...state,
        players: state.players.map((p) => {
          if (p.id === id) {
            return { ...p, x, y }
          }

          return p;
        }),
      }}
    case "joined": {
      const { player } = action.payload;
      return {
        ...state,
        players: [...state.players, player]
      }}
    case "left": {
      const { player_id } = action.payload;
      return {
        ...state,
        players: state.players.filter((p) => p.id !== player_id)
      }}
    default:
      return exhaustSwitchCase(action, state)
  }
}