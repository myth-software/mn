/**
 *
 * @param title a title from notion
 * @returns that title without forward slashes in titles that sometimes get used in filenames
 */
export function santitizeTitle(title: string) {
  return title.replace('/', ' ');
}
