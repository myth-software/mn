export function flattenPeople(
  people: {
    id: string;
    name?: string;
  }[]
) {
  if (people.length === 0) {
    return 'no person';
  }

  return people.map((person) => person.name ?? person.id).join(' ');
}
