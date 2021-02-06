export interface Player {
  id: string;
  position: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface Bomb {
  x: number;
  y: number;
}

export interface ServerState {
  players: Record<string, Player>;
  bombs: Bomb[];
  map: {
    blocks: number[][];
  };
}

export interface BaseComponent {
  x: number;
  y: number;
  xScale: number;
  yScale: number;
}
