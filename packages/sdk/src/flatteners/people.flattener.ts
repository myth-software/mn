export function flattenPeople(
  people: {
    name: string;
  }[]
) {
  if (people.length === 0) {
    return 'no person';
  }

  return people.map(({ name }) => name).join(' ');
}
