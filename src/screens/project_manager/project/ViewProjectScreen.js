import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../../../theme/commonStyles';
import { updateProjectByID } from './../../../store/project'
import theme from '../../../theme/theme';

const ViewProjectScreen = () => {
  const route = useRoute();
  const { project } = route.params;
  const navigation = useNavigation();

  const [projectData, setProjectData] = useState({
    id: project.id,
    name: project.name,
    description: project.description,
    total_cost: project.total_cost,
    status: project.status,
    completion_date: project.completion_date,
    created_by: project.created_by,
  });

  const handleSave = async () => {
    try {
        await updateProjectByID(projectData.id, projectData);
        Alert.alert('Success', 'Project details saved successfully.');
    } catch (error) {
        console.error('Error saving project data:', error);
        Alert.alert('Error', 'Failed to save project details.');
    }
  };

  return (
    <>
    <View style={styles.ctaContainer}> 
      <TouchableOpacity onPress={() => navigation.navigate('Project List')}>
        <Text style={commonStyles.labelTopNav}>Cancel</Text>
      </TouchableOpacity>      
      <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Project Details</Text>
      <TouchableOpacity onPress={handleSave}>
        <Text style={commonStyles.labelTopNav}>Save</Text>
      </TouchableOpacity>      
    </View>  
    <View style={[commonStyles.container, styles.container]}>      
      <View style={styles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Name</Text>
        <TextInput
            value={projectData.name}                
            style={commonStyles.input}
            onChangeText={(text) => setProjectData({ ...projectData, name: text })}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Description</Text>
        <TextInput
            value={projectData.description}            
            multiline
            numberOfLines={4}
            style={[commonStyles.input,{ height: 140 }]}
            onChangeText={(text) => setProjectData({ ...projectData, description: text })}
        />                                    
      </View>
      <View style={styles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Status</Text>
        <Text style={commonStyles.inputLabel}>Incomplete</Text>
      </View>            
      <View style={styles.inputContainer}>
        <Text style={commonStyles.inputLabel}>Total Cost</Text>
        <Text style={commonStyles.inputLabel}>$100.00</Text>
      </View>            
    </View>   
    <View style={styles.ctaContainer}>      
      <TouchableOpacity style={[commonStyles.button,commonStyles.buttonPrimary,styles.button]} onPress={() => navigation.navigate('Create Task',{ project: projectData } )}>
        <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Create Task</Text>
      </TouchableOpacity>  
    </View> 
    </>
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
    width: 'auto',
    position: 'absolute',
    right: 20,
    bottom: 0,
  }, 
  inputContainer: {
    marginTop: 20,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    paddingTop: 60,    
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
  },
  ctaButton: {    
    width: 'auto',    
    borderWidth: 2,
    borderColor: theme.colors.primary,
    position: 'absolute',
    right: 20,
    bottom: 0,
  },
  ctaButtonText: {
    color: theme.colors.black,    
  } 
});

export default ViewProjectScreen;
