import ExpoModulesCore
import Veriff

public class ExpoVeriffModule: Module {
    private var promise: Promise?
    
    func launchVeriff(
        sessionUrl: String,
        p: Promise
    ) {
        if (self.promise != nil) {
            p.reject("0", "ALREADY_CREATED")
            return
        }
        
        DispatchQueue.main.async {
            self.promise = p


            let locale = Locale(identifier: "en")
            let veriff = Veriff.VeriffSdk.shared
            veriff.delegate = self
            veriff.languageLocale = locale
            veriff.implementationType = .reactNative
            veriff.startAuthentication(sessionUrl: sessionUrl)
        }
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
        switch result.status {
        case .done:
            self.promise?.resolve(result.sessionUrl.absoluteURL)
        case .canceled:
            self.promise?.reject("CANCELED", "CANCELED")
        case .error(let err):
            switch err {
                case .cameraUnavailable:
                    self.promise?.reject("ERROR", "UNABLE_TO_ACCESS_CAMERA")
                case .microphoneUnavailable:
                    self.promise?.reject("ERROR", "UNABLE_TO_RECORD_AUDIO")
                case .networkError,
                     .uploadError:
                    self.promise?.reject("ERROR", "NETWORK_ERROR")
                case .serverError,
                     .videoFailed,
                     .localError:
                    self.promise?.reject("ERROR", "SETUP_ERROR")
                case .deprecatedSDKVersion:
                    self.promise?.reject("ERROR", "UNSUPPORTED_SDK_VERSION")
                case .unknown:
                    self.promise?.reject("ERROR", "UNKNOWN_ERROR")
                @unknown default:
                    self.promise?.reject("ERROR", "UNKNOWN_ERROR")
            }
        @unknown default:
            self.promise?.reject("0", "UNKNOWN_ERROR")
        }
        
        self.promise = nil;
    }
}
