package com.nativedownloader

import android.app.DownloadManager
import android.content.Context
import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import android.database.Cursor
import android.net.Uri
import android.os.Build
import android.os.Environment
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.Job
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.delay
import kotlin.math.min
import com.nativedownloader.NativeDownloaderSpec

class NativeDownloaderModule(reactContext: ReactApplicationContext) : NativeDownloaderSpec(reactContext) {
  override fun getName() = NAME

  private val downloadDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
  private var downloadManager: DownloadManager? = null
  private var downloadID: Long = 0
  private var fileName: String? = null
  private var downloadPromise: Promise? = null
  private var progressJob: Job? = null

  override fun downloadFile(
    url: String?,
    filename: String?,
    extension: String?,
    promise: Promise?
  ) {
    fileName = "${filename}.${extension}"
    downloadPromise = promise

    val context = currentActivity ?: reactApplicationContext

    val uri = Uri.parse(url)
    val request = DownloadManager.Request(uri)

    request.setAllowedNetworkTypes(
      DownloadManager.Request.NETWORK_MOBILE or DownloadManager.Request.NETWORK_WIFI
    )
    request.setNotificationVisibility(
      DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED
    )
    request.setDestinationInExternalFilesDir(
      context,
      Environment.DIRECTORY_DOCUMENTS,
      fileName
    )

    downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
    downloadID = downloadManager!!.enqueue(request)

    // Start progress polling
    progressJob = CoroutineScope(Dispatchers.IO).launch {
      var lastProgress = -1
      var downloading = true
      while (downloading) {
          val query = DownloadManager.Query().setFilterById(downloadID)
          val cursor = downloadManager?.query(query)
          if (cursor != null && cursor.moveToFirst()) {
              val bytesDownloaded = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR))
              val bytesTotal = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_TOTAL_SIZE_BYTES))
              if (bytesTotal > 0) {
                  val progress = (bytesDownloaded * 100 / bytesTotal)
                  if (progress != lastProgress) {
                    reactApplicationContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("DownloadProgress", progress)
                    lastProgress = progress
                  }
              }
              val status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS))
              if (status == DownloadManager.STATUS_SUCCESSFUL || status == DownloadManager.STATUS_FAILED) {
                  downloading = false

                  downloadPromise?.resolve("DOWNLOAD SUCCESSFUL!")
                  downloadPromise = null
              }
          }
          cursor?.close()
          delay(500)
      }
    }
  }

  companion object {
    const val NAME = "NativeDownloader"
  }
}
