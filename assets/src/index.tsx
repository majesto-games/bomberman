import * as PIXI from "pixi.js";
import { render } from "react-dom";
import { Sprite, Stage, Text } from "react-pixi-fiber";
import bunny from "./bunny.png";
import { Channel, Socket } from "phoenix";
import { useEffect, useReducer, useRef } from "react";
import { initialState, reducer } from "./reducer";

let socket = new Socket("ws://localhost:4000/socket");
socket.connect();

function Bunny(props: any) {
  return <Sprite texture={PIXI.Texture.from(bunny)} {...props} />;
}

const Main: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const channelRef = useRef<Channel>();

  useEffect(() => {
    let channel = socket.channel("room:lobby");
    channel
      .join()
      .receive("ok", (payload) => {
        dispatch({ type: "join", payload });
      })
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });

    channelRef.current = channel;
  }, []);

  return (
    <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
      <Bunny x={200} y={400} />
      {state.username && <Text text={state.username} x={200} y={200} />}
    </Stage>
  );
};

render(<Main />, document.getElementById("root"));
