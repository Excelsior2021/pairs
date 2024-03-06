export enum PlayerOutput {
  OpponentMatch,
  DeckMatch,
  HandMatch,
  NoMatch,
  NoOpponentMatch,
}

export enum PlayerMatchHeading {
  Match = "match",
  NoMatch = "no match",
}

export enum PlayerMatchSubHeading {
  Opponent = "opponent hand",
  Deck = "dealt card",
  Player = "your hand",
  None = "",
}

export enum OpponentOutput {
  DeckMatch,
  HandMatch,
  NoMatch,
}
