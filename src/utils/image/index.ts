export function getUriPublicImage(name: string) {
  return `/images${name}`;
}

export function getUriPublicImageFolder(
  name: string | undefined,
  folder: string
) {
  return `/${folder}/${name}`;
}
