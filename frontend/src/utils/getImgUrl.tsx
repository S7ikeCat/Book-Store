export const getImgUrl = (img: string): string => {
    return new URL(`../assets/books/${img}`, import.meta.url).href
  }
  