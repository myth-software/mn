export function flattenCover(
  cover:
    | {
        type: 'external';
        external: {
          url: string;
        };
      }
    | {
        type: 'file';
        file: {
          url: string;
          expiry_time: string;
        };
      }
    | null
) {
  if (!cover) {
    return '';
  }
  if (cover.type === 'external') {
    return cover.external.url;
  }

  if (cover.type === 'file') {
    return cover.file.url;
  }

  throw new Error('could not flatten cover');
}
