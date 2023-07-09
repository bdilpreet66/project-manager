import React from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { clearUserData} from "../store/creds"
import commonStyles from '../theme/commonStyles';

const LogoutScreen = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    // Here, clear your user's session (e.g. remove the auth token from storage)
    await clearUserData();
    // After that, navigate back to the Login screen
    navigation.navigate('Login'); // change this line
  };

  return (   
    <View style={styles.container}>
      <Image source={require('../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain' />
      <Image source={require('../../assets/logout.png')} resizeMode='cover' />      
      <TouchableOpacity style={[commonStyles.button,commonStyles.buttonError]} onPress={handleLogout}>
        <Text style={[commonStyles.buttonText,commonStyles.buttonTexError]}>Log Out</Text>
      </TouchableOpacity>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10, // You might want some padding to ensure the items are not stuck to the edges of the screen
  }
});

export default LogoutScreen;
