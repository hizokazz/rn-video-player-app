import React from 'react';
import { PixelRatio, StyleSheet, Text, TextProps } from 'react-native';

export default function AppText(
  props: React.JSX.IntrinsicAttributes & React.JSX.IntrinsicClassAttributes<Text> & Readonly<TextProps>,
) {
  return <Text style={[styles.text, { fontSize: 16 * PixelRatio.getFontScale() }, props.style]} {...props} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'IBMPlexSansThai-Regular',
  },
});
