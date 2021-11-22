/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.camera;

import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Log;
import android.util.Size;
import android.view.LayoutInflater;
import android.view.OrientationEventListener;
import android.view.Surface;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureException;
import androidx.camera.core.ImageProxy;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.lifecycle.LifecycleOwner;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.common.util.concurrent.ListenableFuture;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.pytorch.rn.core.R;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.image.Image;
import org.pytorch.rn.core.javascript.JSContext;

public class CameraManager extends ViewGroupManager<ConstraintLayout> {

  public static final String REACT_CLASS = "PyTorchCoreCameraView";

  private final String[] REQUIRED_PERMISSIONS = new String[] {Manifest.permission.CAMERA};

  private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
  private PreviewView mPreviewView;
  private Button mCaptureButton;
  private ConstraintLayout mLayout;
  private ImageCapture mImageCapture;

  /** Blocking camera operations are performed using this executor */
  private ExecutorService cameraExecutor;

  private final ReactApplicationContext mReactContext;

  public CameraManager(ReactApplicationContext reactContext) {
    this.mReactContext = reactContext;
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @NonNull
  @Override
  protected ConstraintLayout createViewInstance(@NonNull ThemedReactContext reactContext) {
    cameraProviderFuture = ProcessCameraProvider.getInstance(mReactContext.getCurrentActivity());

    // Initialize our background executor
    cameraExecutor = Executors.newSingleThreadExecutor();

    mLayout =
        (ConstraintLayout)
            LayoutInflater.from(reactContext).inflate(R.layout.activity_camera, null);

    mPreviewView = mLayout.findViewById(R.id.preview_view);
    mCaptureButton = mLayout.findViewById(R.id.capture_button);
    mCaptureButton.setOnClickListener(
        v -> {
          capturePhoto();
        });

    // The PreviewView has a width/height of 0/0. This was reported as an issue in the CameraX
    // issue tracker and is supposedly a bug in how React Native calculates children dimension.
    // A manual remeasure of the layout fixes this.
    // Link to issue: https://issuetracker.google.com/issues/177245493#comment8
    mPreviewView.setOnHierarchyChangeListener(new ReactNativeCameraPreviewRemeasure());

    if (allPermissionsGranted()) {
      startCamera(); // start camera if permission has been granted by user
    } else {
      int REQUEST_CODE_PERMISSIONS = 200;
      ActivityCompat.requestPermissions(
          mReactContext.getCurrentActivity(), REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS);
    }

    return mLayout;
  }

  @Nullable
  @Override
  public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    final MapBuilder.Builder<String, Object> builder = MapBuilder.builder();
    return builder
        .put(
            "onFrame",
            MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onFrame")))
        .put(
            "onCapture",
            MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onCapture")))
        .build();
  }

  private void startCamera() {
    cameraProviderFuture.addListener(
        () -> {
          try {
            ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
            bindPreview(cameraProvider);
          } catch (ExecutionException | InterruptedException e) {
            // No errors need to be handled for this Future.
            // This should never be reached.
            Log.e(REACT_CLASS, e.getMessage());
          }
        },
        ContextCompat.getMainExecutor(mReactContext));
  }

  private void capturePhoto() {
    if (mImageCapture != null) {
      mImageCapture.takePicture(
          ContextCompat.getMainExecutor(mReactContext),
          new ImageCapture.OnImageCapturedCallback() {
            @Override
            public void onCaptureSuccess(@NonNull ImageProxy imageFrame) {
              super.onCaptureSuccess(imageFrame);
              IImage image = new Image(imageFrame, mReactContext.getApplicationContext());
              JSContext.NativeJSRef ref = JSContext.wrapObject(image);
              mReactContext
                  .getJSModule(RCTEventEmitter.class)
                  .receiveEvent(mLayout.getId(), "onCapture", ref.getJSRef());
            }

            @Override
            public void onError(@NonNull ImageCaptureException exception) {
              super.onError(exception);
              Log.e(REACT_CLASS, exception.getLocalizedMessage(), exception);
            }
          });
    }
  }

  @ReactProp(name = "hideCaptureButton")
  public void setCaptureButtonVisibility(ConstraintLayout view, boolean hideCaptureButton) {
    mCaptureButton.post(
        () -> {
          mCaptureButton.setVisibility(hideCaptureButton ? View.INVISIBLE : View.VISIBLE);
        });
  }

  void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {

    Preview preview = new Preview.Builder().build();

    CameraSelector cameraSelector =
        new CameraSelector.Builder().requireLensFacing(CameraSelector.LENS_FACING_BACK).build();

    ImageAnalysis imageAnalysis =
        new ImageAnalysis.Builder()
            .setTargetResolution(new Size(1280, 720))
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build();

    imageAnalysis.setAnalyzer(
        cameraExecutor,
        imageFrame -> {
          IImage image = new Image(imageFrame, mReactContext.getApplicationContext());
          JSContext.NativeJSRef ref = JSContext.wrapObject(image);
          mReactContext
              .getJSModule(RCTEventEmitter.class)
              .receiveEvent(mLayout.getId(), "onFrame", ref.getJSRef());
        });

    mImageCapture = new ImageCapture.Builder().setTargetResolution(new Size(1280, 720)).build();

    OrientationEventListener orientationEventListener =
        new OrientationEventListener(mReactContext.getApplicationContext()) {
          @Override
          public void onOrientationChanged(int orientation) {
            int rotation;

            // Monitors orientation values to determine the target rotation value
            if (orientation >= 45 && orientation < 135) {
              rotation = Surface.ROTATION_270;
            } else if (orientation >= 135 && orientation < 225) {
              rotation = Surface.ROTATION_180;
            } else if (orientation >= 225 && orientation < 315) {
              rotation = Surface.ROTATION_90;
            } else {
              rotation = Surface.ROTATION_0;
            }

            mImageCapture.setTargetRotation(rotation);
            imageAnalysis.setTargetRotation(rotation);
          }
        };

    orientationEventListener.enable();

    // Unbind previous use cases. Without this, on unmounting and mounting CameraView again, the
    // app will crash.
    cameraProvider.unbindAll();

    Camera camera =
        cameraProvider.bindToLifecycle(
            (LifecycleOwner) mReactContext.getCurrentActivity(),
            cameraSelector,
            preview,
            imageAnalysis,
            mImageCapture);
    mCaptureButton.setVisibility(View.VISIBLE);

    preview.setSurfaceProvider(mReactContext.getMainExecutor(), mPreviewView.getSurfaceProvider());
  }

  private boolean allPermissionsGranted() {
    for (String permission : REQUIRED_PERMISSIONS) {
      if (ContextCompat.checkSelfPermission(mReactContext, permission)
          != PackageManager.PERMISSION_GRANTED) {
        return false;
      }
    }
    return true;
  }

  private static class ReactNativeCameraPreviewRemeasure
      implements ViewGroup.OnHierarchyChangeListener {

    @Override
    public void onChildViewAdded(View parent, View child) {
      parent.post(
          () -> {
            parent.measure(
                View.MeasureSpec.makeMeasureSpec(
                    parent.getMeasuredWidth(), View.MeasureSpec.EXACTLY),
                View.MeasureSpec.makeMeasureSpec(
                    parent.getMeasuredHeight(), View.MeasureSpec.EXACTLY));
            parent.layout(0, 0, parent.getMeasuredWidth(), parent.getMeasuredHeight());

            Log.d(
                REACT_CLASS,
                String.format(
                    "Measured width=%s, height=%s",
                    parent.getMeasuredWidth(), parent.getMeasuredHeight()));
          });
    }

    @Override
    public void onChildViewRemoved(View parent, View child) {
      // empty
    }
  }
}
