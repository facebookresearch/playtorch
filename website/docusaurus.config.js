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
  title:
    'Share, discover and use machine learning models. Unlock the vast potential of AI innovations.',
  url: 'https://facebookexperimental.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'facebookexperimental',
  projectName: 'pytorch-live',
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    navbar: {
      title: '',
      logo: {
        alt: 'PyTorch Live Logo',
        src: 'img/PyTorchLive_Logo.png',
        href: 'https://pytorch.org',
        target: '_self',
      },
      items: [
        {
          href: '/',
          position: 'right',
          label: 'Home',
        },
        {
          to: 'showcase',
          position: 'right',
          label: 'Showcase',
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
          title: 'PyTorch Live',
          items: [
            {
              label: 'Home',
              to: '/',
            },
            {
              label: 'Showcase',
              to: '/showcase',
            },
            {
              label: 'Tutorials',
              to: '/docs/tutorials/get-started',
            },
            {
              label: 'API',
              to: '/docs/api/core',
            },
            {
              label: 'PyTorch',
              to: 'https://pytorch.org',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/pytorch/live/',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/pytorch-live',
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
    googleAnalytics: {
      trackingID: 'UA-117752657-2',
      anonymizeIP: true,
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
        tsconfig: '../react-native-pytorch-core/tsconfig.build.json',
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
