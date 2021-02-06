import { render } from "react-dom";
import { Stage, usePixiApp } from "react-pixi-fiber";
import { Socket } from "phoenix";
import React, { useEffect, useReducer } from "react";
import { initialState, reducer } from "./reducer";
import { keyboard } from "./keyboard";

import "./index.css";
import { BombComponent } from "./components/Bomb";
import { PlayerComponent } from "./components/Player";
import { BlockComponent } from "./components/Block";

const socket = new Socket("ws://localhost:4000/socket");
socket.connect();

const WIDTH = 800;
const HEIGHT = 800;

const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "];
const pressedKeys = keyboard(keys);

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
      if (pressedKeys.has(" ")) channel.push("bomb", {});
    });

    channel.on("tick", (payload) => {
      dispatch({ type: "tick", payload });
    });

    channel.on("joined", (payload) => {
      dispatch({ type: "joined", payload });
    });

    channel.on("left", (payload) => {
      dispatch({ type: "left", payload });
    });

    channel.on("explosion", (payload) => {
      dispatch({ type: "explosion", payload });
    });

    channel.on("bomb", (payload) => {
      dispatch({ type: "bomb", payload });
    });
  }, [ticker]);

  const mapHeight = state.map.blocks.length;
  const mapWidth = mapHeight > 0 ? state.map.blocks[0].length : 0;

  const xScale = WIDTH / mapWidth;
  const yScale = HEIGHT / mapHeight;

  const baseProps = {
    xScale,
    yScale,
  };

  return (
    <>
      {Object.values(state.players).map((user) => (
        <PlayerComponent
          {...baseProps}
          key={user.id}
          id={user.id}
          x={user.position.x * xScale}
          y={user.position.y * yScale}
        />
      ))}
      {state.map.blocks.map((row, y) =>
        row.map((type, x) => (
          <BlockComponent
            key={`${x}${y}`}
            {...baseProps}
            x={x * xScale}
            y={y * yScale}
            type={type}
          />
        ))
      )}
      {state.bombs.map((bomb, i) => (
        <BombComponent
          {...baseProps}
          key={i}
          x={bomb.x * xScale}
          y={bomb.y * yScale}
        />
      ))}
    </>
  );
};

render(
  <>
    <h1>Bomberman</h1>
    <Stage
      options={{
        backgroundColor: 0x00,
        width: WIDTH,
        height: HEIGHT,
      }}
    >
      <Main />
    </Stage>
  </>,
  document.getElementById("root")
);
