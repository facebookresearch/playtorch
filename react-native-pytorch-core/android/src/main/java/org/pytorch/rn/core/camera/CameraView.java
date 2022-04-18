/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package org.pytorch.rn.core.camera;

import android.Manifest;
import android.animation.ValueAnimator;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.LayerDrawable;
import android.util.Log;
import android.util.Size;
import android.view.MotionEvent;
import android.view.OrientationEventListener;
import android.view.Surface;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import androidx.annotation.NonNull;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraInfoUnavailableException;
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
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.common.util.concurrent.ListenableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.pytorch.rn.core.R;
import org.pytorch.rn.core.image.IImage;
import org.pytorch.rn.core.image.Image;
import org.pytorch.rn.core.javascript.JSContext;

public class CameraView extends ConstraintLayout {

  public static final String TAG = "PTLCameraView";

  public static final String REACT_CLASS = "PyTorchCameraView";

  private final String[] REQUIRED_PERMISSIONS = new String[] {Manifest.permission.CAMERA};

  private ListenableFuture<ProcessCameraProvider> cameraProviderFuture;
  private PreviewView mPreviewView;
  private Button mCaptureButton;
  private Button mFlipButton;
  private ImageCapture mImageCapture;
  private ValueAnimator pressAnimation, releaseAnimation;
  private LayerDrawable mCaptureButtonLayerDrawable;
  private GradientDrawable mCaptureButtonInnerCircle;
  private CameraSelector mPreferredCameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
  private final int DURATION = 100;
  private final float SCALE_BUTTON_BY = 1.15f;

  private boolean mIsDirty = false;
  private boolean mIsDirtyForCameraRestart = false;
  private boolean mHideCaptureButton = false;
  private boolean mHideFlipButton = false;
  private Size mTargetResolution = new Size(480, 640);

  private Camera mCamera;

  /** Blocking camera operations are performed using this executor */
  private ExecutorService cameraExecutor;

  private final ReactApplicationContext mReactContext;

  public CameraView(ReactApplicationContext context) {
    super(context);
    mReactContext = context;
    init();
  }

  private void init() {
    cameraProviderFuture = ProcessCameraProvider.getInstance(mReactContext.getCurrentActivity());

    // Initialize our background executor
    cameraExecutor = Executors.newSingleThreadExecutor();

    View mLayout = inflate(mReactContext, R.layout.activity_camera, this);

    mPreviewView = mLayout.findViewById(R.id.preview_view);
    mCaptureButton = mLayout.findViewById(R.id.capture_button);
    mFlipButton = mLayout.findViewById(R.id.flip_button);

    // Initialize drawables to change (inner circle stroke)
    mCaptureButtonLayerDrawable =
        (LayerDrawable)
            mReactContext
                .getResources()
                .getDrawable(R.drawable.camera_button, mReactContext.getTheme())
                .mutate();
    mCaptureButtonInnerCircle =
        (GradientDrawable)
            mCaptureButtonLayerDrawable.findDrawableByLayerId(R.id.camera_button_inner_circle);

    // Calculate pixel values of borders
    float density = mReactContext.getResources().getDisplayMetrics().density;
    int cameraButtonInnerBorderNormal = (int) (density * 18);
    int cameraButtonInnerBorderPressed = (int) (density * 24);

    // Initialize Value Animators and Listeners
    // grow means grow border so the circle shrinks
    pressAnimation =
        ValueAnimator.ofInt(cameraButtonInnerBorderNormal, cameraButtonInnerBorderPressed)
            .setDuration(DURATION);
    releaseAnimation =
        ValueAnimator.ofInt(cameraButtonInnerBorderPressed, cameraButtonInnerBorderNormal)
            .setDuration(DURATION);

    ValueAnimator.AnimatorUpdateListener animatorUpdateListener =
        new ValueAnimator.AnimatorUpdateListener() {
          @Override
          public void onAnimationUpdate(ValueAnimator updatedAnimation) {
            int animatedValue = (int) updatedAnimation.getAnimatedValue();
            mCaptureButtonInnerCircle.setStroke(animatedValue, Color.TRANSPARENT);
            mCaptureButton.setBackground(mCaptureButtonLayerDrawable);
          }
        };

    pressAnimation.addUpdateListener(animatorUpdateListener);
    releaseAnimation.addUpdateListener(animatorUpdateListener);

    mCaptureButton.setOnTouchListener(
        (v, e) -> {
          switch (e.getAction()) {
            case MotionEvent.ACTION_DOWN:
              pressAnimation.start();
              mCaptureButton.animate().scaleX(SCALE_BUTTON_BY).setDuration(DURATION);
              mCaptureButton.animate().scaleY(SCALE_BUTTON_BY).setDuration(DURATION);
              takePicture();
              break;
            case MotionEvent.ACTION_UP:
              releaseAnimation.start();
              mCaptureButton.animate().scaleX(1f).setDuration(DURATION);
              mCaptureButton.animate().scaleY(1f).setDuration(DURATION);
          }
          return false;
        });

    mFlipButton.setOnTouchListener(
        (v, e) -> {
          if (e.getAction() == MotionEvent.ACTION_DOWN) {
            flipCamera();
          }
          return false;
        });

    // The PreviewView has a width/height of 0/0. This was reported as an issue in the CameraX
    // issue tracker and is supposedly a bug in how React Native calculates children dimension.
    // A manual remeasure of the layout fixes this.
    // Link to issue: https://issuetracker.google.com/issues/177245493#comment8
    mPreviewView.setOnHierarchyChangeListener(new CameraView.ReactNativeCameraPreviewRemeasure());

    if (allPermissionsGranted()) {
      startCamera(); // start camera if permission has been granted by user
    } else {
      int REQUEST_CODE_PERMISSIONS = 200;
      ActivityCompat.requestPermissions(
          mReactContext.getCurrentActivity(), REQUIRED_PERMISSIONS, REQUEST_CODE_PERMISSIONS);
    }
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
            Log.e(TAG, e.getMessage());
          }
        },
        ContextCompat.getMainExecutor(mReactContext));
  }

  protected void takePicture() {
    if (mImageCapture != null) {
      mImageCapture.takePicture(
          ContextCompat.getMainExecutor(mReactContext),
          new ImageCapture.OnImageCapturedCallback() {
            @Override
            public void onCaptureSuccess(@NonNull ImageProxy imageProxy) {
              super.onCaptureSuccess(imageProxy);
              IImage image = new Image(imageProxy, mReactContext.getApplicationContext());
              JSContext.NativeJSRef ref = JSContext.wrapObject(image);
              mReactContext
                  .getJSModule(RCTEventEmitter.class)
                  .receiveEvent(CameraView.this.getId(), "onCapture", ref.getJSRef());
            }

            @Override
            public void onError(@NonNull ImageCaptureException exception) {
              super.onError(exception);
              Log.e(TAG, exception.getLocalizedMessage(), exception);
            }
          });
    }
  }

  protected void flipCamera() {
    if (mPreferredCameraSelector == CameraSelector.DEFAULT_BACK_CAMERA) {
      mPreferredCameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA;
    } else {
      mPreferredCameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
    }
    startCamera();
  }

  void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {

    // Unbind previous use cases. Without this, on unmounting and mounting CameraView again, the
    // app will crash.
    cameraProvider.unbindAll();

    Preview preview = new Preview.Builder().build();

    // Some devices do not have front and back camera, like the emulator on a laptop.
    CameraSelector cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA;
    try {
      if (cameraProvider.hasCamera(mPreferredCameraSelector)) {
        cameraSelector = mPreferredCameraSelector;
      }
    } catch (CameraInfoUnavailableException e) {
    }

    ImageAnalysis imageAnalysis =
        new ImageAnalysis.Builder()
            .setTargetResolution(mTargetResolution)
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build();

    imageAnalysis.setAnalyzer(
        cameraExecutor,
        imageProxy -> {
          IImage image = new Image(imageProxy, mReactContext.getApplicationContext());
          JSContext.NativeJSRef ref = JSContext.wrapObject(image);
          mReactContext
              .getJSModule(RCTEventEmitter.class)
              .receiveEvent(CameraView.this.getId(), "onFrame", ref.getJSRef());
        });

    mImageCapture = new ImageCapture.Builder().setTargetResolution(mTargetResolution).build();

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

    mCamera =
        cameraProvider.bindToLifecycle(
            (LifecycleOwner) mReactContext.getCurrentActivity(),
            cameraSelector,
            preview,
            imageAnalysis,
            mImageCapture);

    preview.setSurfaceProvider(
        ContextCompat.getMainExecutor(mReactContext), mPreviewView.getSurfaceProvider());
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

  public void setHideCaptureButton(boolean hideCaptureButton) {
    if (mHideCaptureButton != hideCaptureButton) {
      mHideCaptureButton = hideCaptureButton;
      mIsDirty = true;
    }
  }

  public void setHideFlipButton(boolean hideFlipButton) {
    if (mHideFlipButton != hideFlipButton) {
      mHideFlipButton = hideFlipButton;
      mIsDirty = true;
    }
  }

  public void setCameraSelector(CameraSelector cameraSelector) {
    if (!mPreferredCameraSelector.equals(cameraSelector)) {
      mPreferredCameraSelector = cameraSelector;
      mIsDirty = true;
      mIsDirtyForCameraRestart = true;
    }
  }

  public void setTargetResolution(Size size) {
    if (!mTargetResolution.equals(size)) {
      mTargetResolution = size;
      mIsDirty = true;
      mIsDirtyForCameraRestart = true;
    }
  }

  public void maybeUpdateView() {
    if (!mIsDirty) {
      return;
    }

    mCaptureButton.post(
        () -> {
          mCaptureButton.setVisibility(mHideCaptureButton ? View.INVISIBLE : View.VISIBLE);
        });

    mFlipButton.post(
        () -> {
          mFlipButton.setVisibility(mHideFlipButton ? View.INVISIBLE : View.VISIBLE);
        });

    if (mIsDirtyForCameraRestart) {
      startCamera();
    }
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
                TAG,
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
