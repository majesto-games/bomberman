export interface Action {
  type: string;
  payload: any;
}

export interface State {
  username: string | null;
}

export const initialState: State = {
  username: null,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "join":
      return {
        username: action.payload
      }
    default:
      throw new Error();
  }
}