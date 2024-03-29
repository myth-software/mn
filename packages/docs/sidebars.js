// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  schematicsSidebar: [
    {
      type: 'doc',
      id: 'home',
    },
    {
      type: 'doc',
      id: 'configuration',
    },
    {
      type: 'category',
      label: 'cli',
      link: { type: 'generated-index', slug: 'cli' },
      items: [
        {
          type: 'category',
          label: 'awesome commands',
          link: {
            type: 'generated-index',
            slug: 'cli/awesome-commands',
          },
          items: [{ type: 'autogenerated', dirName: 'cli/awesome-commands' }],
        },
        {
          type: 'category',
          label: 'commands',
          link: {
            type: 'generated-index',
            slug: 'cli/commands',
          },
          items: [{ type: 'autogenerated', dirName: 'cli/commands' }],
        },
      ],
    },
    {
      type: 'category',
      label: 'schematics',
      link: {
        type: 'generated-index',
        slug: 'schematics',
        description: 'code generation from drizzle to zod',
      },
      items: [{ type: 'autogenerated', dirName: 'schematics' }],
    },
    {
      type: 'category',
      label: 'sdk',
      link: {
        type: 'generated-index',
        slug: 'sdk',
        description: "the notion sdk that's better than the notion sdk",
      },
      items: [{ type: 'autogenerated', dirName: 'sdk' }],
    },
  ],
};

module.exports = sidebars;
