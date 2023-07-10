import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert, Image, Text, TouchableOpacity } from 'react-native';
import commonStyles from '../../../theme/commonStyles';
import { addProject } from '../../../store/project';
import { useNavigation } from '@react-navigation/native';

const CreateProjectScreen = () => { 
  const navigation = useNavigation(); 
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");  

  const handleCreateProject = () => {
    let errMessage = "";
    if (!name) {
       errMessage +=  "Name is required.";
    }
    if (!description) {
      errMessage +=  "\nDescription is required.";      
    }
    if (errMessage != "") {
      Alert.alert(errMessage);
    }
    else {
      addProject(name,description);      
      Alert.alert("Success", "Project created successfully.",[
        {
          text: 'OK',
          onPress: () => navigation.navigate('Project List'),      
        },        
      ]);
    }      
  }

  return (
      <View style={[commonStyles.container,styles.container]}>
          <Image source={require('../../../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain'/>
          <Text style={commonStyles.heading}>Project Management</Text>
          <Text>Create and modify your projects</Text>
          <View style={styles.inputContainer}>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={commonStyles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={[commonStyles.input,{ height: 140 }]}
            />   
          </View>          
          <TouchableOpacity style={[commonStyles.button,commonStyles.buttonPrimary, styles.button]} onPress={handleCreateProject}>
            <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Create Project</Text>
          </TouchableOpacity>                 
      </View>
  );
};

const styles = StyleSheet.create({  
  container: {    
    alignItems: 'flex-start',    
    padding: 20,
  },  
  button: {
    marginTop: 20,
    marginBottom: 20,   
  }, 
  inputContainer: {
    marginTop: 20,
  } 
});

export default CreateProjectScreen;