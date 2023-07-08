import React, {useState} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn, setAdmin } from '../store/storage';
import { TextInput } from 'react-native-gesture-handler';
import { validateLogin } from '../store/user';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    
    const validateResult = validateLogin(email, password);
    console.log(validateResult);
    /*if (validateResult.success) {
      await setLoggedIn(true);
      if (validateResult.type === 'admin') {
        await setAdmin(true);
        navigation.navigate('ProjectManagerTabs');
      }
      else {
        await setAdmin(false);
        navigation.navigate('MemberTabs');
      }
    }*/
    console.log('Login');

  };

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      <Button title="Log in as Manager" onPress={handleLogin} />
      <Button title="Log in as Member" onPress={handleLogin} />
      <TextInput></TextInput>
      <Text>Email:</Text>
      <TextInput 
        style={styles.input}
        value={email}
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text>Password:</Text>
      <TextInput 
        style={styles.input} 
        value={password}
        onChangeText={setPassword} 
        secureTextEntry // hide the password input
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default LoginScreen;
