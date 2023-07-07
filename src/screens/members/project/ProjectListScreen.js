import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProjectListScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Project List Screen</Text>
      <Button title="View Project" onPress={() => navigation.navigate('View Project')} />
    </View>
  );
};

export default ProjectListScreen;
