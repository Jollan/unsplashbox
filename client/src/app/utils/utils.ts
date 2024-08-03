export function rearrangeImages<T extends { height: number }>(images: T[]) {
  let tabIndex = 0;
  const output: T[][] = [[], [], [], []];
  for (let index = 0; index < images.length; index++) {
    output[tabIndex].push(images[index]);
    if (output.every((tab) => tab.length)) {
      const tabHeights = output.map((images) => {
        return images.reduce((acc, image) => acc + image.height, 0);
      });
      tabIndex = tabHeights.findIndex((h) => h === Math.min(...tabHeights));
    } else tabIndex += 1;
  }
  return output;
}
