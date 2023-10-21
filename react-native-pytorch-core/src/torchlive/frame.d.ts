import type {Frame} from 'react-native-vision-camera';

// If VisionCamera is not installed, this type is `never`.
export type VisionCameraFrame = Frame extends object ? Frame : never;
