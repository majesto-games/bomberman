import * as PIXI from "pixi.js";
import { render } from "react-dom";
import { Sprite, Stage } from "react-pixi-fiber";
import bunny from "./bunny.png";
import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { userToken: "123" } });
socket.connect();

function Bunny(props: any) {
  return <Sprite texture={PIXI.Texture.from(bunny)} {...props} />;
}

render(
  <Stage options={{ backgroundColor: 0x10bb99, height: 600, width: 800 }}>
    <Bunny x={200} y={200} />
  </Stage>,
  document.getElementById("root")
);
