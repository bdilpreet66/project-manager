import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearUserData } from "../store/creds"

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Here, clear your user's session (e.g. remove the auth token from storage)
    await clearUserData();

    // After that, navigate back to the Login screen
    navigation.navigate('Login'); // change this line
  };

  return (
    <View style={{marginTop: 150}}>
      <Text>Logout</Text>
      <Button title="Go to Login" onPress={handleLogout} />
    </View>
  );
};

export default LogoutScreen;
