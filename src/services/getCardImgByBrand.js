import {iconImg} from "@/services/getIcon";

export const getCardImgByBrand = (brand) => {
  if (brand === "visa") {
    return iconImg.visaIcon;
  }
  if (brand === "american Express") {
    return iconImg.expressIcon;
  }
  if (brand === "mastercard") {
    return iconImg.masterIcon;
  }
  if (brand === "jcb") {
    return iconImg.jcbIcon;
  }
  return iconImg.noBrandIcon;
};
