/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Dimensions, FlatList, Image, PixelRatio, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../components/app/AppText';
import { demoItem01 } from '../constants/demoItems';
import { navigate } from '../Navigation';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const itemWidth = screenWidth / 2 - 12;

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={demoItem01}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.75} onPress={() => navigate('Video', { demoData: item })}>
            <View style={[styles.demoItemContainer, { width: itemWidth }]}>
              <Image
                style={styles.demoImage}
                source={item.imgUrl.length > 0 ? { uri: item.imgUrl } : item.imgSrc}
                resizeMode="contain"
              />
              <View style={{ marginTop: 16 }}>
                <AppText style={{ fontSize: 18 * PixelRatio.getFontScale(), fontWeight: 'bold' }}>{item.title}</AppText>
                <AppText style={{ fontSize: 12 * PixelRatio.getFontScale() }}>{item.description}</AppText>
              </View>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2}
        style={{ padding: 8 }}
        contentContainerStyle={{ gap: 8, paddingBottom: screenHeight * 0.1 }}
        columnWrapperStyle={{ gap: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  demoItemContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  demoImage: {
    width: '100%',
    height: 200,
  },
});
