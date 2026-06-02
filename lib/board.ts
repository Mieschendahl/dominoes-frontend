import { Domino } from "./domino";
import { BoardIO, ChainIO } from "../shared/socket-types";

export type DominoUI = {
  domino: Domino;
  isPreview: boolean;
};

export type ChainUI = DominoUI[];

export class Chain {
  constructor(
    public isLeft: boolean,
    public dominoes: Domino[] = [],
    public previewDomino?: Domino
  ) {}

  isEmpty(): boolean {
    return this.dominoes.length === 0;
  }

  getEnd(): Domino | undefined {
    return this.dominoes.at(-1);
  }

  containsDomino(domino: Domino): boolean {
    return this.dominoes.some((_domino) => _domino.isEqual(domino));
  }

  getPlaceableDomino(domino: Domino): Domino | undefined {
    if (this.isEmpty()) {
      return domino;
    }

    const end = this.getEnd()!;
    const pip = this.isLeft ? end.leftPip : end.rightPip;

    if (this.isLeft) {
      if (pip === domino.rightPip) return domino;
      if (pip === domino.leftPip) return domino.flip();
    } else {
      if (pip === domino.leftPip) return domino;
      if (pip === domino.rightPip) return domino.flip();
    }

    return undefined;
  }

  canPlaceDomino(domino: Domino): boolean {
    return this.getPlaceableDomino(domino) !== undefined;
  }

  realisePreviewDomino() {
    if (this.previewDomino !== undefined) {
      this.dominoes.push(this.previewDomino);
      this.previewDomino = undefined;
    }
  }

  setPreviewDomino(domino?: Domino) {
    if (domino === undefined) {
      this.previewDomino = undefined;
      return;
    }

    const placeableDomino = this.getPlaceableDomino(domino);

    if (placeableDomino === undefined) {
      this.previewDomino = undefined;
      return;
    }

    this.previewDomino = placeableDomino;
  }

  clearPreviewDomino(): void {
    this.previewDomino = undefined;
  }

  toUI(): ChainUI {
    const dominoes: DominoUI[] = this.dominoes.map((domino) => ({
      domino,
      isPreview: false,
    }));

    if (this.previewDomino !== undefined) {
      dominoes.push({
        domino: this.previewDomino,
        isPreview: true,
      });
    }

    return dominoes;
  }

  static fromIO(isLeft: boolean, chain: ChainIO): Chain {
    return new Chain(
      isLeft,
      chain.map((domino) => Domino.fromIO(domino))
    );
  }
}

export type BoardUI = {
  leftChain: ChainUI;
  rightChain: ChainUI;
};

export class Board {
  constructor(
    public leftChain: Chain = new Chain(true),
    public rightChain: Chain = new Chain(false)
  ) {}

  canPlaceDomino(domino: Domino, isLeft: boolean): boolean {
    return (isLeft ? this.leftChain : this.rightChain).canPlaceDomino(domino);
  }

  setPreviewDomino(domino?: Domino) {
    this.leftChain.setPreviewDomino(domino);
    this.rightChain.setPreviewDomino(domino);
  }

  realisePreviewDomino(isLeft: boolean) {
    if (this.leftChain.isEmpty()) {
      this.leftChain.realisePreviewDomino();
      this.rightChain.realisePreviewDomino();
    } else {
      (isLeft ? this.leftChain : this.rightChain).realisePreviewDomino();
      (!isLeft ? this.leftChain : this.rightChain).clearPreviewDomino();
    }
  }

  toUI(): BoardUI {
    return {
      leftChain: this.leftChain.toUI(),
      rightChain: this.rightChain.toUI(),
    };
  }

  static fromIO({ leftChain, rightChain }: BoardIO): Board {
    return new Board(
      Chain.fromIO(true, leftChain),
      Chain.fromIO(false, rightChain)
    );
  }
}