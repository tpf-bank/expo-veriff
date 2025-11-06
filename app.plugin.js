const {
  withPlugins,
  createRunOncePlugin,
  withProjectBuildGradle,
  withAndroidManifest,
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

/**
 * Adds ML Kit meta-data with tools:replace to prevent conflicts with other plugins
 * like expo-dev-launcher that also use ML Kit vision dependencies.
 */
function withVeriffAndroidManifest(expoConfig) {
  return withAndroidManifest(expoConfig, (config) => {
    const manifest = config.modResults;
    
    // Safely access application element
    if (!manifest.application || !Array.isArray(manifest.application) || manifest.application.length === 0) {
      console.warn('⚠️  [expo-veriff] AndroidManifest application element not found, skipping ML Kit configuration');
      return config;
    }

    const application = manifest.application[0];

    // Ensure tools namespace is present
    if (!manifest.$) {
      manifest.$ = {};
    }
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // Initialize meta-data array if not exists
    if (!application['meta-data']) {
      application['meta-data'] = [];
    }

    // Check if ML Kit meta-data already exists
    const existingMLKit = application['meta-data'].find(
      (meta) => meta.$ && meta.$['android:name'] === 'com.google.mlkit.vision.DEPENDENCIES'
    );

    if (existingMLKit) {
      // Update existing meta-data - merge face with other values
      const currentValue = existingMLKit.$['android:value'] || '';
      const values = currentValue.split(',').map(v => v.trim()).filter(Boolean);
      
      if (!values.includes('face')) {
        values.push('face');
        existingMLKit.$['android:value'] = values.join(',');
      }
      
      // Ensure tools:replace is set
      if (!existingMLKit.$['tools:replace']) {
        existingMLKit.$['tools:replace'] = 'android:value';
      }
      
      console.log('✅ [expo-veriff] Updated ML Kit meta-data with face recognition support');
    } else {
      // Add new meta-data for Veriff face recognition
      application['meta-data'].push({
        $: {
          'android:name': 'com.google.mlkit.vision.DEPENDENCIES',
          'android:value': 'face',
          'tools:replace': 'android:value',
        },
      });
      console.log('✅ [expo-veriff] Added ML Kit meta-data with face recognition support');
    }

    return config;
  });
}

function withVeriff(expoConfig) {
  return withPlugins(expoConfig, [
    withVeriffProjectGradle,
    withVeriffAndroidManifest
  ]);
}

exports.default = createRunOncePlugin(withVeriff, "expo-veriff", "0.1.14");
