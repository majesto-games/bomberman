import * as PIXI from "pixi.js";
import React from "react";
import { Sprite } from "react-pixi-fiber";
import { BaseComponent, Bomb } from "../types";

import sprite from "../sprites/bomb.png";

interface BombComponentProps extends Bomb, BaseComponent {}

export const BombComponent: React.FC<BombComponentProps> = ({ x, y }) => {
  return (
    <Sprite texture={PIXI.Texture.from(sprite)} anchor={0.5} x={x} y={y} />
  );
};
