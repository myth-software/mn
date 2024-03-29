import { notion } from '@mountnotion/sdk';
import { MountnCommand } from '@mountnotion/types';
import { log } from '@mountnotion/utils';

export type DeleteRecursiveOptions = {
  pageId: string;
};

function assert(
  condition: unknown,
  msg?: string
): asserts condition is DeleteRecursiveOptions {
  if (typeof condition !== 'object') {
    throw new Error(msg);
  }
}

export default {
  name: 'delete-recursive',
  description: 'delete page and relations recursively',
  options: [
    {
      name: '--page-id <id>',
      description: 'page id for deleting',
    },
  ],
  actionFactory: () => async (options) => {
    assert(options);
    const { pageId } = options;
    log.debug({ action: 'debugging', message: `page_id: ${pageId}` });
    const foundPages: string[] = [];
    return deleteRecursive(pageId);

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
