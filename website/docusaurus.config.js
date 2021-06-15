/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const katex = require('rehype-katex');
const math = require('remark-math');
const npm2yarn = require('@docusaurus/remark-plugin-npm2yarn');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Making AI easier to use, for everyone.',
  url: 'https://facebookexperimental.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebookexperimental',
  projectName: 'pytorch-live',
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: '',
      logo: {
        alt: 'PyTorch Live Logo',
        src: 'img/PyTorchLive_Logo.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'tutorials/install-cli',
          position: 'left',
          label: 'Tutorial',
        },
        {
          type: 'doc',
          position: 'left',
          docId: 'api/core/index',
          label: 'API',
        },
        {
          href: 'https://github.com/facebookexperimental/pytorch-live',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
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
              label: 'Tutorial',
              to: '/docs/tutorials/image-classification',
            },
            {
              label: 'Model Specification',
              to: '/docs/api/model-spec',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/pytorch-live',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
        {
          title: 'Legal',
          // Please do not remove the privacy and terms, it's a legal requirement.
          items: [
            {
              label: 'Privacy',
              href: 'https://opensource.facebook.com/legal/privacy/',
              target: '_blank',
              rel: 'noreferrer noopener',
            },
            {
              label: 'Terms',
              href: 'https://opensource.facebook.com/legal/terms/',
              target: '_blank',
              rel: 'noreferrer noopener',
            },
          ],
        },
      ],
      logo: {
        alt: 'Facebook Open Source Logo',
        src: 'img/oss_logo.png',
        href: 'https://opensource.facebook.com',
      },
      // Please do not remove the credits, help to publicize Docusaurus :)
      copyright: `Copyright © ${new Date().getFullYear()} Facebook, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      require.resolve('docusaurus-plugin-internaldocs-fb/docusaurus-preset'),
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [[npm2yarn, {sync: true}], math],
          rehypePlugins: [katex],
          editUrl:
            'https://github.com/facebookexperimental/pytorch-live/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        name: 'React Native PyTorch Core',
        entryPoints: ['../react-native-pytorch-core/src'],
        out: 'api/core',
        exclude: [
          '../react-native-pytorch-core/src/index.tsx',
          '../react-native-pytorch-core/**/__tests__',
          '../react-native-pytorch-core/**/example',
        ],
        tsconfig: '../react-native-pytorch-core/tsconfig.json',
        excludePrivate: true,
        excludeProtected: true,
        excludeExternals: true,
        excludeInternal: true,
        namedParamName: 'props',
        readme: 'none',
        plugin: ['typedoc-plugin-param-names'],
        sidebar: {
          sidebarFile: 'typedoc-sidebar.js',
          fullNames: false,
          indexLabel: 'Overview',
        },
        watch: process.env.TYPEDOC_WATCH,
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc',
      crossorigin: 'anonymous',
    },
  ],
};
