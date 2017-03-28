const genDefaultConfig = require('@kadira/storybook/dist/server/config/defaults/webpack.config.js');
const postcssConfig = require('../.postcss.json');

module.exports = function(config, env) {
  const newConfig = genDefaultConfig(config, env);

  newConfig.postcss = () => postcssConfig.use;

  return newConfig;
};
