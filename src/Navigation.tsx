import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BootSplash from 'react-native-bootsplash';
import HomeScreen from './screens/HomeScreen';
import VideoScreen from './screens/VideoScreen';
import { AllNavigatorParams } from './types/routes';

const Stack = createNativeStackNavigator();
const navigationRef = createNavigationContainerRef<AllNavigatorParams>();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontFamily: 'IBMPlexSansThai-Bold' } }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Video" component={VideoScreen} options={{ title: 'Video' }} />
    </Stack.Navigator>
  );
}

function RootNavigation() {
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        BootSplash.hide({ fade: true });
      }}
    >
      <RootStack />
    </NavigationContainer>
  );
}

function navigate<K extends keyof AllNavigatorParams>(name: K, params?: AllNavigatorParams[K]) {
  if (navigationRef.isReady()) {
    return Promise.race([
      new Promise<void>(resolve => {
        const handler = () => {
          resolve();
          navigationRef.removeListener('state', handler);
        };
        navigationRef.addListener('state', handler);

        // @ts-ignore
        navigationRef.navigate(name, params);
      }),
    ]);
  }
  return Promise.resolve();
}

export { navigate, RootNavigation };
