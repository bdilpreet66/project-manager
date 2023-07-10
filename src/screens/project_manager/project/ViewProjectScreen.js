import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../../../theme/commonStyles';
import { updateProjectByID, getTasksByProject } from './../../../store/project'
import theme from '../../../theme/theme';

const ViewProjectScreen = () => {
  const route = useRoute();
  const { project } = route.params;
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);

  const screenWidth = Dimensions.get('window').width - 40;

  const [projectData, setProjectData] = useState({
    id: project.id,
    name: project.name,
    description: project.description,
    total_cost: project.total_cost,
    status: project.status,
    completion_date: project.completion_date,
    created_by: project.created_by,
  });

  useEffect(() => {
    (async () => {
      const taskData = await getTasksByProject(project.id);
      setTasks(taskData);
    })();
  }, []);

  const handleSave = async () => {
    try {
        await updateProjectByID(projectData.id, projectData);
        Alert.alert('Success', 'Project details saved successfully.');
    } catch (error) {
        console.error('Error saving project data:', error);
        Alert.alert('Error', 'Failed to save project details.');
    }
  };

  const renderItem = ({ item }) => (    
    <TouchableOpacity style={[styles.listItem]} onPress={() => navigation.navigate('View Task', { project: project, task: item })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>{item.id}# {item.name}</Text>
        <Text>Due Date: {item.end_date}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {item.status == "pending" ? 
          <Text style={[commonStyles.badge,commonStyles.badgeWarning,styles.badge]}>{item.status}</Text> : 
          <Text style={[commonStyles.badge,commonStyles.badgeDefault,styles.badge]}>{item.status}</Text>
          }
          <Text>Assigned To: {item.assigned_to}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
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
        <View style={[styles.inputContainer]}>
          <Text style={commonStyles.inputLabel}>Status</Text>
        </View>
        <View style={[styles.staticContent]}>
          {projectData.status === 'pending' ?
            <Text style={[commonStyles.inputLabel,commonStyles.badge,commonStyles.badgeWarning,styles.status]}>Incomplete</Text>
          :
            <Text style={[commonStyles.inputLabel,]}>Completed</Text>
          }        
        </View>            
        <View style={styles.inputContainer}>
          <Text style={commonStyles.inputLabel}>Total Cost</Text>        
        </View>            
        <View style={[styles.staticContent]}>
          <Text style={[commonStyles.inputLabel,styles.staticContent]}>$100.00</Text>
          <Text style={[commonStyles.link,commonStyles.underline]}>View Logs</Text>
        </View>
      </View>       
      <View>
        {tasks.map(
          (item) => (    
            <TouchableOpacity style={[styles.listItem]} onPress={() => navigation.navigate('View Task', { project: project, task: item })}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text>{item.id}# {item.name}</Text>
                <Text>Due Date: {item.end_date}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.status == "pending" ? 
                  <Text style={[commonStyles.badge,commonStyles.badgeWarning,styles.badge]}>{item.status}</Text> : 
                  <Text style={[commonStyles.badge,commonStyles.badgeDefault,styles.badge]}>{item.status}</Text>
                  }
                  <Text>Assigned To: {item.assigned_to}</Text>
              </View>
            </TouchableOpacity>
          )
        )}
      </View> 
      <View style={styles.ctaContainer}>      
        <TouchableOpacity style={[commonStyles.button,commonStyles.buttonPrimary,styles.button]} onPress={() => navigation.navigate('Create Task',{ project: projectData } )}>
          <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Create Task</Text>
        </TouchableOpacity>  
      </View>   
    </ScrollView>
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
  },
  staticContent: {
    backgroundColor: theme.colors.greyBackground,
    padding: 10,
    borderRadius: 5,
    width: '100%',
    display: 'flex',
  },
  status:{
    width: 100,
    textAlign: 'center',
  },
});

export default ViewProjectScreen;
