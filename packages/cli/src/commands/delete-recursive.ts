import { notion } from '@mountnotion/sdk';
import { MountnCommand } from '@mountnotion/types';

export default {
  name: 'delete-recursive',
  description: 'delete page and relations recursively',
  options: [],
  actionFactory: () => async () => {
    const page_id = '';
    const foundPages: string[] = [];
    return deleteRecursive(page_id);

    async function deleteRecursive(pageId: string) {
      if (foundPages.includes(pageId)) {
        return;
      }

      foundPages.push(pageId);
      const [page, properties] = await notion.pages.retrieve<{
        page_id: string;
        name: string;
      }>({ page_id: pageId }, { flattenResponse: true, resultsOnly: true });
      const relationNames = Object.entries(properties)
        .filter(([, type]) => type === 'relation')
        .map(([name]) => name);
      const relatedPages = Object.entries(page)
        .filter(([property]) => relationNames.includes(property))
        .flatMap(([, value]) => (Array.isArray(value) ? value : []));

      while (relatedPages.length) {
        const relatedId = relatedPages.shift();

        await deleteRecursive(relatedId);
      }

      await notion.blocks.delete({ block_id: pageId });
    }
  },
} satisfies MountnCommand;
