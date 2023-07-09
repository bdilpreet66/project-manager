import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
    <TouchableOpacity onPress={() => navigation.navigate('Edit Member', { item })}>
      <View>
        <Text>Email: {item.email}</Text>
        <Text>Hourly Rate: {item.hourly_rate}</Text>
        <Text>User Type: {item.type}</Text>
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
      <TouchableOpacity style={[commonStyles.button,commonStyles.buttonPrimary]}>
        <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Create Member</Text>
      </TouchableOpacity>
      <TextInput
        style={commonStyles.input}        
        placeholder="Search Members"
        value={searchText}
        onChangeText={text => {
          setSearchText(text);
          handleSearch();
        }}
      />       
    </View>
  );
};

const styles = StyleSheet.create({  
  container: {    
    alignItems: 'flex-start',
    //width: '100%',
    padding: 20,
  },  
  content: {
    //padding: 20
  }
});

export default MemberListScreen;
