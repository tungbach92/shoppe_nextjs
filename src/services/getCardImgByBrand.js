import visaImg from "../img/visa.png";
import masterImg from "../img/master.png";
import jcbImg from "../img/jcb.png";
import expressImg from "../img/express.png";
import nobrand from "../img/nobrand.png";
export const getCardImgByBrand = (brand) => {
  if (brand === "visa") {
    return visaImg;
  }
  if (brand === "american Express") {
    return expressImg;
  }
  if (brand === "mastercard") {
    return masterImg;
  }
  if (brand === "jcb") {
    return jcbImg;
  }
  return nobrand;
};
