import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import theme from '../../../theme/theme';
import commonStyles from '../../../theme/commonStyles';
import { useNavigation } from '@react-navigation/native';

const CreateMemberPage = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [hourlyRate, setHourlyRate] = useState('');

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = () => {
    // Handle save action
  };

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View style={styles.container}>
      <View style={{
          flexDirection: "row",  
          marginTop: 30  
        }}>
        <TouchableOpacity onPress={handleCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
        <Text>Create Member</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text>Save Member</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
      />
      <View style={commonStyles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            autoCapitalize='none'
            onChangeText={setPassword}
            value={password}            
            secureTextEntry={hidePassword}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={toggleHidePassword}>
            <Image 
              source={hidePassword ? require('../../../../assets/eye-closed.png') : require('../../../../assets/eye-open.png')} 
              style={styles.icon} 
            />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 12,    
    paddingVertical: 10,
    minWidth: "88%"
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    width: 20,   // Or any other dimensions you want
    height: 16,
  },
});

export default CreateMemberPage;
