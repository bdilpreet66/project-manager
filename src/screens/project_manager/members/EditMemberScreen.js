import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EditMemberScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Edit Member Screen</Text>
    </View>
  );
};

export default EditMemberScreen;
