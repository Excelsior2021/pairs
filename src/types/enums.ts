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

export enum GameMode {
  SinglePlayer = "single player",
  Multiplayer = "multiplayer",
}

export enum Outcome {
  Player = "You won!",
  Opponent = "Your opponent won!",
  Draw = "It's a draw!",
}
