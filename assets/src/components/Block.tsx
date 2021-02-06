import * as PIXI from "pixi.js";
import React from "react";
import { Sprite } from "react-pixi-fiber";
import { BaseComponent } from "../types";

import sprite from "../sprites/block.png";
const texture = PIXI.Texture.from(sprite);

interface BlockComponentProps extends BaseComponent {
  type: number;
}

export const BlockComponent: React.FC<BlockComponentProps> = ({
  x,
  y,
  xScale,
  yScale,
  type,
}) => {
  if (type < 2) {
    return null;
  }

  return (
    <Sprite
      texture={texture}
      x={x}
      y={y}
      scale={{ x: xScale / texture.width, y: yScale / texture.height }}
    />
  );
};
