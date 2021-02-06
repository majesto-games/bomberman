import { ReducerActions } from "./actions";
import { Player, Bomb } from "./types";
import { exhaustSwitchCase } from "./utils";

export interface State {
  id: string | null;
  players: Record<string, Player>;
  bombs: Bomb[];
  map: { blocks: number[][] };
}

export const initialState: State = {
  id: null,
  players: {},
  bombs: [],
  map: { blocks: [] },
};

export function reducer(state: State, action: ReducerActions): State {
  switch (action.type) {
    case "join": {
      return {
        ...state,
        id: action.payload.id,
        ...action.payload.state,
      };
    }
    case "joined": {
      const { player } = action.payload;
      return {
        ...state,
        players: { ...state.players, [player.id]: player },
      };
    }
    case "left": {
      const { player_id } = action.payload;
      const { [player_id]: removed_player, ...players } = state.players;
      return {
        ...state,
        players,
      };
    }
    case "explosion": {
      const { x, y, players_dead } = action.payload;
      return {
        ...state,
        bombs: state.bombs.filter((b) => b.x !== x && b.y !== y),
        // players: state.players.filter(
        //   (p) => !players_dead.some((p2) => p.id === p2.id)
        // ),
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
