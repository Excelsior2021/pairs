const deckImages = () => {
  const images = []
  const non_num_cards = ["ace", "jack", "queen", "king"]
  const suits = ["clubs", "diamonds", "hearts", "spades"]

  for (const x of [...Array(9).keys()]) {
    for (const suit of suits) {
      const id = `${x + 2}_of_${suit}`
      const img = `./src/assets/cards/${id}.png`
      images.push(img)
    }
  }

  for (const value of non_num_cards) {
    if (value !== "ace") {
      for (const suit of suits) {
        const id = `${value}_of_${suit}`
        const img = `./src/assets/cards/${id}.png`
        images.push(img)
      }
    }
  }

  for (const suit of suits.reverse()) {
    const id = `ace_of_${suit}`
    const img = `./src/assets/cards/${id}.png`
    images.unshift(img)
  }
  return images
}

export default deckImages()
