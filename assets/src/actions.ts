import { Player, ServerState } from "./types";

export interface Action {
  type: string;
  payload: any;
}

export interface JoinAction extends Action {
  type: "join";
  payload: {
    id: string;
    state: ServerState;
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
    players: Record<string, Player>;
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
