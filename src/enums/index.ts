export enum Suit {
  clubs = "clubs",
  diamonds = "diamonds",
  hearts = "hearts",
  spades = "spades",
}

export enum NonNumCardValue {
  ace = "ace",
  jack = "jack",
  queen = "queen",
  king = "king",
}

export enum PlayerID {
  P1 = 1,
  P2,
}

export enum PlayerOutput {
  OpponentMatch,
  DeckMatch,
  HandMatch,
  NoMatch,
  NoOpponentMatch,
}

export enum PlayerModalHeading {
  Match = "match",
  NoMatch = "no match",
}

export enum PlayerModalSubHeading {
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
  Disconnect = "Your opponent has disconnected. The game has ended.",
}

export enum Action {
  UPDATE = "UPDATE",
  PLAYER_ACTION = "PLAYER_ACTION",
  PLAYER_REQUEST = "PLAYER_REQUEST",
  PLAYER_RESPONSE = "PLAYER_RESPONSE",
  PLAYER_MATCH = "PLAYER_MATCH",
  NO_PLAYER_MATCH = "NO_PLAYER_MATCH",
  PLAYER_DEALS = "PLAYER_DEALS",
  PLAYER_DEALT = "PLAYER_DEALT",
  PLAYER_RESULT = "PLAYER_RESULT",
  PLAYER_RESPONSE_MESSAGE = "PLAYER_RESPONSE_MESSAGE",
  PLAYER_TURN_SWITCH = "PLAYER_TURN_SWITCH",
  PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
  GAME_OVER = "GAME_OVER",
}

export enum ModalHeadingColor {
  green = "green",
  red = "red",
}
