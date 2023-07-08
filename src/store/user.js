import { executeSql, initializeDB } from './storage';

export const createUser = async (email, password, type, hourly_rate) => {
    try {
        await executeSql('INSERT INTO Users (email, password, type, hourly_rate) VALUES (?, ?, ?, ?)', [email, password, type, hourly_rate]);
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
};

export const updateUser = async (email, password, type, hourly_rate) => {
    try {
        await executeSql('UPDATE Users SET password = ?, type = ?, hourly_rate = ? WHERE email = ?', [password, type, hourly_rate, email]);
    } catch (error) {
        console.error("Error updating user: ", error);
        throw error;
    }
};

export const deleteUser = async (email) => {
    try {
        await executeSql('DELETE FROM Users WHERE email = ?', [email]);
    } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
    }
};

export const listUsers = async () => {
    try {
        const users = await executeSql('SELECT * FROM Users');
        return users;
    } catch (error) {
        console.error("Error listing users: ", error);
        throw error;
    }
};

export const searchUsers = async (email) => {
    try {
        const users = await executeSql('SELECT * FROM Users WHERE email = ?', [email]);
        return users;
    } catch (error) {
        console.error("Error searching users: ", error);
        throw error;
    }
};

export const checkAdmin = async (email) => {
    try {
        const users = await executeSql('SELECT * FROM Users WHERE email = ? AND type = "admin"', [email]);
        return users.length > 0;
    } catch (error) {
        console.error("Error checking admin: ", error);
        throw error;
    }
};

export const validateLogin = async (email, password) => {
    try {
      const users = await searchUsers(email);
  
      if (users.length > 0) {
        const user = users[0];
  
        if (user.password === password) {
          return { success: true, data: user, message: 'User login successful.' };
        } else {
          return { success: false, data: '', message: 'Incorrect password.' };
        }
      } else {
        return { success: false, data: '', message: 'User not found.' };
      }
    } catch (error) {
      console.error('Error validating login:', error);
      throw error;
    }
};

export const initializeUsers = async () => {
    try {
        await initializeDB();
    } catch (error) {
        console.error("Error initializing users: ", error);
        throw error;
    }
};
