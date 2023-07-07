import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearData } from '../store/storage';

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Here, clear your user's session (e.g. remove the auth token from storage)
    await clearData();

    // After that, navigate back to the Login screen
    navigation.navigate('Login'); // change this line
  };

  return (
    <View>
      <Text>You have been logged out.</Text>
      <Button title="Go to Login" onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
