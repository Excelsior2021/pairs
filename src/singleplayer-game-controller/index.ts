import { Action, Outcome, PlayerOutput } from "@enums"

import type { card, handleAction, player } from "@types"

export class GameController {
  deck: card[]
  handleAction: handleAction
  initialHandSize: number
  player: player
  opponent: player
  playerChosenCard: card | null
  opponentChosenCard: card | null
  playerTurnHandler
  playerResponseHandler
  playerDealsHandler
  setOpponentTurn
  dealFromDeck

  constructor(deck: card[], handleAction: handleAction, initialHandSize = 7) {
    this.deck = structuredClone(deck)
    this.initialHandSize = initialHandSize
    this.player = {
      hand: [],
      pairs: [],
    }
    this.opponent = {
      ...this.player,
    }
    this.playerChosenCard = null
    this.opponentChosenCard = null
    this.handleAction = handleAction
    this.playerTurnHandler = (chosenCard: MouseEvent) =>
      this.playerTurn(chosenCard)
    this.playerResponseHandler = (hasCard: boolean) =>
      this.playerResponse(hasCard)
    this.playerDealsHandler = () => this.playerDeals()
    this.setOpponentTurn = () => setTimeout(() => this.opponentTurn(), 2000)
    this.dealFromDeck = () => this.deck.pop()
  }

  shuffleDeck() {
    for (const x in this.deck) {
      const y = Math.floor(Math.random() * parseInt(x))
      const temp = this.deck[x]
      this.deck[x] = this.deck[y]
      this.deck[y] = temp
    }
  }

  start(log: string) {
    this.shuffleDeck()

    this.player.hand = this.deck.splice(0, this.initialHandSize)
    this.opponent.hand = this.deck.splice(0, this.initialHandSize)

    this.player.pairs = this.initialPairs(this.player.hand)
    this.opponent.pairs = this.initialPairs(this.opponent.hand)

    this.updateUI(log, true)
  }

  initialPairs(hand: card[]) {
    const pairs: card[] = []
    hand.forEach(cardX =>
      hand.some(cardY => {
        if (
          cardX.value === cardY.value &&
          cardX.suit !== cardY.suit &&
          !pairs.includes(cardX) &&
          !pairs.includes(cardY)
        )
          pairs.push(cardX, cardY)
      })
    )

    pairs.forEach(cardP =>
      hand.some(cardH => {
        if (cardP === cardH) hand.splice(hand.indexOf(cardH), 1)
      })
    )
    return pairs
  }

  playerTurnOutput() {
    if (this.playerChosenCard) {
      for (const card of this.opponent.hand) {
        if (card.value === this.playerChosenCard.value) {
          this.player.pairs.push(card)
          this.opponent.hand.splice(this.opponent.hand.indexOf(card), 1)

          for (const card of this.player.hand) {
            if (this.playerChosenCard.id === card.id) {
              this.player.pairs.push(card)
              this.player.hand.splice(this.player.hand.indexOf(card), 1)
              this.handleAction({
                type: Action.PLAYER_ACTION,
                playerOutput: PlayerOutput.OpponentMatch,
              })
              this.updateUI("", true)
              this.playerChosenCard = null
              return
            }
          }
        }
      }
      const log =
        "You didn't match with any card in your opponent's hand. Please deal a card from the deck."
      this.updateUI(log, false, false, true)
    }
  }

  playerTurn(playerChosenCardEvent: MouseEvent) {
    const eventTarget = playerChosenCardEvent.target as HTMLImageElement

    for (const card of this.player.hand)
      if (card.id === eventTarget.id) {
        this.playerChosenCard = card
        break
      }

    this.playerTurnOutput()
  }

  playerResponse(hasCard: boolean) {
    if (this.opponentChosenCard) {
      if (hasCard) {
        for (const card of this.player.hand) {
          if (card.value === this.opponentChosenCard.value) {
            this.opponent.pairs.push(this.opponentChosenCard)
            this.opponent.hand.splice(
              this.opponent.hand.indexOf(this.opponentChosenCard),
              1
            )

            this.opponent.pairs.push(card)
            this.player.hand.splice(this.player.hand.indexOf(card), 1)

            const log = "It's your opponent's turn again."
            this.updateUI(log)

            //opponent's turn again
            this.setOpponentTurn()
            return
          }
        }
        const log = `Are you sure? Do you have a ${this.opponentChosenCard.value}?`

        this.updateUI(log, false, true)
        return
      } else {
        for (const card of this.player.hand) {
          if (card.value === this.opponentChosenCard.value) {
            const log = `Are you sure? Do you have a ${this.opponentChosenCard.value}?`

            this.updateUI(log, false, true)
            return
          }
        }

        this.opponentDeals()
      }
    }
  }

  playerDeals() {
    const playerOutput = this.playerDealsOutput()

    this.handleAction({
      type: Action.PLAYER_ACTION,
      playerOutput,
    })

    if (playerOutput === PlayerOutput.DeckMatch) this.updateUI("", true)

    if (
      playerOutput === PlayerOutput.HandMatch ||
      playerOutput === PlayerOutput.NoMatch
    )
      this.opponentTurn()
  }

  playerDealsOutput() {
    const dealtCard = this.dealFromDeck()

    if (this.playerChosenCard && dealtCard) {
      if (this.playerChosenCard.value === dealtCard.value) {
        this.player.pairs.push(dealtCard)
        for (const card of this.player.hand) {
          if (this.playerChosenCard.id === card.id) {
            this.player.pairs.push(card)
            this.player.hand.splice(this.player.hand.indexOf(card), 1)
            return PlayerOutput.DeckMatch
          }
        }
      }
      //if no deck match, continue

      this.playerChosenCard = null

      for (const card of this.player.hand) {
        if (dealtCard.value === card.value) {
          this.player.pairs.push(dealtCard)
          this.player.pairs.push(card)
          this.player.hand.splice(this.player.hand.indexOf(card), 1)
          return PlayerOutput.HandMatch
        }
      }
      //if no hand match, continue

      this.player.hand.push(dealtCard)
      return PlayerOutput.NoMatch
    }
  }

  opponentDeals() {
    const dealtCard = this.dealFromDeck()

    if (dealtCard && this.opponentChosenCard) {
      if (dealtCard.value === this.opponentChosenCard.value) {
        const requestedCardIndex = this.opponent.hand.indexOf(
          this.opponentChosenCard
        )
        this.opponent.pairs.push(dealtCard)
        this.opponent.pairs.push(this.opponentChosenCard)
        console.log("hello")
        if (requestedCardIndex !== -1)
          this.opponent.hand.splice(requestedCardIndex, 1)

        const log =
          "Your opponent has dealt a card from the deck and matched with the dealt card. It's your opponent's turn again."
        this.updateUI(log)

        //opponent's turn again
        this.setOpponentTurn()
        return
      }

      for (const card of this.opponent.hand) {
        if (dealtCard.value === card.value) {
          const handMatchIndex = this.opponent.hand.indexOf(card)
          this.opponent.pairs.push(dealtCard)
          this.opponent.pairs.push(card)
          if (handMatchIndex !== -1)
            this.opponent.hand.splice(handMatchIndex, 1)

          const log =
            "Your opponent has dealt a card from the deck. They didn't match with the dealt card but they had a hand match. It's your turn."
          this.updateUI(log, true)
          return
        }
      }

      this.opponent.hand.push(dealtCard)
      const log =
        "Your opponent has dealt a card from the deck and added it to their hand. There were no matches. It's your turn."
      this.updateUI(log, true)
    }
  }

  opponentTurn() {
    this.opponentChosenCard =
      this.opponent.hand[Math.floor(Math.random() * this.opponent.hand.length)]

    if (this.opponentChosenCard) {
      const log = `Do you have a ${this.opponentChosenCard.value}?`
      this.updateUI(log, false, true)
    }
  }

  updateUI(
    log = "",
    isPlayerTurn = false,
    isOpponentTurn = false,
    isDealFromDeck = false
  ) {
    const player = { hand: this.player.hand, pairs: this.player.pairs }
    const opponent = {
      hand: this.opponent.hand,
      pairs: this.opponent.pairs,
    }

    this.handleAction({
      type: Action.UPDATE,
      log,
      player,
      opponent,
      isPlayerTurn,
      isOpponentTurn,
      isDealFromDeck,
      deckCount: this.deck.length,
    })

    //game over check
    this.over()
  }

  over() {
    if (
      this.player.hand.length === 0 ||
      this.opponent.hand.length === 0 ||
      this.deck.length === 0
    ) {
      let outcome: Outcome

      if (this.player.pairs.length > this.opponent.pairs.length)
        outcome = Outcome.Player
      else if (this.player.pairs.length < this.opponent.pairs.length)
        outcome = Outcome.Opponent
      else outcome = Outcome.Draw

      this.handleAction({
        type: Action.GAME_OVER,
        log: "",
        outcome,
        deckCount: this.deck.length,
      })
    }
  }
}
