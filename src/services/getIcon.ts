import {getUriPublicImageFolder} from "@/utils/image";

const folder = "img";

function getUri(name: string) {
  return getUriPublicImageFolder(name, folder);
}

export const iconImg = {
  noCartIcon: getUri("no-cart.png"),
  protectIcon: getUri("protect.png"),
  visaIcon: getUri("visa.png"),
  noBrandIcon: getUri("nobrand.png"),
  jcbIcon: getUri("jcb.png"),
  masterIcon: getUri("master.png"),
  expressIcon: getUri("express.png"),
  qrCodeNavImg: getUri('qr-code-home.png'),
  appShopeeImg: getUri("app-shopee.png"),
  ggShopeeImg: getUri("gg-shopee.png"),
  appGalShopeeImg: getUri("app-gal-shopee.png")
};
