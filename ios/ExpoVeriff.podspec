require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoVeriff'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = { :ios => '15.0', :tvos => '15.0' }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://tpf.co' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'VeriffSDK', '7.4.0'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule',
    'IPHONEOS_DEPLOYMENT_TARGET' => '15.0',
    'OTHER_SWIFT_FLAGS' => '-D EXPO_CONFIGURATION_RELEASE',
    'ENABLE_BITCODE' => 'NO'
  }

  s.source_files = "**/*.{h,m,swift}"
end
