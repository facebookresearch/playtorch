/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Build;
import android.util.Log;
import androidx.core.app.ActivityCompat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.jetbrains.annotations.NotNull;
import org.pytorch.rn.core.javascript.JSContext;

public class AudioModule extends ReactContextBaseJavaModule {

  public static final String REACT_MODULE = "PyTorchCoreAudioModule";

  private static final int REQUEST_RECORD_AUDIO = 13;
  private static final int SAMPLE_RATE = 16000;

  private final ReactApplicationContext mReactContext;

  public AudioModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
  }

  @NotNull
  @Override
  public String getName() {
    return REACT_MODULE;
  }

  @ReactMethod
  public void record(final int length, final Promise promise) {
    Log.d(REACT_MODULE, "started recording");

    requestMicrophonePermission();

    final int recordingLength = SAMPLE_RATE * length;
    Thread recordingThread =
        new Thread(
            () -> {
              try {
                final int bufferSize =
                    AudioRecord.getMinBufferSize(
                        SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
                final AudioRecord record =
                    new AudioRecord(
                        MediaRecorder.AudioSource.DEFAULT,
                        SAMPLE_RATE,
                        AudioFormat.CHANNEL_IN_MONO,
                        AudioFormat.ENCODING_PCM_16BIT,
                        bufferSize);

                if (record.getState() != AudioRecord.STATE_INITIALIZED) {
                  Log.e(REACT_MODULE, "Audio Record can't initialize!");
                  return;
                }
                record.startRecording();

                long shortsRead = 0;
                int audioDataOffset = 0;
                int shortsToCopy = 0;
                short[] audioBuffer = new short[bufferSize / 2];
                short[] audioData = new short[recordingLength];

                while (shortsRead < recordingLength) {
                  int numberOfShort = record.read(audioBuffer, 0, audioBuffer.length);
                  shortsRead += numberOfShort;
                  shortsToCopy = Math.min(numberOfShort, recordingLength - audioDataOffset);
                  System.arraycopy(audioBuffer, 0, audioData, audioDataOffset, shortsToCopy);
                  audioDataOffset += shortsToCopy;
                  Log.d(REACT_MODULE, String.format("shortsRead=%d", shortsRead));
                }

                record.stop();
                record.release();

                Audio audio = new Audio(audioData);
                JSContext.NativeJSRef ref = JSContext.wrapObject(audio);
                promise.resolve(ref.getJSRef());
              } catch (Exception e) {
                Log.e(REACT_MODULE, "Error recording audio:", e);
                promise.reject(e);
              }
            });

    recordingThread.start();
  }

  private void requestMicrophonePermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      ActivityCompat.requestPermissions(
          mReactContext.getCurrentActivity(),
          new String[] {android.Manifest.permission.RECORD_AUDIO},
          REQUEST_RECORD_AUDIO);
    }
  }
}
