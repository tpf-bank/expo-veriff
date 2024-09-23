package tpf.expo.veriff

import com.veriff.GeneralConfig
import com.veriff.Result
import android.app.Activity
import com.veriff.Configuration
import com.veriff.Sdk.createLaunchIntent
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoVeriffModule : Module() {
  private var callbackResult: Promise? = null;

  fun launchVeriff(
    sessionUrl: String,
    p: Promise
  ) {
    if (callbackResult != null) {
      p.reject("0", "ALREADY_CREATED", null)
      return
    }

    val activity: Activity? = appContext.currentActivity
    if (activity == null) {
      p.reject("0", "ACTIVITY_NOT_FOUND", null)
      return
    }

    val configBuilder = Configuration.Builder()
    val intent = createLaunchIntent(activity, sessionUrl, configBuilder.build())
    activity.startActivityForResult(intent, REQUEST_CODE)
    callbackResult = p
  }

  override fun definition() = ModuleDefinition {
    Name("ExpoVeriff")

    AsyncFunction("launchVeriff") { sessionUrl: String, promise: Promise ->
      launchVeriff(sessionUrl, promise)
    }

    OnActivityResult { _, payload ->
      if (payload.requestCode == REQUEST_CODE) {
        val veriffResult = Result.fromResultIntent(payload.data)!!

        when (veriffResult.status) {
          Result.Status.DONE -> {
            val token = payload.data?.getStringExtra(GeneralConfig.INTENT_EXTRA_SESSION_URL)
            callbackResult?.resolve(token)
          }
          Result.Status.CANCELED -> {
            callbackResult?.reject("0", "CANCELED", null)
          }
          Result.Status.ERROR -> {
            callbackResult?.reject(veriffResult.status.name, veriffResult.error?.name, null)
          }
        }

        callbackResult = null
      }
    }
  }

  companion object {
    private const val REQUEST_CODE = 47239
  }
}
