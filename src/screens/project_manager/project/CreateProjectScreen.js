import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateProjectScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Create Project Screen</Text>
    </View>
  );
};

export default CreateProjectScreen;
