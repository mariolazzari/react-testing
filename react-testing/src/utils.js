export const range = (start, end) =>
  [...Array(end - start).keys()].map(el => el + start);
