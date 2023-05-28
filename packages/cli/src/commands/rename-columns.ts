import { flattenDatabaseResponse, notion } from '@mountnotion/sdk';
import { LogInput, MountnCommand } from '@mountnotion/types';
import { ensure } from '@mountnotion/utils';
import { printPhraseList } from '../utils';

export default {
  name: 'rename-columns',
  description: 'rename all matching columns',
  options: [],
  actionFactory: () => async () => {
    const page_id = ensure(process.env['PAGE_ID']);
    const fromColumnName = 'owner attorney';
    const toColumnName = 'customer';
    const allResponses = await notion.blocks.children.listAll({
      block_id: page_id,
      page_size: 100,
    });
    const ids = allResponses
      .flatMap(({ results }) => results as any[])
      .filter((result) => result.type === 'child_database')
      .map(({ id }) => id);
    const rename = [];
    while (ids.length) {
      const database_id = ids.splice(0, 1)[0];
      const database = await notion.databases.retrieve({ database_id });

      if (database.properties[fromColumnName]) {
        await notion.databases.update({
          database_id,
          properties: {
            [fromColumnName]: {
              name: toColumnName,
            },
          },
        });

        const flat = flattenDatabaseResponse(database);
        rename.push({
          title: flat.title,
          icon: flat.icon,
          from: fromColumnName,
          to: toColumnName,
        });
      }
    }

    const phraseList: LogInput[] = rename.map((n) => ({
      page: {
        emoji: n.icon,
        title: n.title,
      },
      message: `from ${n.from} to ${n.to}`,
      action: 'rename',
    }));
    phraseList.forEach(printPhraseList);
  },
} satisfies MountnCommand;
