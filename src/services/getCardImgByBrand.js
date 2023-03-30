import visaImg from "../../public/img/visa.png";
import masterImg from "../../public/img/master.png";
import jcbImg from "../../public/img/jcb.png";
import expressImg from "../../public/img/express.png";
import nobrand from "../../public/img/nobrand.png";
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
