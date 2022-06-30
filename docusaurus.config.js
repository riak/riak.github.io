// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Riak',
  tagline: 'Documentation for Riak KV 2.2.3+',
  url: 'https://www.riak.github.io',
  baseUrl: '/riak_docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/branding/favicon.ico',
  organizationName: 'riak', // Usually your GitHub org/user name.
  projectName: 'riak.github.io', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/riak/riak.github.io/',
          remarkPlugins: [require('mdx-mermaid')],
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/riak/riak.github.io/',
          remarkPlugins: [require('mdx-mermaid')],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Riak KV',
        logo: {
          alt: 'Riak Logo',
          src: 'images/branding/riak-logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/releases', label: 'Releases', position: 'left'},
          {
            href: 'https://github.com/basho/',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Riak KV Documentation',
                to: '/docs/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/basho',
              },
              {
                label: 'GitHub Discussions',
                href: 'https://github.com/basho/riak/discussions',
              },
              {
                label: 'Slack',
                href: 'https://postriak.slack.com/',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/riak',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Releases',
                to: '/releases',
              }
            ],
          },
        ],
        copyright: `Copyright Riak © ${new Date().getFullYear()}. Apache 2.0. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['java', 'erlang', 'ruby', 'scala', 'java', 'protobuf', 'csharp', 'php', 'nginx'],
      },
    }),
};

module.exports = config;
