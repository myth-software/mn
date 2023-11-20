import { notion } from '@mountnotion/sdk';
export async function getDatabaseIdsInWorkspace(pageId: string) {
  const allResponses = await notion.blocks.children.listAll({
    block_id: pageId,
    page_size: 100,
  });
  const ids = allResponses
    .flatMap(({ results }) => results as { type: string; id: string }[])
    .filter((result) => result.type === 'child_database')
    .map(({ id }) => id);

  return ids;
}
