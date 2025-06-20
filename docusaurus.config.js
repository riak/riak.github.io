// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import {themes as prismThemes} from 'prism-react-renderer';
import devVersion from './dev_version.json';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Riak',
  tagline: 'Documentation for Riak KV 2.0.0+',
  url: 'https://www.riak.github.io',
  // At bet365 we have an internal mirror that uses a different base URL.
  baseUrl: process.env.BET365_BASE_URL !== undefined ? process.env.BET365_BASE_URL : '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/branding/favicon.ico',
  organizationName: 'riak', // Usually your GitHub org/user name.
  projectName: 'riak.github.io', // Usually your repo name.
  future: {
    v4: true, 
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      ssgWorkerThreads: true,
    }
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // At bet365 we have an internal mirror, use that URL to edit instead.
          editUrl: ({ versionDocsDirPath, docPath }) => {
            const editUrl = process.env.BET365_EDIT_URL !== undefined
                ? process.env.BET365_EDIT_URL
                : 'https://github.com/riak/riak.github.io/edit';

            return `${editUrl}/main/${versionDocsDirPath}/${docPath}`;
          },
          // Disable versioning if in dev mode and using the start:fast task OR using build:fast
          disableVersioning: (process.env.NODE_ENV === 'development' && !!process.env.START_FAST) || !!process.env.BUILD_FAST,
          lastVersion: 'current',
          versions: {
            current: {
              label: devVersion.version,
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/riak/riak.github.io/',
        },
        theme: {
          customCss: './src/css/custom.css',
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
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
            dropDownItemsAfter: [{to: '/versions', label: 'All versions'}],
          },
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
              }
            ],
          },
        ],
        copyright: `Copyright Riak © ${new Date().getFullYear()}. Apache 2.0. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'erlang', 'ruby', 'scala', 'java', 'protobuf', 'csharp', 'php', 'nginx'],
      },
      algolia: {
        appId: '4J7JPH644V',
        apiKey: '84a663c289be29766d05b6dce740cad5',
        indexName: 'riakio',
      }
    }),
    markdown: {
      mermaid: true,
    },
};

module.exports = config;
