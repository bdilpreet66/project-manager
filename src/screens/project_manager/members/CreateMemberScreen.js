import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUserData } from "../../../store/creds";
import { searchUsers, createUser } from "../../../store/user"

const CreateMemberPage = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!email || !password || !hourlyRate) {
      alert('Please fill in all fields.');
      return;
    }
  
    if (!isValidEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    if (password.length < 8) {
      alert('Password should be at least 8 characters long.');
      return;
    }
  
    if (!isValidHourlyRate(hourlyRate)) {
      alert('Please enter a valid hourly rate.');
      return;
    }

    let userExists = await searchUsers(email);

    if (userExists.length > 0) {
      alert("User already exists");
      return;
    }

    user = await getUserData();

    // If validation passes and user doesn't exist, create user
    await createUser(email, password, "admin", 0.0, user.email); // Update the type and hourly_rate as per your requirements

    // Then redirect the user to the login screen or anywhere you want
    handleCancel();
  };

  const isValidEmail = (email) => {
    // Email validation logic
    // You can use regular expressions or any other validation library to validate the email format
    // Here's a simple example using a regular expression
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };
  
  const isValidHourlyRate = (hourlyRate) => {
    // Hourly rate validation logic
    // You can check if the hourly rate is a valid float greater than or equal to 0
    const rate = parseFloat(hourlyRate);
    return !isNaN(rate) && rate >= 0;
  };

  return (
    <View style={styles.container}>
      <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',  
          marginTop: 30,
        }}>
        <TouchableOpacity onPress={handleCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <Text>Create Member</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
      />
      <TextInput
        style={styles.input}
        onChangeText={setHourlyRate}
        value={hourlyRate}
        placeholder="Hourly Rate"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateMemberPage;
