import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateMemberScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Create Member Screen</Text>
    </View>
  );
};

export default CreateMemberScreen;
