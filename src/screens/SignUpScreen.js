import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import theme from '../theme/theme';
import { createUser, searchUsers } from "../store/user";

const Signup = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const toggleHideConfirmPassword = () => {
    setHideConfirmPassword(!hideConfirmPassword);
  };

  const handleSignup = async () => {
    // Simple regex for validation
    let emailCheck = /\S+@\S+\.\S+/;
    let passwordCheck = password.length >= 8;
    let passwordConfirmCheck = password === confirmPassword;

    if (!emailCheck.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    if (!passwordCheck) {
      alert("Password should be at least 8 characters long");
      return;
    }

    if (!passwordConfirmCheck) {
      alert("Passwords do not match");
      return;
    }

    // Search the user in the database
    let userExists = await searchUsers(email);

    if (userExists.length > 0) {
      alert("User already exists");
      return;
    }

    // If validation passes and user doesn't exist, create user
    await createUser(email, password, "admin", 0.0); // Update the type and hourly_rate as per your requirements
    alert("User created successfully");

    // Then redirect the user to the login screen or anywhere you want
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo_icon.png')} style={styles.logo} />
      <Text style={styles.heading}>Signup for AntTask</Text>
      <View style={styles.inputContainer}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor={theme.colors.grey}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor={theme.colors.grey}
            secureTextEntry={hidePassword}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={toggleHidePassword}>
            <Image 
              source={hidePassword ? require('../../assets/eye-closed.png') : require('../../assets/eye-open.png')} 
              style={styles.icon} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={theme.colors.grey}
            secureTextEntry={hideConfirmPassword}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={toggleHideConfirmPassword}>
            <Image 
              source={hideConfirmPassword ? require('../../assets/eye-closed.png') : require('../../assets/eye-open.png')} 
              style={styles.icon} 
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
        <Text>Already have an account? </Text><Text style={styles.link}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// You can reuse the styles from Login component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
  },
  logo: {
    width: 58,
    height: 46,
    alignSelf: 'center', // Center the logo horizontally
    marginTop: 64,
    marginBottom: 20, // Add some spacing below the logo
  },
  heading: {
    fontSize: theme.fontSize.large,
    fontWeight: '600',
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'left',
  },
  inputContainer: {
    width: '90%',  // Or any suitable value
    alignSelf: 'center',
    marginTop: 20,
  },
  input: {
    padding: 10,
    height: 40,
    borderColor: theme.colors.grey,
    borderWidth: 1,
    borderRadius: 5,
    minWidth: "100%"
  },
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.grey,
    borderRadius: 5,
    width: '100%',
    alignSelf: 'center',
  },
  passwordInput: {
    padding: 10,
    height: 40,
    minWidth: "88%"
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 20,   // Or any other dimensions you want
    height: 16,
  },
  label: {
    margin: 8,
    alignSelf: 'center',
  },
  linkContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  link: {
    color: theme.colors.link,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 5,
    width: '90%', // Adjust width as per your requirement
    alignSelf: 'center', // This will center the button
  },
  buttonText: {
    color: theme.colors.white,
    textAlign: 'center', // Center the text inside the button
  },
});

export default Signup;
