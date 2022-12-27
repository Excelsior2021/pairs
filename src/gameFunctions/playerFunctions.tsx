import deck from "./deckFunctions"
import pairs from "./pairsFunctions"
import opponent from "./opponentFunctions"
import { dispatchGameAction } from "../components/Session/Session"
import { setGameDeck } from "../components/Sidebar/Sidebar"
import { card } from "../types/general"

export const playerMatch = (
  playerHandEvent,
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  shuffledDeck: card[]
) => {
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }

  if (chosenCard) {
    for (const card of opponentHand) {
      if (card.value === chosenCard.value) {
        playerPairs.push(card)
        opponentHand.splice(opponentHand.indexOf(card), 1)

        for (const card of playerHand) {
          if (playerHandEvent.target.id === card.id) {
            playerPairs.push(card)
            playerHand.splice(playerHand.indexOf(card), 1)
            pairs.updateUI(
              playerHand,
              opponentHand,
              playerPairs,
              opponentPairs,
              shuffledDeck
            )
            return 0
          }
        }
      }
    }
    return false
  }
}

export const playerDealt = (
  playerHandEvent,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => {
  const dealtCard = deck.dealTopCard(shuffledDeck)
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }

  if (chosenCard && dealtCard) {
    if (chosenCard.value === dealtCard.value) {
      playerPairs.push(dealtCard)
      for (let card of playerHand) {
        if (chosenCard.id === card.id) {
          playerPairs.push(card)
          playerHand.splice(playerHand.indexOf(card), 1)
          pairs.updateUI(
            playerHand,
            opponentHand,
            playerPairs,
            opponentPairs,
            shuffledDeck
          )
          return 1
        }
      }
    }

    for (let card of playerHand) {
      if (dealtCard.value === card.value) {
        playerPairs.push(dealtCard)
        playerPairs.push(card)
        playerHand.splice(playerHand.indexOf(card), 1)
        pairs.updateUI(
          playerHand,
          opponentHand,
          playerPairs,
          opponentPairs,
          shuffledDeck
        )
        return 2
      }
    }

    playerHand.push(dealtCard)
    pairs.updateUI(
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      shuffledDeck
    )
    return 3
  }
}

export const playerTurnHandler = (
  playerHandEvent,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[]
) => {
  const gameDeckHandler = () =>
    deck.gameDeckHandler(
      playerHandEvent,
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )

  const playerOutput = playerMatch(
    playerHandEvent,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs,
    shuffledDeck
  )

  dispatchGameAction({
    type: "PLAYER_ACTION",
    playerOutput,
    playerHand,
    playerPairs,
  })
  dispatchGameAction({ type: "GAME_LOG" })

  const gameOverCheck = pairs.gameOver(
    shuffledDeck,
    playerHand,
    opponentHand,
    playerPairs,
    opponentPairs
  )

  if (!gameOverCheck) {
    if (playerOutput === false) {
      const log = (
        <p class="game__log">
          You didn't match with any card in your opponent's hand. Please deal a
          card from the deck.
        </p>
      )

      const playerHandUnclickable = true
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        shuffledDeck,
        playerHandUnclickable
      )
      setGameDeck(deck.gameDeckUI(gameDeckHandler))
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export const playerResponseHandler = (
  response,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked,
  playerAnswerHandler,
  yesButton,
  noButton
) => {
  const opponentTurn = () =>
    opponent.opponentTurn(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs
    )

  let log

  if (response.target.value === "yes") {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = (
          <p class="game__log">
            Please select the card with the same value as the one your opponent
            requested. Then it will be your opponent's turn again.
          </p>
        )
        dispatchGameAction({ type: "GAME_LOG", log })
        dispatchGameAction({
          type: "PLAYER_ANSWER",
          playerHand,
          opponentAsked,
          playerAnswerHandler,
        })
        return
      }
    }
    log = (
      <p class="game__log">
        Are you sure? Do you have a {opponentAsked.value}?
      </p>
    )
    dispatchGameAction({
      type: "GAME_LOG",
      yesButton,
      noButton,
      log,
    })
    return
  }
  if (response.target.value === "no") {
    for (const card of playerHand) {
      if (card.value === opponentAsked.value) {
        log = (
          <p class="game__log">
            Are you sure? Do you have a {opponentAsked.value}?
          </p>
        )
        dispatchGameAction({
          type: "GAME_LOG",
          yesButton,
          noButton,
          log,
        })
        return
      }
    }

    const opponentOutput = opponent.opponentDealt(
      shuffledDeck,
      playerHand,
      opponentHand,
      playerPairs,
      opponentPairs,
      opponentAsked
    )

    if (opponentOutput === 0) {
      const playerHandUnclickable = true
      pairs.updateUI(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        shuffledDeck,
        playerHandUnclickable
      )
      log = (
        <p class="game__log">
          Your opponent has dealt a card from the deck and the value they chose
          matched with the dealt card's value. It's your opponent's turn again.
        </p>
      )
      dispatchGameAction({ type: "GAME_LOG", log })
      setTimeout(opponentTurn, 4000)
    }
    if (opponentOutput === 1) {
      log = (
        <p class="game__log">
          Your opponent has dealt a card from the deck. The value they chose did
          not match with the dealt card's value but they matched with another
          card in their deck. It's your turn.
        </p>
      )
    }
    if (opponentOutput === 2) {
      log = (
        <p class="game__log">
          Your opponent has dealt a card from the deck and added it to their
          hand. There were no matches. It's your turn.
        </p>
      )
    }
  }
  dispatchGameAction({ type: "GAME_LOG", log })
}

export const playerAnswerHandler = (
  playerHandEvent,
  shuffledDeck: card[],
  playerHand: card[],
  opponentHand: card[],
  playerPairs: card[],
  opponentPairs: card[],
  opponentAsked
) => {
  let chosenCard

  for (const card of playerHand) {
    if (card.id === playerHandEvent.target.id) chosenCard = card
  }

  if (chosenCard) {
    if (chosenCard.value === opponentAsked.value) {
      opponent.opponentMatch(
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs,
        opponentAsked,
        playerHandEvent,
        shuffledDeck
      )
      opponent.opponentTurn(
        shuffledDeck,
        playerHand,
        opponentHand,
        playerPairs,
        opponentPairs
      )
    } else if (chosenCard.value !== opponentAsked.value) {
      const log = (
        <p class="game__log">
          That card does not have the value that your opponent requested. Please
          select the card with the value your opponent requested. Your opponent
          requested a {opponentAsked.value}.
        </p>
      )
      dispatchGameAction({ type: "GAME_LOG", log })
    }
  }
}

export default {
  playerMatch,
  playerDealt,
  playerTurnHandler,
  playerResponseHandler,
  playerAnswerHandler,
}
