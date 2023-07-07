import AsyncStorage from '@react-native-async-storage/async-storage';

export const setLoggedIn = async (value) => {
  try {
    await AsyncStorage.setItem('isLoggedIn', value.toString());
  } catch (e) {
    // Saving error
  }
}

export const getLoggedIn = async () => {
    const value = await AsyncStorage.getItem('isLoggedIn');
    return value === 'true'; // return false if value is not 'true'
};
  

export const setAdmin = async (value) => {
  try {
    await AsyncStorage.setItem('isAdmin', value.toString());
  } catch (e) {
    // Saving error
  }
}
  
export const getAdmin = async () => {
  const value = await AsyncStorage.getItem('isAdmin');
  return value === 'true'; // return false if value is not 'true'
};

export const clearData = async () => {
  try {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('isAdmin');
  } catch(e) {
    // Removing error
  }
}
