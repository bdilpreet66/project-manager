import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ViewProjectScreen = () => {
  const route = useRoute();
  const { project } = route.params;
  const navigation = useNavigation();


  
  return (
    <View>
      <Text>View Project Screen</Text>
      <Button title="View Task" onPress={() => navigation.navigate('View Task')} />
      <Button title="Create Task" onPress={() => navigation.navigate('Create Task', { project })} />
    </View>
  );
};

export default ViewProjectScreen;
