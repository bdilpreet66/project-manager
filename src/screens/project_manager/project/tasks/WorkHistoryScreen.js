import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import commonStyles from '../../../../theme/commonStyles';
import theme from '../../../../theme/theme';
import { listWorkHours } from '../../../../store/project'

const WorkHistoryModal = () => {
  const route = useRoute();
  const { task } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);  

  const [workHistory, setWorkHistory] = useState([]);

  useFocusEffect(useCallback(() => {
    const fetchWorkHistory = async () => {
        setWorkHistory([]);
        setPage(1);
        await loadHours();
    };

    fetchWorkHistory();
  }, []));
  
  const loadHours = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
  
    try {
      const newHours = await listWorkHours(page, task.id); // Fetch projects from the first page
  
      setWorkHistory((prevProjects) => [...prevProjects, ...newHours]);
      setHasMore(newHours.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.listItem,(!item.approved && commonStyles.buttonError)]} >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>{item.recorded_by}</Text>
        <Text>$ {item.cost}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Date: {item.recorded_date}</Text>
          <Text>{item.hours}h : {item.minutes}m</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text></Text>
          <Text>{item.approved ? "Approved" : "Needs Approval"}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity style={[commonStyles.button, commonStyles.buttonError, styles.button]}>
          <Text style={[commonStyles.buttonText, commonStyles.buttonTexError]}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[commonStyles.button, commonStyles.buttonError, styles.button]}>
          <Text style={[commonStyles.buttonText, commonStyles.buttonTexError]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;

    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  return (
      <View style={styles.container}>
        <View style={styles.ctaContainer}> 
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={commonStyles.labelTopNav}>Cancel</Text>
            </TouchableOpacity>      
            <Text style={[commonStyles.labelTopNavHeading,commonStyles.bold]}>Worked Hours</Text>
            <TouchableOpacity>
                <Text style={styles.labelhidden}>Cancel</Text>
            </TouchableOpacity>      
        </View> 
        <View style={styles.modalView}>
            <FlatList
                data={workHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()} // Assuming each member has a unique ID
                onEndReached={loadHours} // Load more projects when reaching the end of the list
                onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
                ListFooterComponent={renderFooter} 
            />
        </View>
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
  listItem: {
    marginBottom: 20,
    backgroundColor: theme.colors.greyBackground,
    borderRadius: 5,
    padding: 10,
  },
  labelhidden: {
    opacity: 0,
  },
});

export default WorkHistoryModal;
