import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Dimensions  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { listUsers } from '../../../store/user'; // Assuming you have the user functions in a file named 'user.js'
import commonStyles from '../../../theme/commonStyles';

const MemberListScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const screenWidth = Dimensions.get('window').width - 40;

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const users = await listUsers(page, searchText); // Fetch members using the 'listUsers' function

      setMembers((prevMembers) => [...prevMembers, ...users]);
      setHasMore(users.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error loading members:', error);
    }

    setLoading(false);
  };

  const handleSearch = async () => {
    // Reset pagination and load members based on the search text
    setMembers([]);
    setHasMore(true);
    setPage(1);
    loadMembers();
  };

  const renderItem = ({ item }) => (    
    <TouchableOpacity style={[{width: screenWidth},styles.listItem]} onPress={() => navigation.navigate('Edit Member', { user: item })}>
      <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
      }}>
        <Text>{item.email}</Text>
        <Text>Hourly Rate: ${item.hourly_rate}</Text>
      </View>
      <View>
        {user.type == "admin" ? 
        <Text style={[commonStyles.badge,commonStyles.badgeSuccess,styles.badge]}>{item.type}</Text> : 
        <Text style={[commonStyles.badge,commonStyles.badgeDefault,styles.badge]}>{item.type}</Text>
        }        
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
      <Text style={commonStyles.heading}>Member Management</Text>
      <Text>Create and modify your team member</Text>      
      <TouchableOpacity style={[commonStyles.button,commonStyles.buttonPrimary,styles.button]} onPress={() => navigation.navigate('Create Member')}>
        <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Create Member</Text>
      </TouchableOpacity>
      <TextInput
        style={[commonStyles.input, styles.search]}        
        placeholder="Search by email"
        value={searchText}
        onChangeText={text => {
          setSearchText(text);
          handleSearch();
        }}        
      />  
      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.email.toString()} // Assuming each member has a unique ID
        onEndReached={loadMembers} // Load more members when reaching the end of the list
        onEndReachedThreshold={0.1} // Trigger the onEndReached callback when 10% of the list is reached
        ListFooterComponent={renderFooter} // Show loading indicator at the bottom while loading more members
      />       
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
  search: {
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: '#F8F8F8', 
    padding: 10, 
    borderRadius: 5, 
    marginTop: 10, 
  },
  badge: {    
    width: 85,
    textAlign: 'center',
    marginTop: 5,    
  },
});

export default MemberListScreen;
