import * as PIXI from "pixi.js";
import { render } from "react-dom";
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";
import { Socket } from "phoenix";

let socket = new Socket("ws://localhost:4000/socket");
socket.connect();

let channel = socket.channel("room:lobby");
channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

function Bunny(props: any) {
  return <Sprite texture={PIXI.Texture.from(bunny)} {...props} />;
}

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <Bunny x={200} y={400} />
  </Stage>,
  document.getElementById("root")
);
