import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CreateTaskScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Create Task Screen</Text>
    </View>
  );
};

export default CreateTaskScreen;
