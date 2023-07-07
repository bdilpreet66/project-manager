import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn, setAdmin } from '../store/storage';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const handleManagerLogin = async () => {
    await setLoggedIn(true);
    await setAdmin(true);
    navigation.navigate('ProjectManagerTabs');
  };

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
      <Button title="Sign up as Manager" onPress={handleManagerLogin} />
    </View>
  );
};

export default SignUpScreen;
