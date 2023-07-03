// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'mount notion',
  tagline: 'feel type-serenity, rise above the cloud, experience true peace',
  favicon: 'img/favicon.ico',
  url: 'https://mountnotion.com',
  baseUrl: '/',
  organizationName: 'myth-software',
  projectName: 'mountnotion',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: 'sidebars.js',
          editUrl:
            'https://github.com/myth-software/mountnotion/tree/main/packages/',
          breadcrumbs: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'mount notion',
        logo: {
          alt: 'mount notion',
          src: 'img/logo.svg',
        },
        items: [
          // {
          //   label: 'cli',
          //   position: 'left',
          //   to: '/cli',
          // },
          // {
          //   label: 'sdk',
          //   position: 'left',
          //   to: '/sdk',
          // },
          // {
          //   label: 'schematics',
          //   position: 'left',
          //   to: '/schematics',
          //   sidebarId: 'schematicsSidebar',
          // },
          {
            href: 'https://github.com/myth-software/mountnotion',
            label: 'github',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'docs',
            items: [
              {
                label: 'home',
                to: '/',
              },
            ],
          },
          {
            title: 'community',
            items: [
              {
                label: 'stack overflow',
                href: 'https://stackoverflow.com/questions/tagged/mountnotion',
              },
              {
                label: 'notion developers slack',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'reddit',
                href: 'https://reddit.com/r/mountnotion',
              },
            ],
          },
          {
            title: 'more',
            items: [
              {
                label: 'myth software',
                href: 'https://myth.software',
              },
              {
                label: 'github',
                href: 'https://github.com/myth-software/mountnotion',
              },
            ],
          },
        ],
        copyright: '© 2022-2023 myth software, llc. all rights reserved.',
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
