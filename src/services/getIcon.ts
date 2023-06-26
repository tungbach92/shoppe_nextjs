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
};
