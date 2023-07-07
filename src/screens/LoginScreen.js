import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn, setAdmin } from '../store/storage';

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleManagerLogin = async () => {
    await setLoggedIn(true);
    await setAdmin(true);
    navigation.navigate('ProjectManagerTabs');
  };

  const handleMemberLogin = async () => {
    await setLoggedIn(true);
    await setAdmin(false);
    navigation.navigate('MemberTabs');
  };

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      <Button title="Log in as Manager" onPress={handleManagerLogin} />
      <Button title="Log in as Member" onPress={handleMemberLogin} />
    </View>
  );
};

export default LoginScreen;
