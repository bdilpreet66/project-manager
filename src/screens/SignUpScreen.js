import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setLoggedIn, setAdmin } from '../store/storage';
import { registerUser } from '../store/user';

/* const SignUpScreen = () => {
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

export default SignUpScreen;*/

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (email === '' || password === '' || confirmPassword === '' || type === '') {
      Alert.alert('Error', 'All fields must be filled!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      // The registerUser function should check if a user with the provided
      // email already exists and insert a new user into the database if not.
      await registerUser(email, password, 'admin');
      Alert.alert('Success', 'Registration Successful');
    } catch (err) {
      Alert.alert('Error', 'Registration Failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Create an Admin Account</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        onChangeText={setEmail} 
        value={email} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        onChangeText={setPassword} 
        value={password} 
        secureTextEntry
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        onChangeText={setConfirmPassword} 
        value={confirmPassword} 
        secureTextEntry
      />
      <Button title="Register" onPress={handleRegister} />
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
    padding: 8,
  },
});

export default SignUpScreen;

