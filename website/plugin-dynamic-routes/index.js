/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

const path = require('path');

/**
 * A plugin to allow for "dynamic" routes. This will allow the component
 * specified in the route to use react-router-dom and custom route matches to
 * render particluar components
 *
 * ```javascript
 * plugins: [
 *   [
 *     path.resolve(__dirname, 'plugin-dynamic-routes'),
 *     {
 *       // this is the options object passed to the plugin
 *       routes: [
 *         {
 *           // using Route schema from react-router
 *           path: '/my-path',
 *           exact: false, // this is needed for sub-routes to match!
 *           component: '@site/src/components/CustomComponent',
 *         },
 *       ],
 *     },
 *   ],
 * ]
 * ```
 */

/**
 * This is a custom docusaurus plugin that is paired with the custom routes
 * specified in the docusaurus config. It adds the baseUrl to the path, which
 * otherwise wouldn't be included.
 */
module.exports = function (context, options) {
  const {siteConfig} = context;
  return {
    name: 'plugin-dynamic-routes',

    async contentLoaded({content, actions}) {
      const {routes} = options;
      const {addRoute} = actions;
      routes.map(route => {
        // Adjust route to include base url
        const updatedRoute = {
          ...route,
          path: path.join(siteConfig.baseUrl, route.path),
        };
        addRoute(updatedRoute);
      });
    },
  };
};
