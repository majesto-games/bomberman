import * as PIXI from "pixi.js";
import React from "react";
import { Sprite, Text, Container } from "react-pixi-fiber";
import { BaseComponent } from "../types";

import sprite from "../sprites/bunny.png";
const texture = PIXI.Texture.from(sprite);

interface PlayerProps extends BaseComponent {
  id: string;
}

export const PlayerComponent: React.FC<PlayerProps> = ({
  id,
  x,
  y,
  xScale,
  yScale,
}) => {
  return (
    <Container x={x} y={y}>
      <Sprite
        texture={texture}
        scale={{ x: xScale / texture.width, y: yScale / texture.height }}
      />
      <Text text={id} style={{ fontSize: 14, align: "center", fill: "#fff" }} />
    </Container>
  );
};
