export enum suit {
  clubs = "clubs",
  diamonds = "diamonds",
  hearts = "hearts",
  spades = "spades",
}

export enum nonNumCardValue {
  ace = "ace",
  jack = "jack",
  queen = "queen",
  king = "king",
}

export enum Player {
  Player1 = 1,
  Player2,
}

export enum PlayerOutput {
  OpponentMatch,
  DeckMatch,
  HandMatch,
  NoMatch,
  Quit = 3,
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
  Disconnect = "Your opponent has disconnected. The game has ended.",
}

export enum GameAction {
  UPDATE = "UPDATE",
  PLAYER_ACTION = "PLAYER_ACTION",
  PLAYER_REQUEST = "PAYER_REQUEST",
  PLAYER_RESPONSE = "PLAYER_RESPONSE",
  PLAYER_MATCH = "PLAYER_MATCH",
  NO_PLAYER_MATCH = "NO_PLAYER_MATCH",
  PLAYER_DEALS = "PLAYER_DEALS",
  PLAYER_DEALT = "PLAYER_DEALT",
  PLAYER_RESULT = "PLAYER_RESULT",
  PLAYER_RESPONSE_MESSAGE = "PLAYER_RESPONSE_MESSAGE",
  PLAYER_TURN_SWITCH = "PLAYER_TURN_SWITCH",
  PLAYER_DISCONNECT = "PLAYER_DISCONNECT",
  PLAYER_DISCONNECTED = "PLAYER_DISCONNECTED",
  GAME_LOG = "GAME_LOG",
  GAME_OVER = "GAME_OVER",
  CREATE_SESSION = "CREATE_SESSION",
  JOIN_SESSION = "JOIN_SESSION",
  START_SESSION = "START_SESSION",
}
