import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  NativeEventEmitter,
  NativeModules,
  PixelRatio,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import NativeDownloaders from '../../specs/NativeDownloader';
import AppText from '../components/app/AppText';

const { NativeDownloader } = NativeModules;
const downloaderEvents = new NativeEventEmitter(NativeDownloader);

export default function VideoScreen() {
  const route = useRoute();
  const demoData = route.params?.demoData ?? null;

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const sub = downloaderEvents.addListener('DownloadProgress', progress => {
        setDownloadProgress(progress);
      });
      return () => sub.remove();
    }
  }, []);

  async function onPressDownloadFile() {
    setIsDownloading(true);
    try {
      await NativeDownloaders.downloadFile(demoData?.videoUrl, 'test', 'mp4');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  }

  function onPressSelectPlaybackSpeed() {
    setModalVisible(true);
  }

  function onSelectedPlaybackSpeed(rate: number) {
    setPlaybackSpeed(rate);
    setModalVisible(false);
  }

  if (!demoData) {
    return null;
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Button title="0.5x" onPress={() => onSelectedPlaybackSpeed(0.5)} />
              <Button title="1.0x" onPress={() => onSelectedPlaybackSpeed(1)} />
              <Button title="1.5x" onPress={() => onSelectedPlaybackSpeed(1.5)} />
              <Button title="2.0x" onPress={() => onSelectedPlaybackSpeed(2)} />
              <View style={styles.closeModalBtn}>
                <Button title="Close" color={'#b2babb'} onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      )}
      {Platform.OS === 'ios' && !isVideoLoaded && <ActivityIndicator size={'large'} />}
      <Video
        style={styles.videoContainer}
        source={demoData?.videoUrl ? { uri: demoData?.videoUrl } : demoData.videoSrc}
        controls
        playInBackground={true}
        rate={playbackSpeed}
        paused={false}
        allowsExternalPlayback
        onLoad={() => setIsVideoLoaded(true)}
      />
      {Platform.OS === 'android' && <Button title="Playback speed" onPress={onPressSelectPlaybackSpeed} />}
      {demoData?.videoUrl && isVideoLoaded && (
        <View style={styles.footerContainer}>
          <TouchableOpacity activeOpacity={0.75} disabled={isDownloading} onPress={onPressDownloadFile}>
            <View style={[styles.downloadBtn, { backgroundColor: isDownloading ? '#b2babb' : '#000' }]}>
              {isDownloading && <ActivityIndicator size={'large'} />}
              <AppText style={styles.downloadBtnText}>
                {isDownloading ? `Downloading... ${downloadProgress}%` : 'Download video'}
              </AppText>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
  },
  modalContent: { width: '100%', backgroundColor: 'white', padding: 20, borderRadius: 10, gap: 16 },
  videoContainer: { width: '100%', aspectRatio: 16 / 9 },
  footerContainer: {
    flex: 1,
    padding: 16,
  },
  closeModalBtn: { width: '50%', alignSelf: 'flex-end', marginTop: 24 },
  downloadBtn: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  downloadBtnText: { fontSize: 24 * PixelRatio.getFontScale(), color: '#fff' },
});
