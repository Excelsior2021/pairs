//none of these functions are being used in the app at the moment
//no testing required

export const getValue = card => card.value;

export const getSuit = card => card.suit;

export const sameValue = (card1, card2) => card1.value === card2.value;

export const sameSuit = (card1, card2) => card1.suit === card2.suit;

export default {
  getValue,
  getSuit,
  sameValue,
  sameSuit,
};
