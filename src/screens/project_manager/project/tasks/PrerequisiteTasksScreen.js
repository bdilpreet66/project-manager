import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, FlatList,TouchableOpacity } from 'react-native';
import { navigation, useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { getAvailableTasks, createPrerequisite, deletePrerequisite } from '../../../../store/project';

const PrerequisiteTasksScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { project, task } = route.params;
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
        fetchTasks();
    }, [])
);

  const fetchTasks = async () => {
    const fetchedTasks = await getAvailableTasks(project.id, task.id);
    setTasks(fetchedTasks);
    setFilteredTasks(fetchedTasks);
  };

  useEffect(() => {
    filterTasks(search);
  }, [search]);

  const filterTasks = (query) => {
    const filtered = tasks.filter(task => task.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredTasks(filtered);
  };

  const toggleSwitch = async (preReq, value) => {
    try {
        if (value) {
            await createPrerequisite(task.id, preReq.id);
        } else {
            await deletePrerequisite(task.id, preReq.id);
        }
        fetchTasks();
    } catch (error) {
        console.error('Error in toggleSwitch:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.itemContainer]} >
        <Text>{item.name}</Text>
        <Switch 
            onValueChange={(value) => toggleSwitch(item, value)}
            value={item.isPreReq ? true : false}
        />
    </View>
  );

  return (
    <View style={styles.container}>
        <View style={styles.ctaContainer}> 
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={commonStyles.labelTopNav}>Cancel</Text>
            </TouchableOpacity>      
            <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Prerequisites</Text>
            <TouchableOpacity>
                <Text style={styles.labelhidden}>Cancel</Text>
            </TouchableOpacity>      
        </View> 
        <TextInput
            style={commonStyles.input}
            placeholder="Search tasks..."
            value={search}
            onChangeText={setSearch}
        />
        <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: theme.colors.white,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: theme.colors.greyBackground,
    borderRadius: 5,
    padding: 10,
  },
  ctaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
    paddingTop: 60,    
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  labelhidden: {
    opacity: 0,
  }
});

export default PrerequisiteTasksScreen;