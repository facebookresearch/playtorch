---
id: faq
title: FAQ
---

import ExpoSnack from '@site/src/components/ExpoSnack';
import ExternalLinks from '@site/src/constants/ExternalLinks'
import Link from '@docusaurus/Link';

# Frequently Asked Questions (FAQs)

## Why don’t PlayTorch Snacks work in Expo Go?

Currently, Expo Snacks display the suggestion “Download Expo Go and scan the QR code to get started.” However, the Expo Go app does not provide the built-in support needed by PlayTorch-compatible Snacks. Instead, download the PlayTorch app directly (<Link to={ExternalLinks.APP_STORE}>App Store</Link>, <Link to={ExternalLinks.GOOGLE_PLAY_STORE}>Google Play Store</Link>) and scan the QR code to open it in the PlayTorch app.

Here is an example of the sort of QR code that will not load in Expo Go, but will load in the PlayTorch app.

<ExpoSnack snackId="@playtorch/object-detection" />

## Where can I go to get support?

You can message us and the community on <Link to={ExternalLinks.DISCORD}>Discord</Link> or you can file issues and propose changes on <Link to={ExternalLinks.GITHUB}>GitHub</Link>.

## Where to see tutorials and example snacks?

We have several tutorials showcasing a variety of models on [playtorch.dev/tutorials](/tutorials/). You can also share and find inspiration on our community <Link to={ExternalLinks.DISCORD}>Discord</Link> or follow us on <Link to={ExternalLinks.TWITTER}>Twitter</Link> to see community highlights.

## What libraries are supported?

PlayTorch App supports a subset of the APIs available in Expo Go. It is based on Expo SDK 43 and supports the following Expo packages:

| Package                                | Version |
| -------------------------------------- | ------- |
| expo-asset                             | 8.4.3   |
| expo-av                                | 10.1.3  |
| expo-barcode-scanner                   | 11.1.2  |
| expo-camera                            | 12.0.3  |
| expo-checkbox                          | 2.0.0   |
| expo-constants                         | 12.1.3  |
| expo-device                            | 4.0.3   |
| expo-error-recovery                    | 3.0.3   |
| expo-file-system                       | 13.0.3  |
| expo-font                              | 10.0.5  |
| expo-gl                                | 11.0.3  |
| expo-image-manipulator                 | 10.1.2  |
| expo-linking                           | 2.4.2   |
| expo-random                            | 12.0.1  |
| expo-sensors                           | 11.0.3  |
| expo-speech                            | 10.0.3  |
| expo-status-bar                        | 0.13.5  |
| lottie-react-native                    | 4.0.3   |
| @react-native-community/datetimepicker | 3.5.2   |
| @react-native-picker/picker            | 2.1.0   |

Additionally, the PlayTorch App includes some additional packages not yet available in Expo Go:

| Package                | Version |
| ---------------------- | ------- |
| react-native-blob-util | 0.16.2  |

## What models are supported?

If you can export it [per the deployment workflow in PyTorch Mobile](https://pytorch.org/mobile/home/#deployment-workflow), you can load it in PlayTorch, as long as the right operators are present in the PlayTorch App.

The PlayTorch app has a variety of examples that leverage different models. You can find a list of all of the models in the app by tapping the info icon on the home screen.
