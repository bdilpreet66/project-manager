import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions  } from 'react-native';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import { getTasksByMember } from '../../../store/project'; // Assuming you have the user functions in a file named 'user.js'
import commonStyles from '../../../theme/commonStyles';
import { formatDate } from '../../../common/Date'


const ProjectListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);  

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
    let badgeClass = commonStyles.badge;
    let styles = [badgeClass];
    
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
      <Text style={styles}>{status}</Text>
    )
  }

  const renderItem = ({ item }) => (   
    <TouchableOpacity style={[{width: screenWidth},styles.listItem]} onPress={() => navigation.navigate('View Task', { task: item })}>
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
        <Text>Project - {item.project_name}</Text>
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
    alignItems: 'flex-start',    
    padding: 20,
  },
  search: {
    marginTop: 20,
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: '#F8F8F8', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10, 
  },
});

export default ProjectListScreen;