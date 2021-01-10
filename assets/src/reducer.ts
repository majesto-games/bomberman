export interface Action {
  type: string;
  payload: any;
}
export interface JoinAction {
  type: "join";
  payload: {
    username: string;
  }
}
export interface JoinedAction {
  type: "joined";
  payload: {
    users: User[];
  }
}
export interface MoveAction {
  type: "move";
  payload: {
    username: string;
    x: number;
    y: number;
  }
}

export type AllActions = JoinAction | MoveAction | JoinedAction

export interface User {
  username: string;
  x: number;
  y: number;
}

export interface State {
  username: string | null;
  users: User[]
}

export const initialState: State = {
  username: null,
  users: []
};

export function reducer(state: State, action: AllActions): State {
  switch (action.type) {
    case "join": {
      const { username } = action.payload;
      return {
        ...state,
        username,
      }}
    case "move": {
      const { username, x, y } = action.payload;
      return {
        ...state,
        users: state.users.map((user) => {
          if (user.username === username) {
            return { ...user, x, y }
          }

          return user;
        }),
      }}
    case "joined": {
      const { users } = action.payload;
      return {
        ...state,
        users
      }}
    default:
      throw new Error();
  }
}