import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, Alert  } from 'react-native';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { getTasksByMember, listIncompletePrerequisite } from '../../../store/project'; // Assuming you have the user functions in a file named 'user.js'
import commonStyles from '../../../theme/commonStyles';
import { formatDate } from '../../../common/Date'
import theme from '../../../theme/theme';

const ProjectListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);  
  //const [prerequisites, setPrerequisites] = useState([]);
  //const [modalVisible, setModalVisible] = useState(false);

  const screenWidth = Dimensions.get('window').width - 40;
  
  useFocusEffect(
    useCallback(() => {
      handleSearch();
      // return a cleanup function if necessary
      return () => {};
    }, [])
  );
  
  const loadTasks = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
  
    try {
      const newTasks = await getTasksByMember(page, searchText); // Fetch tasks from the first page
  
      setTasks((prevTasks) => [...prevTasks, ...newTasks]);
      setHasMore(newTasks.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  
    setLoading(false);
  };

  const handleSearch = async () => {
    // Reset pagination and load tasks based on the search text
    setPage(1);
    setTasks([]);
    setHasMore(true);
    loadTasks();
  };

  const statusBadge = (status) => {    
    let styles = [commonStyles.badge];
    
    if (status === 'pending') {
      styles.push(commonStyles.badgeWarning);
    }
    
    if (status === 'completed') {
      styles.push(commonStyles.badgeSuccess);
    }
    
    if (status === 'in-progress') {
      styles.push(commonStyles.badgeInfo);
    }
    
    if (status === 'overdue') {
      styles.push(commonStyles.badgeError);
    }
    
    return (
      <><View style={styles}><Text style={ {color: theme.colors.white} }>{status}</Text></View></>
    )
  }

  const handleTaskView = async (task) => { 
    const prerequisitesData = await listIncompletePrerequisite(task.id);
    if (prerequisitesData.length > 0) {
      Alert.alert('Message', 'This task is not allowed to view as it has incomplete pre-requisites.');
    }
    else {
      navigation.navigate('View Task', {task})
     }
    //setPrerequisites(prerequisitesData);
    //setModalVisible(true);
  }

  const renderItem = ({ item }) => (   
    <TouchableOpacity style={[styles.listItem]} onPress={() => handleTaskView(item)}>
      <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
      }}>
        <Text>{ item.id}#. {item.name}</Text>
        <Text>Due - { formatDate(item.end_date) }</Text>
      </View>
      <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
      }}>
        <Text>{statusBadge(item.status)}</Text>
        <Text>{item.project_name}</Text>
      </View>
    </TouchableOpacity>    
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  return (
    <View style={[commonStyles.container,styles.container]}>
      <Image source={require('../../../../assets/Logo.png')} style={commonStyles.logoLabel} resizeMode='contain'/>
      <Text style={commonStyles.heading}>My Tasks</Text>
      <TextInput
        style={[commonStyles.input, styles.search]}        
        placeholder="Search by tasks"
        value={searchText}
        onChangeText={ setSearchText }
        onSubmitEditing={ handleSearch }
        returnKeyType="search"      
      />
      <FlatList
        data={tasks}
        style={{width:"100%"}}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Assuming each member has a unique ID
        onEndReached={loadTasks} // Load more tasks when reaching the end of the list
        onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
        ListFooterComponent={renderFooter} // Show loading indicator at the bottom while loading more tasks
      />
    </View>
  );
};

const styles = StyleSheet.create({  
  container: {       
    padding: 20,
  },
  search: {
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: '#F8F8F8',
    width: "100%",
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10, 
  },
});

export default ProjectListScreen;