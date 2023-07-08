import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, Image } from 'react-native';
import theme from '../theme/theme';
import { validateLogin } from "../store/user";
import { saveUserData, clearUserData, getUserData } from "../store/creds"

const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    checkLoggedInUser();
  }, []);
  
  const checkLoggedInUser = async () => {
    // Check if there is a logged-in user in AsyncStorage or any other storage mechanism
    const user = await getUserData();

    // Redirect to appropriate screen
    if (user.type === 'admin') {
      navigation.navigate('ProjectManagerTabs', { screen: "Dashboard"});
    } else {
      navigation.navigate('MemberTabs', { screen: "Dashboard"});
    }
  };

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  const handleLogin = async () => {
    // Email validation
    if (!email) {
      // Handle case when email is empty
      alert('Please enter your email');
      return;
    }
  
    // Password validation
    if (!password) {
      // Handle case when password is empty
      alert('Please enter your password');
      return;
    }
  
    // Perform login validation
    const user = await validateLogin(email, password);
    
    if (user.success) {
      // Save user details if rememberMe is true
      if (rememberMe) {
        try {
          await saveUserData({ email: user.data.email, password: user.data.password, type: user.data.type });
        } catch (error) { }
      } else {
        // Clear user details from AsyncStorage
        try {
          await clearUserData();
        } catch (error) { }
      }
  
      // Redirect to appropriate screen
      if (user.type === 'admin') {
        navigation.navigate('ProjectManagerTabs');
      } else {
        navigation.navigate('MemberTabs');
      }
    } else {
      // Handle case when login validation fails
      alert(user.message);
    }
  };  

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo_icon.png')} style={styles.logo} />
      <Text style={styles.heading}>Login to AntTask</Text>
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
      <View style={styles.checkboxContainer}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={styles.label}>Remember me</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('SignUp')}>
        <Text>Don't have an account? </Text><Text style={styles.link}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  checkboxContainer: {
    flexDirection: "row",
    width: '90%',
    justifyContent: "flex-start", 
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
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

export default Login;
