import * as PIXI from "pixi.js";
import { render } from "react-dom";
import { Sprite, Stage, Text, Container, usePixiApp } from "react-pixi-fiber";
import { Socket } from "phoenix";
import { useEffect, useReducer } from "react";
import { Bomb as IBomb, initialState, Player, reducer } from "./reducer";
import { keyboard } from "./keyboard";

import bunny from "./bunny.png";
import bomb from "./bomb.png";

import "./index.css";

const socket = new Socket("ws://localhost:4000/socket");
socket.connect();

const GRID_STEP = 40;

interface BunnyProps extends Player {}

const Bunny: React.FC<BunnyProps> = ({ id, x, y }) => {
  return (
    <Container x={x * GRID_STEP + 20} y={y * GRID_STEP + 20}>
      <Text
        text={id}
        style={{ fontSize: 14, align: "center", fill: "#fff" }}
        anchor={[0.5, 3]}
      />
      <Sprite texture={PIXI.Texture.from(bunny)} anchor={0.5} />
    </Container>
  );
};

interface BombProps extends IBomb {}

const Bomb: React.FC<BombProps> = ({ x, y }) => {
  return (
    <Sprite
      texture={PIXI.Texture.from(bomb)}
      anchor={0.5}
      x={x * GRID_STEP + 20}
      y={y * GRID_STEP + 20}
    />
  );
};

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
      if (pressedKeys.has(" ")) channel.push("bomb", {});
    });

    channel.on("moved", (payload) => {
      dispatch({ type: "move", payload });
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

  return (
    <>
      {state.bombs.map((bomb, i) => (
        <Bomb key={i} x={bomb.x} y={bomb.y} />
      ))}
      {state.players.map((user) => (
        <Bunny key={user.id} id={user.id} x={user.x} y={user.y} />
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
        height: 800,
        width: 800,
      }}
    >
      <Main />
    </Stage>
  </>,
  document.getElementById("root")
);
