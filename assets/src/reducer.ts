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
  };
}
export interface JoinedAction extends Action {
  type: "joined";
  payload: {
    player: Player;
  };
}
export interface LeftAction extends Action {
  type: "left";
  payload: {
    player_id: string;
  };
}
export interface TickAction extends Action {
  type: "tick";
  payload: {
    players: Player[];
  };
}
export interface ExplosionAction extends Action {
  type: "explosion";
  payload: {
    x: number;
    y: number;
    players_dead: Player[];
  };
}

export interface BombAction extends Action {
  type: "bomb";
  payload: {
    x: number;
    y: number;
  };
}

export type ReducerActions =
  | JoinAction
  | TickAction
  | JoinedAction
  | LeftAction
  | ExplosionAction
  | BombAction;

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
  players: Player[];
  bombs: Bomb[];
}

export const initialState: State = {
  id: null,
  players: [],
  bombs: [],
};

export function reducer(state: State, action: ReducerActions): State {
  switch (action.type) {
    case "join": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "joined": {
      const { player } = action.payload;
      return {
        ...state,
        players: [...state.players, player],
      };
    }
    case "left": {
      const { player_id } = action.payload;
      return {
        ...state,
        players: state.players.filter((p) => p.id !== player_id),
      };
    }
    case "explosion": {
      const { x, y, players_dead } = action.payload;
      return {
        ...state,
        bombs: state.bombs.filter((b) => b.x !== x && b.y !== y),
        players: state.players.filter(
          (p) => !players_dead.some((p2) => p.id === p2.id)
        ),
      };
    }
    case "bomb": {
      const { x, y } = action.payload;
      return {
        ...state,
        bombs: [...state.bombs, { x, y }],
      };
    }
    case "tick": {
      const { players } = action.payload;
      return {
        ...state,
        players,
      };
    }

    default:
      return exhaustSwitchCase(action, state);
  }
}
