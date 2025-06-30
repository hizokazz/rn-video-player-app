# NativeDownloader Module documentation

This is a download file module from url without third party libraries.

if you want to see source code of this module please follow:

[**Android**](https://github.com/hizokazz/rn-video-player-app/tree/main/android/app/src/main/java/com/nativedownloader)

[**iOS**](https://github.com/hizokazz/rn-video-player-app/tree/main/ios/NativeDownloader)

## Example

```javascript
import NativeDownloaders from '../../specs/NativeDownloader';

try {
  await NativeDownloaders.downloadFile('Video url', 'test', 'mp4');
} catch (err) {
  console.error(err);
}
```
