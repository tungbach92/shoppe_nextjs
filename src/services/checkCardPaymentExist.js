import axios from "../configs/axios";

export const checkCardPaymentExist = async (
  stripe,
  cardEl,
  paymentMethodList
) => {
  try {
    const tokenClientSide = await stripe.createToken(cardEl);
    //create card object to retrieve fingerprint since can't get it from client side token(even with sk)
    const tokenServerSideRes = await axios({
      method: "POST",
      url: "/create-token-server-side",
      data: { tokenClientSideID: tokenClientSide.token.id },
    });
    const tokenServerSide = tokenServerSideRes.data.tokenResult;
    return paymentMethodList.some(
      (item) =>
        item.card.fingerprint === tokenServerSide.card.fingerprint &&
        item.card.exp_month === tokenServerSide.card.exp_month &&
        item.card.exp_year === tokenServerSide.card.exp_year
    );
  } catch (error) {
    alert("checkCardPaymentExist:" + error.message);
  }
};
