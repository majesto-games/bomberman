import * as PIXI from "pixi.js";
import { render } from "react-dom";
import { Sprite, Stage, Text, Graphics, usePixiApp } from "react-pixi-fiber";
import bunny from "./bunny.png";
import { Socket } from "phoenix";
import { useEffect, useReducer } from "react";
import { initialState, reducer } from "./reducer";
import { keyboard } from "./keyboard";

const socket = new Socket("ws://localhost:4000/socket");
socket.connect();

function Bunny(props: any) {
  return (
    <Graphics x={props.x} y={props.y}>
      <Text text={props.username} />
      <Sprite texture={PIXI.Texture.from(bunny)} />
    </Graphics>
  );
}

const pressedKeys = keyboard();

interface MainProps {}

const Main: React.FC<MainProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const channelRef = useRef<Channel>();

  const { ticker } = usePixiApp();

  useEffect(() => {
    let channel = socket.channel("room:lobby");
    channel
      .join()
      .receive("ok", (payload) => {
        console.log("Joined", payload);
        dispatch({ type: "join", payload });
      })
      .receive("error", (resp) => {
        console.log("Unable to join", resp);
      });

    // channelRef.current = channel;

    ticker.add(() => {
      if (pressedKeys.has("ArrowUp")) channel.push("move", { direction: "up" });
      if (pressedKeys.has("ArrowDown"))
        channel.push("move", { direction: "down" });
      if (pressedKeys.has("ArrowLeft"))
        channel.push("move", { direction: "left" });
      if (pressedKeys.has("ArrowRight"))
        channel.push("move", { direction: "right" });
    });

    channel.on("moved", (payload) => {
      dispatch({ type: "move", payload });
    });
  }, [ticker]);

  return (
    <>
      {state.users.map((user) => (
        <Bunny
          key={user.username}
          username={user.username}
          x={user.x}
          y={user.y}
        />
      ))}
    </>
  );
};

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <Main />
  </Stage>,
  document.getElementById("root")
);
