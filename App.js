//import React from 'react';


/*import Navigation from './src/Navigation';

export default function App() {
  // Just for demonstration. Replace it with actual logic
  React.useEffect(() => {
    // Checking login status and user role from storage or API
    // setLoggedIn(true);
    // setManager(true);
  }, []);

  return <Navigation />;
}*/
import React, { useEffect, useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('mydb.db');

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists items (id integer primary key not null, done int, value text);'
      );
    });
  }, []);

  const add = () => {
    db.transaction(
      tx => {
        tx.executeSql('insert into items (done, value) values (0, ?)', ['test']);
        tx.executeSql('select * from items', [], (_, { rows }) =>
          setData(rows._array)
        );
      }
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button onPress={add} title="Add"/>
      {data ? data.map(item => <Text key={item.id}>{item.value}</Text>) : null}
    </View>
  );
}
