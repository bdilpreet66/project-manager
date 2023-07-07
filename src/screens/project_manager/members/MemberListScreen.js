import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MemberListScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Member List Screen</Text>
      <Button title="Create Member" onPress={() => navigation.navigate('Create Member')} />
      <Button title="Edit Member" onPress={() => navigation.navigate('Edit Member')} />
    </View>
  );
};

export default MemberListScreen;
