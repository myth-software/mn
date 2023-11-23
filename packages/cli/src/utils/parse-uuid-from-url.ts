export default function parseUuidFromUrl(url: string): string | null {
  const regex =
    /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/;
  const regexWithoutHyphens =
    /([a-f0-9]{8})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{4})([a-f0-9]{12})/;
  const match = url.match(regex);
  const matchWithoutHyphens = url.match(regexWithoutHyphens);

  if (match) {
    return match[1];
  }

  if (matchWithoutHyphens) {
    const [, a, b, c, d, e] = matchWithoutHyphens;
    return `${a}-${b}-${c}-${d}-${e}`;
  }

  return match ? match[1] : null;
}
