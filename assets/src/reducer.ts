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
export interface ExplosionAction extends Action {
  type: "explosion";
  payload: {
    x: number;
    y: number;
  }
}

export interface BombAction extends Action {
  type: "bomb";
  payload: {
    x: number;
    y: number;
  }
}

export type ReducerActions = JoinAction | MoveAction | JoinedAction | LeftAction | ExplosionAction | BombAction

export interface Player {
  id: string;
  x: number;
  y: number;
}

export interface Bomb {
  x: number;
  y: number;
}

export interface State {
  id: string | null;
  players: Player[]
  bombs: Bomb[]
}

export const initialState: State = {
  id: null,
  players: [],
  bombs: []
};

export function reducer(state: State, action: ReducerActions): State {
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
    case "explosion": {
      const { x, y } = action.payload;
      return {
        ...state,
        bombs: state.bombs.filter((b) => b.x !== x && b.y !== y)
      }}
    case "bomb": {
      const { x, y } = action.payload;
      return {
        ...state,
        bombs: [...state.bombs, { x, y }]
      }}
    default:
      return exhaustSwitchCase(action, state)
  }
}