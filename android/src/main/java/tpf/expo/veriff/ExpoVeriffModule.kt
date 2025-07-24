package tpf.expo.veriff

import com.veriff.GeneralConfig
import com.veriff.Result
import android.app.Activity
import com.veriff.Configuration
import com.veriff.Sdk.createLaunchIntent
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Locale

class ExpoVeriffModule : Module() {
  private var callbackResult: Promise? = null
  private var isSessionActive = false

  fun launchVeriff(
    sessionUrl: String,
    p: Promise
  ) {
    if (callbackResult != null || isSessionActive) {
      p.reject("ALREADY_CREATED", "Veriff session is already active", null)
      return
    }

    val activity: Activity? = appContext.currentActivity
    if (activity == null) {
      p.reject("ACTIVITY_NOT_FOUND", "Activity not found", null)
      return
    }

    try {
      val appLocale = Locale.ENGLISH
      val configuration = Configuration.Builder()
              .locale(appLocale)
              .build()
      val intent = createLaunchIntent(activity, sessionUrl, configuration)
      activity.startActivityForResult(intent, REQUEST_CODE)
      callbackResult = p
      isSessionActive = true
    } catch (e: Exception) {
      p.reject("SETUP_ERROR", "Failed to start Veriff session: ${e.message}", null)
    }
  }

  private fun cleanup() {
    callbackResult = null
    isSessionActive = false
  }

  override fun definition() = ModuleDefinition {
    Name("ExpoVeriff")

    AsyncFunction("launchVeriff") { sessionUrl: String, promise: Promise ->
      launchVeriff(sessionUrl, promise)
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode == REQUEST_CODE) {
        try {
          val veriffResult = Result.fromResultIntent(payload.data)

          when (veriffResult?.status) {
            Result.Status.DONE -> {
              val token = payload.data?.getStringExtra(GeneralConfig.INTENT_EXTRA_SESSION_URL)
              callbackResult?.resolve(token)
            }
            Result.Status.CANCELED -> {
              callbackResult?.reject("CANCELED", "User canceled the verification", null)
            }
            Result.Status.ERROR -> {
              // Generic error handling without relying on specific enum values
              val errorCode = veriffResult.error?.name ?: "UNKNOWN_ERROR"
              val errorMessage = when (errorCode) {
                "CAMERA_UNAVAILABLE" -> "Camera is not available or permission denied"
                "MICROPHONE_UNAVAILABLE" -> "Microphone is not available or permission denied"
                "NETWORK_ERROR" -> "Network connection error occurred"
                "SERVER_ERROR" -> "Server error occurred"
                "UPLOAD_ERROR" -> "Upload error occurred"
                "VIDEO_FAILED" -> "Video processing failed"
                "LOCAL_ERROR" -> "Local error occurred"
                "DEPRECATED_SDK_VERSION" -> "Veriff SDK version is not supported"
                "UNKNOWN" -> "An unknown error occurred during verification"
                else -> "An unknown error occurred during verification"
              }
              callbackResult?.reject(errorCode, errorMessage, null)
            }
            null -> {
              callbackResult?.reject("UNKNOWN_ERROR", "Failed to process Veriff result", null)
            }
          }
        } catch (e: Exception) {
          callbackResult?.reject("UNKNOWN_ERROR", "Failed to process Veriff result: ${e.message}", null)
        } finally {
          cleanup()
        }
      }
    }
  }

  companion object {
    private const val REQUEST_CODE = 47239
  }
}
