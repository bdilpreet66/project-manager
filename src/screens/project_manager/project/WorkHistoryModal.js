import React, { useState, useEffect } from 'react';
import { Modal, View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { getWorkHistoryByProjectId } from './../../../store/project';
import commonStyles from '../../../theme/commonStyles';

const WorkHistoryModal = ({ projectId, modalVisible, setModalVisible }) => {
  const [workHistory, setWorkHistory] = useState([]);

  useEffect(() => {
    const fetchWorkHistory = async () => {
      if (projectId) {
        const result = await getWorkHistoryByProjectId(projectId);
        setWorkHistory(result);
      }
    };

    fetchWorkHistory();
  }, [projectId]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>Task ID: {item.task_id}</Text>
      <Text>Task Name: {item.task_name}</Text>
      <Text>Assigned To: {item.assigned_to}</Text>
      <Text>Recorded Date: {item.recorded_date}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Work History</Text>
            <FlatList
                data={workHistory}
                renderItem={renderItem}
                keyExtractor={(item) => item.task_id.toString()}
            />            
            <TouchableOpacity style={[commonStyles.button, commonStyles.buttonPrimary]} onPress={() => setModalVisible(false)}>
                <Text style={[commonStyles.buttonText,commonStyles.buttonTextPrimary]}>Close</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  itemContainer: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    padding: 10,
    marginVertical: 5,
  },
});

export default WorkHistoryModal;
