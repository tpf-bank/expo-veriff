import ExpoModulesCore
import Veriff
import AVFoundation

public class ExpoVeriffModule: Module {
    private var promise: Promise?
    private var isSessionActive = false
    
    func launchVeriff(
        sessionUrl: String,
        p: Promise
    ) {
        if (self.promise != nil || isSessionActive) {
            p.reject("ALREADY_CREATED", "Veriff session is already active")
            return
        }
        
        // Set flags IMMEDIATELY to prevent race condition
        self.isSessionActive = true
        self.promise = p
        
        // Check camera permissions first
        checkCameraPermissions { [weak self] hasPermission in
            guard let self = self else { return }
            
            if !hasPermission {
                DispatchQueue.main.async {
                    p.reject("CAMERA_PERMISSION_DENIED", "Camera permission is required for Veriff")
                    self.cleanup()
                }
                return
            }
            
            DispatchQueue.main.async {
                let locale = Locale(identifier: "en")
                let configuration = Veriff.VeriffSdk.Configuration(languageLocale: locale)
                let veriff = Veriff.VeriffSdk.shared
                veriff.delegate = self
                veriff.implementationType = .reactNative
                
                do {
                    veriff.startAuthentication(sessionUrl: sessionUrl, configuration: configuration)
                } catch {
                    self.promise?.reject("SETUP_ERROR", "Failed to start Veriff session: \(error.localizedDescription)")
                    self.cleanup()
                }
            }
        }
    }
    
    private func checkCameraPermissions(completion: @escaping (Bool) -> Void) {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            completion(true)
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { granted in
                DispatchQueue.main.async {
                    completion(granted)
                }
            }
        case .denied, .restricted:
            completion(false)
        @unknown default:
            completion(false)
        }
    }
    
    private func cleanup() {
        promise = nil
        isSessionActive = false
    }
    
  public func definition() -> ModuleDefinition {
    Name("ExpoVeriff")

    AsyncFunction("launchVeriff") { (sessionUrl: String, p: Promise) in
        self.launchVeriff(sessionUrl: sessionUrl, p: p)
    }
  }
}

extension ExpoVeriffModule: VeriffSdkDelegate {
    public func sessionDidEndWithResult(_ result: Veriff.VeriffSdk.Result) {
        defer { cleanup() }
        
        switch result.status {
        case .done:
            self.promise?.resolve(result.sessionUrl.absoluteURL)
        case .canceled:
            self.promise?.reject("CANCELED", "User canceled the verification")
        case .error(let err):
            switch err {
                case .cameraUnavailable:
                    self.promise?.reject("CAMERA_UNAVAILABLE", "Camera is not available or permission denied")
                case .microphoneUnavailable:
                    self.promise?.reject("MICROPHONE_UNAVAILABLE", "Microphone is not available or permission denied")
                case .networkError,
                     .uploadError:
                    self.promise?.reject("NETWORK_ERROR", "Network connection error occurred")
                case .serverError,
                     .videoFailed,
                     .localError:
                    self.promise?.reject("SETUP_ERROR", "Failed to setup or process verification")
                case .deprecatedSDKVersion:
                    self.promise?.reject("UNSUPPORTED_SDK_VERSION", "Veriff SDK version is not supported")
                case .unknown:
                    self.promise?.reject("UNKNOWN_ERROR", "An unknown error occurred during verification")
                @unknown default:
                    self.promise?.reject("UNKNOWN_ERROR", "An unknown error occurred during verification")
            }
        @unknown default:
            self.promise?.reject("UNKNOWN_ERROR", "An unknown error occurred during verification")
        }
    }
}