import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { listUsers } from '../../../store/user'; // Assuming you have the user functions in a file named 'user.js'

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
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      <Image source={require('../../../../assets/Logo.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Member List</Text>
      <Text>Create and modify your team member</Text>
        <TextInput
          style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
          placeholder="Search Members"
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            handleSearch();
          }}
        />
      <Button title="Create Member" onPress={() => navigation.navigate('Create Member')} />
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

export default MemberListScreen;
