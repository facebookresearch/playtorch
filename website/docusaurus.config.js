/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const {fbContent} = require('docusaurus-plugin-internaldocs-fb/internal');
const katex = require('rehype-katex');
const math = require('remark-math');
const npm2yarn = require('@docusaurus/remark-plugin-npm2yarn');
const path = require('path');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'PlayTorch is a framework for rapidly creating mobile AI experiences.',
  url: 'https://playtorch.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'pytorch',
  projectName: 'live',
  trailingSlash: true,
  scripts: [{src: 'https://snack.expo.dev/embed.js', defer: true}],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: '',
      logo: {
        alt: 'PlayTorch Logo',
        src: 'img/PlayTorch_Logo_P.svg',
        href: '/',
        target: '_self',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          type: 'doc',
          docId: 'tutorials/get-started',
          position: 'right',
          label: 'Tutorials',
        },
        {
          type: 'doc',
          position: 'right',
          docId: 'api/core/index',
          label: 'API',
        },
        {
          to: 'community',
          position: 'right',
          label: 'Community',
        },
        {
          to: 'faq',
          position: 'right',
          label: 'FAQ',
        },
        {
          href: 'https://github.com/facebookresearch/playtorch',
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
          title: 'PlayTorch Logo',
          items: [],
        },
        {
          title: 'PlayTorch',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/tutorials/get-started',
            },
            {
              label: 'API',
              to: '/docs/api/core',
            },
            {
              label: 'Community',
              to: '/community',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebookresearch/playtorch',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/playtorch',
            },
          ],
        },
        {
          title: 'Legal',
          // Please do not remove the privacy and terms, it's a legal requirement.
          items: [
            {
              label: 'Privacy',
              href: 'https://opensource.fb.com/legal/privacy/',
              target: '_blank',
              rel: 'noreferrer noopener',
            },
            {
              label: 'Terms',
              href: 'https://opensource.fb.com/legal/terms/',
              target: '_blank',
              rel: 'noreferrer noopener',
            },
          ],
        },
      ],
      logo: {
        alt: 'Meta Open Source Logo',
        src: 'img/oss_logo.svg',
        href: 'https://opensource.fb.com',
      },
      // Please do not remove the credits, help to publicize Docusaurus :)
      copyright: `Copyright © ${new Date().getFullYear()} Meta, Inc. Built with Docusaurus.`,
    },
    algolia: {
      appId: 'A90B6S14WY',
      apiKey: '5227766858b1a76cee0a6e1e82db00db',
      indexName: 'pytorch-live',
      contextualSearch: true,
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
          editUrl: fbContent({
            internal:
              'https://www.internalfb.com/code/fbsource/xplat/pytorch/live/website',
            external:
              'https://github.com/facebookresearch/playtorch/edit/main/website',
          }),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'G-703RV77NHN',
        },
      },
    ],
  ],
  plugins: [
    [
      path.resolve(__dirname, 'plugin-dynamic-routes'),
      {
        routes: [
          {
            path: '/expo',
            exact: false,
            component: '@site/src/components/ExpoSnackRouter',
          },
          {
            path: '/snack',
            exact: false,
            component: '@site/src/components/ExpoSnackRouter',
          },
          {
            path: '/example',
            exact: false,
            component: '@site/src/components/ExampleRouter',
          },
        ],
      },
    ],
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
        tsconfig: '../react-native-pytorch-core/tsconfig.build.json',
        disableSources: true,
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
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/tutorials/get-started/',
            from: '/tutorials',
          },
        ],
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
  customFields: {
    discordUrl: 'https://discord.gg/sQkXTqEt33',
    githubUrl: 'https://github.com/facebookresearch/playtorch',
    githubShowcaseUrl:
      'https://github.com/facebookresearch/playtorch/issues/new?assignees=&labels=Use%20Case&template=use_case.yml',
    twitterTagUrl: 'https://twitter.com/search?q=%23playtorch',
    stackoverflowTagUrl: 'https://stackoverflow.com/questions/tagged/playtorch',
  },
};
