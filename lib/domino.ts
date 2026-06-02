import { DominoIO } from "../shared/socket-types";

export class Domino {
  constructor(
    public readonly leftPip: number,
    public readonly rightPip: number
  ) { }

  isDouble(): boolean {
    return this.leftPip === this.rightPip;
  }

  flip(): Domino {
    return new Domino(this.rightPip, this.leftPip);
  }

  getPoints(): number {
    return this.leftPip + this.rightPip;
  }

  isEqual(domino: Domino): boolean {
    return (
      (this.leftPip === domino.leftPip && this.rightPip === domino.rightPip)
      || (this.leftPip === domino.rightPip && this.rightPip === domino.leftPip)
    );
  }

  hasMatch(pip: number): boolean {
    return this.leftPip === pip || this.rightPip === pip;
  }

  getId(): string {
    const [small, big] = this.leftPip <= this.rightPip ? [this.leftPip, this.rightPip] : [this.rightPip, this.leftPip];
    return `${small}-${big}`;
  }

  toIO(): DominoIO {
    return {
      leftPip: this.leftPip,
      rightPip: this.rightPip
    };
  }

  static fromIO(domino: DominoIO): Domino {
    return new Domino(domino.leftPip, domino.rightPip);
  }
}

export function moveDomino(
  hand: Domino[],
  dominoToMove: Domino,
  targetDomino: Domino
): Domino[] {
  const moveIndex = hand.findIndex((domino) => {
    return domino.isEqual(dominoToMove);
  });

  const targetIndex = hand.findIndex((domino) => {
    return domino.isEqual(targetDomino);
  });

  if (moveIndex === -1 || targetIndex === -1) {
    return hand;
  }

  const nextHand = [...hand];

  const [removedDomino] = nextHand.splice(moveIndex, 1);

  const movingRight = moveIndex < targetIndex;

  const adjustedTargetIndex = movingRight
    ? targetIndex - 1
    : targetIndex;

  const insertIndex = movingRight
    ? adjustedTargetIndex + 1
    : adjustedTargetIndex;

  nextHand.splice(insertIndex, 0, removedDomino);

  return nextHand;
}