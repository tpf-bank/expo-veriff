const {
  withPlugins,
  createRunOncePlugin,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

const lines = [
  '\n// @generated begin expo-veriff -  prebuild (DO NOT MODIFY)',
  'allprojects {',
  '    repositories { maven { url "https://cdn.veriff.me/android/" } }',
  '    configurations {',
  '        all*.exclude module: \'bcprov-jdk15to18\'',
  '        all*.exclude module: \'bcutil-jdk18on\'',
  '        all*.exclude module: \'bcprov-jdk15on\'',
  '        all*.exclude module: \'bcutil-jdk15on\'',
  '    }',
  '}',
  '// @generated end expo-veriff'
].join("\n")

function withVeriffProjectGradle(expoConfig) {
  return withProjectBuildGradle(expoConfig, (config) => {
    config.modResults.contents = config.modResults.contents + lines
    return config;
  });
}

function withVeriff(expoConfig) {
  return withPlugins(expoConfig, [withVeriffProjectGradle]);
}

exports.default = createRunOncePlugin(withVeriff, "expo-veriff", "0.1.11");
