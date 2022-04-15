/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.audio;

import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.core.app.ActivityCompat;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import org.jetbrains.annotations.NotNull;
import org.pytorch.rn.core.javascript.JSContext;
import org.pytorch.rn.core.utils.FileUtils;

@ReactModule(name = "PyTorchCoreAudioModule")
public class AudioModule extends ReactContextBaseJavaModule {

  public static final String TAG = "PTLAudioModule";

  public static final String NAME = "PyTorchCoreAudioModule";

  private static final int REQUEST_RECORD_AUDIO = 13;
  private static final int SAMPLE_RATE = 16000;
  private static final String DEFAULT_AUDIO_FILE_PREFIX = "audio";
  private static final String DEFAULT_AUDIO_FILE_EXTENSION = ".wav";

  private final ReactApplicationContext mReactContext;
  private volatile boolean mIsRecording;
  private int mBufferSize;
  private List<short[]> mAudioDataChunks = new ArrayList<>();
  @Nullable private AudioRecord audioRecorder;

  public AudioModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mReactContext = reactContext;
    mBufferSize =
        AudioRecord.getMinBufferSize(
            SAMPLE_RATE, AudioFormat.CHANNEL_IN_MONO, AudioFormat.ENCODING_PCM_16BIT);
  }

  @NotNull
  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void isRecording(final Promise promise) {
    boolean recording = false;
    if (audioRecorder != null) {
      recording = audioRecorder.getRecordingState() == AudioRecord.RECORDSTATE_RECORDING;
    }
    promise.resolve(recording);
  }

  @ReactMethod
  public void startRecord() {
    Log.d(TAG, "started recording");
    requestMicrophonePermission();
    Thread recordingThread = new Thread(getStartRecordingThread());
    recordingThread.start();
  }

  @ReactMethod
  public void stopRecord(final Promise promise) {
    if (!mIsRecording || mAudioDataChunks.isEmpty()) {
      promise.resolve(null);
    }
    mIsRecording = false;
    synchronized (mAudioDataChunks) {
      // Wait for the recording thread to finish recording
      final Audio recordedAudio = processRecordedAudio();
      JSContext.NativeJSRef ref = JSContext.wrapObject(recordedAudio);
      promise.resolve(ref.getJSRef());
    }
  }

  @ReactMethod
  public void play(ReadableMap audioRef) {
    IAudio audio = JSContext.unwrapObject(audioRef);
    audio.play();
  }

  @ReactMethod
  public void pause(ReadableMap audioRef) {
    IAudio audio = JSContext.unwrapObject(audioRef);
    audio.pause();
  }

  @ReactMethod
  public void stop(ReadableMap audioRef) {
    IAudio audio = JSContext.unwrapObject(audioRef);
    audio.stop();
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public int getDuration(ReadableMap audioRef) {
    IAudio audio = JSContext.unwrapObject(audioRef);
    return audio.getDuration();
  }

  @ReactMethod
  public void release(ReadableMap audioRef, Promise promise) throws Exception {
    JSContext.release(audioRef);
    promise.resolve(null);
  }

  @ReactMethod
  public void toFile(final ReadableMap audioRef, Promise promise) {
    try {
      final IAudio audio = JSContext.unwrapObject(audioRef);
      final File cacheDir = mReactContext.getCacheDir();
      final File file =
          File.createTempFile(DEFAULT_AUDIO_FILE_PREFIX, DEFAULT_AUDIO_FILE_EXTENSION, cacheDir);
      final FileOutputStream outputStream = new FileOutputStream(file);
      final byte[] audioBytes = AudioUtils.toByteArray(audio.getData());
      outputStream.write(audioBytes);
      promise.resolve(file.getAbsolutePath());
    } catch (final IOException e) {
      promise.reject(e);
    }
  }

  @ReactMethod
  public void fromFile(final String filePath, final Promise promise) {
    try {
      final byte[] audioData = Files.readAllBytes(Paths.get(filePath));
      final IAudio audio = new Audio(AudioUtils.toShortArray(audioData));
      final JSContext.NativeJSRef ref = JSContext.wrapObject(audio);
      promise.resolve(ref.getJSRef());
    } catch (final IOException | OutOfMemoryError | SecurityException exp) {
      promise.reject(new Error("Could not load audio from " + filePath + " " + exp.getMessage()));
    }
  }

  @ReactMethod
  public void fromBundle(final String uriString, final Promise promise) {
    final Uri uri = Uri.parse(uriString);
    final File targetFile = new File(getReactApplicationContext().getCacheDir(), uri.getPath());
    FileUtils.downloadUriToFile(uriString, targetFile);
    fromFile(targetFile.getPath(), promise);
  }

  private void requestMicrophonePermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      ActivityCompat.requestPermissions(
          mReactContext.getCurrentActivity(),
          new String[] {android.Manifest.permission.RECORD_AUDIO},
          REQUEST_RECORD_AUDIO);
    }
  }

  private Audio processRecordedAudio() {
    int index = 0;
    final short[] audioData = new short[mAudioDataChunks.size() * mBufferSize / 2];
    for (int i = 0; i < mAudioDataChunks.size(); i++) {
      final short[] audioDataChunk = mAudioDataChunks.get(i);
      for (int j = 0; j < audioDataChunk.length; j++) {
        audioData[index++] = audioDataChunk[j];
      }
    }
    return new Audio(audioData);
  }

  private Runnable getStartRecordingThread() {
    return new Runnable() {
      @Override
      public void run() {
        synchronized (mAudioDataChunks) {
          try {
            audioRecorder =
                new AudioRecord(
                    MediaRecorder.AudioSource.DEFAULT,
                    SAMPLE_RATE,
                    AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    mBufferSize);
            if (audioRecorder.getState() != AudioRecord.STATE_INITIALIZED) {
              Log.e(TAG, "Audio Record can't initialize!");
              return;
            }
            audioRecorder.startRecording();
            mIsRecording = true;
            mAudioDataChunks = new ArrayList<>();
            while (mIsRecording) {
              final short[] audioBuffer = new short[mBufferSize / 2];
              final int numberOfShort = audioRecorder.read(audioBuffer, 0, audioBuffer.length);
              mAudioDataChunks.add(audioBuffer);
            }
          } catch (final Exception e) {
            mIsRecording = false;
            mAudioDataChunks.clear();
            Log.e(TAG, "Error recording audio:", e);
            throw new RuntimeException(
                "Exception encountered while recording audio. " + e.getMessage());
          } finally {
            if (audioRecorder != null) {
              audioRecorder.stop();
              audioRecorder.release();
              audioRecorder = null;
            }
          }
        }
      }
    };
  }
}
