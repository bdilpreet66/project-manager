import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ViewProjectScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>View Project Screen</Text>
      <Button title="View Task" onPress={() => navigation.navigate('View Task')} />
      <Button title="Create Task" onPress={() => navigation.navigate('Create Task')} />
    </View>
  );
};

export default ViewProjectScreen;
