import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { updateHours, updatePassword } from "../../../store/user"

const EditMemberScreen = () => {
  const route = useRoute();
  const { user } = route.params;
  const navigation = useNavigation();
  const [hours, setHours] = useState('');
  const [password, setPassword] = useState('');
  const [isHoursExpanded, setIsHoursExpanded] = useState(false);
  const [isPasswordExpanded, setIsPasswordExpanded] = useState(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSetHours = async () => {
    if (!hours) {
      alert('Please enter Hourly Rate.');
      return;
    }

    if (!isValidHourlyRate(hours)) {
      alert('Please enter a valid hourly rate.');
      return;
    }

    // If validation passes and user doesn't exist, create user
    await updateHours(user.email, parseFloat(hours)); // Update the type and hourly_rate as per your requirements

    // Then redirect the user to the login screen or anywhere you want
    handleCancel();
  };

  const handleChangePassword = async () => {
    if (!password) {
      alert('Please enter password.');
      return;
    }
  
    if (password.length < 8) {
      alert('Password should be at least 8 characters long.');
      return;
    }

    // If validation passes and user doesn't exist, create user
    await updatePassword(user.email, password); // Update the type and hourly_rate as per your requirements

    // Then redirect the user to the login screen or anywhere you want
    handleCancel();
  };
  
  const isValidHourlyRate = (hourlyRate) => {
    // Hourly rate validation logic
    // You can check if the hourly rate is a valid float greater than or equal to 0
    const rate = parseFloat(hourlyRate);
    return !isNaN(rate) && rate >= 0;
  };

  return (
    <View style={{flex: 1, justifyContent: "center"}}>
      <Text>Edit {user.email}</Text>

      {/* Set Hours Section */}
      <View>
        <Button
          title={isHoursExpanded ? 'Hide Hours' : 'Set Hours'}
          onPress={() => setIsHoursExpanded(!isHoursExpanded)}
        />
        {isHoursExpanded && (
          <View>
            <TextInput
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
              placeholder="Hours"
              value={hours}
              onChangeText={setHours}
            />
            <Button title="Save Hours" onPress={handleSetHours} />
          </View>
        )}
      </View>

      {/* Change Password Section */}
      <View>
        <Button
          title={isPasswordExpanded ? 'Hide Password' : 'Change Password'}
          onPress={() => setIsPasswordExpanded(!isPasswordExpanded)}
        />
        {isPasswordExpanded && (
          <View>
            <TextInput
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
              placeholder="New Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <Button title="Change Password" onPress={handleChangePassword} />
          </View>
        )}
      </View>
    </View>
  );
};

export default EditMemberScreen;
