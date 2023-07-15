import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import commonStyles from '../../../theme/commonStyles';
import { updateProjectByID, getTasksByProject, getProjectTotalCost } from './../../../store/project';
import theme from '../../../theme/theme';
import { formatDate } from '../../../common/Date';
import WorkHistoryModal from './WorkHistoryModal';
import { Ionicons } from '@expo/vector-icons';

const ViewProjectScreen = () => {
  const route = useRoute();
  const { project } = route.params;
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [totalCost, serTotalCost] = useState('0.00');
  const [modalVisible, setModalVisible] = useState(false);

  const [projectData, setProjectData] = useState({
    id: project.id,
    name: project.name,
    description: project.description,
    total_cost: project.total_cost,
    status: project.status,
    completion_date: project.completion_date,
    created_by: project.created_by,
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const taskData = await getTasksByProject(project.id);
        setTasks(taskData);

      const totalCost = await getProjectTotalCost(project.id);    
      serTotalCost(totalCost);
      })();

    }, [])
  );

  const handleSave = async () => {
    try {
        await updateProjectByID(projectData.id, projectData);
        Alert.alert('Success', 'Project details saved successfully.');
    } catch (error) {
        console.error('Error saving project data:', error);
        Alert.alert('Error', 'Failed to save project details.');
    }
  };

  const statusBadge = (status, end) => {    
    let badgeClass = commonStyles.badge;
    let styles = [badgeClass];

    if ((new Date(end)) > (new Date())){    
      if (status === 'pending') {
        styles.push(commonStyles.badgeWarning);
      }
      
      if (status === 'in-progress') {
        styles.push(commonStyles.badgeInfo);
      }
    } else {
      styles.push(commonStyles.badgeError);
      if (status !== 'completed'){
        status = "overdue"
      }
    }
      
    if (status === 'completed') {
      styles.push(commonStyles.badgeSuccess);
    }
    
    return (
      <Text style={styles}>{status}</Text>
    )
  }

  return (
    <View style={styles.scroll}>
      <View style={styles.ctaContainer}> 
        <TouchableOpacity onPress={() => navigation.navigate('Project List')}>
          <Text style={commonStyles.labelTopNav}>Cancel</Text>
        </TouchableOpacity>      
        <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Project Details</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={commonStyles.labelTopNav}>Save</Text>
        </TouchableOpacity>      
      </View> 
      <ScrollView> 
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
            <Text style={[commonStyles.inputLabel]}>$ {totalCost}</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={[commonStyles.link,commonStyles.underline]}>View Logs</Text>
            </TouchableOpacity>            
          </View>
          <WorkHistoryModal 
            projectId={project.id} 
            modalVisible={modalVisible} 
            setModalVisible={setModalVisible} 
          />
        </View>   
        
        <View style={styles.taskHeaderContainer}>
          <Text style={[commonStyles.bold]}>Task List</Text>
          <TouchableOpacity style={[]} onPress={() => navigation.navigate('Create Task',{ project: projectData } )}>
            <Text style={[styles.createTaskButton]}>Create Task <Ionicons name="add-circle-outline" size={16}/></Text>
          </TouchableOpacity>  
        </View>

        <View style={styles.taskList}>
          {tasks.map(
            (item) => (    
              <TouchableOpacity style={[styles.listItem]} onPress={() => navigation.navigate('View Task', { project: project, task: item })}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{item.id}# {item.name}</Text>
                  <Text>Due: {formatDate(item.end_date)}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    {statusBadge(item.status, item.end_date)}
                    <Text>{item.assigned_to}</Text>
                </View>
              </TouchableOpacity>
            )
          )}
        </View>    
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({  
  container: {    
    alignItems: 'flex-start',    
    padding: 20
  },  
  button: {
    width: 'auto',
    paddingVertical: 10,    
    marginBottom: 0,

  }, 
  inputContainer: {
    marginTop: 20,
  },
  taskHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    marginTop: 30,
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
    width: 130,
    textAlign: 'center',
  },
  listItem: {
    marginBottom: 20,
    backgroundColor: theme.colors.greyBackground,
    borderRadius: 5,
    padding: 10,
  },
  scroll: {
    backgroundColor: theme.colors.white,
    height: "100%",
    marginBottom: 90
  },
  taskList: {
    marginTop: 0,
    padding: 20,
  },
  createTaskButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  }
});

export default ViewProjectScreen;
