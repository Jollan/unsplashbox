export function rearrangeImages<T extends { height: number }>(
  source: T[],
  images?: T[][]
) {
  let tabIndex: number | null = null;
  const output = images?.length ? images : [[], [], [], []];
  for (let index = 0; index < source.length; index++) {
    if (output.every((tab) => tab.length)) {
      const tabHeights = output.map((images) => {
        return images.reduce((acc, image) => acc + image.height, 0);
      });
      tabIndex = tabHeights.findIndex((h) => h === Math.min(...tabHeights));
    }
    output[tabIndex ?? index].push(source[index]);
  }
  return source.length ? output : images ?? [];
}

// export function groupImages<T extends { height: number }>(images: T[]) {
//   let tabIndex = 0;
//   const output: T[][] = [[], [], [], []];
//   for (let index = 0; index < images.length; index++) {
//     output[tabIndex].push(images[index]);
//     tabIndex = ++tabIndex === output.length ? 0 : tabIndex;
//   }
//   return images.length ? output : [];
// }
