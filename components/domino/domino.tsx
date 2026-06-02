"use client";

import {
  DIVIDER_WIDTH,
  DOMINO_HEIGHT,
  DOMINO_RADIUS,
  DOMINO_WIDTH,
  PIP_RADIUS,
} from "@/components/domino/dimensions";
import { DominoIO } from "@/shared/socket-types";

export type Point = {
  x: number;
  y: number;
};

export function pipToPoints(value: number): Point[] {
  const X = {
    left: DOMINO_WIDTH * 0.2627,
    center: DOMINO_WIDTH * 0.5,
    right: DOMINO_WIDTH * 0.7373,
  };

  const Y = {
    top: DOMINO_WIDTH * 0.2118,
    middle: DOMINO_WIDTH * 0.5,
    bottom: DOMINO_WIDTH * 0.7882,
  };

  switch (value) {
    case 0:
      return [];
    case 1:
      return [{ x: X.center, y: Y.middle }];
    case 2:
      return [
        { x: X.left, y: Y.top },
        { x: X.right, y: Y.bottom },
      ];
    case 3:
      return [
        { x: X.left, y: Y.top },
        { x: X.center, y: Y.middle },
        { x: X.right, y: Y.bottom },
      ];
    case 4:
      return [
        { x: X.left, y: Y.top },
        { x: X.right, y: Y.top },
        { x: X.left, y: Y.bottom },
        { x: X.right, y: Y.bottom },
      ];
    case 5:
      return [
        { x: X.left, y: Y.top },
        { x: X.right, y: Y.top },
        { x: X.center, y: Y.middle },
        { x: X.left, y: Y.bottom },
        { x: X.right, y: Y.bottom },
      ];
    case 6:
      return [
        { x: X.left, y: Y.top },
        { x: X.right, y: Y.top },
        { x: X.left, y: Y.middle },
        { x: X.right, y: Y.middle },
        { x: X.left, y: Y.bottom },
        { x: X.right, y: Y.bottom },
      ];
    default:
      return [];
  }
}

type PipTileProps = {
  value: number;
};

function PipTileG({ value }: PipTileProps) {
  const points = pipToPoints(value);

  return (
    <g>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={PIP_RADIUS}
          fill="#111111"
        />
      ))}
    </g>
  );
}

type DominoGraphicProps = {
  domino: DominoIO;
};

function DominoG({ domino }: DominoGraphicProps) {
  return (
    <g>
      <rect
        x={0}
        y={0}
        width={DOMINO_WIDTH}
        height={DOMINO_HEIGHT}
        rx={DOMINO_RADIUS}
        ry={DOMINO_RADIUS}
        fill="#f7f5ef"
      />

      <line
        x1={0}
        y1={DOMINO_HEIGHT / 2}
        x2={DOMINO_WIDTH}
        y2={DOMINO_HEIGHT / 2}
        stroke="#202020"
        strokeWidth={DIVIDER_WIDTH}
      />

      <PipTileG value={domino.leftPip} />

      <g transform={`translate(0, ${DOMINO_HEIGHT / 2})`}>
        <PipTileG value={domino.rightPip} />
      </g>
    </g>
  );
}

type DominoTileProps = {
  domino: DominoIO;
};

export function DominoSVG({ domino }: DominoTileProps) {
  return (
    <svg
      width={DOMINO_WIDTH}
      height={DOMINO_HEIGHT}
      viewBox={`0 0 ${DOMINO_WIDTH} ${DOMINO_HEIGHT}`}
    >
      <DominoG domino={domino} />
    </svg>
  );
}

type DominoHalfTileProps = {
  domino: DominoIO;
  firstHalf: boolean;
};

export function DominoHalfSVG({
  domino,
  firstHalf,
}: DominoHalfTileProps) {
  const offsetY = firstHalf ? 0 : DOMINO_HEIGHT / 2;

  return (
    <svg
      width={DOMINO_WIDTH}
      height={DOMINO_HEIGHT / 2}
      viewBox={`0 ${offsetY} ${DOMINO_WIDTH} ${DOMINO_HEIGHT / 2}`}
    >
      <DominoG domino={domino} />
    </svg>
  );
}