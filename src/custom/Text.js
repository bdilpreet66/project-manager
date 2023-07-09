import React, { useState } from 'react';
import { Text as RNText } from 'react-native';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';

const fetchFonts = () => {
  return Font.loadAsync({
    'Poppins': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),    
  });
};

export const Text = (props) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    if (!fontLoaded) {
      return (
        <AppLoading
          startAsync={fetchFonts}
          onFinish={() => setFontLoaded(true)}
          onError={console.warn}
        />
      );
    }
    
    return <RNText style={[{fontFamily: 'Poppins'}, props.style]}>{props.children}</RNText>;
}