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

export const listUsers = async (page, searchText) => {
    try {
      // Assuming you have a table named 'Users' with columns: id, email, hourly_rate, type
      const offset = (page - 1) * 10; // Assuming each page shows 10 users
      const limit = 10; // Number of users to fetch per page
  
      let query = 'SELECT * FROM Users';
      let params = [];
  
      if (searchText) {
        query += ' WHERE email LIKE ?'; // Assuming you want to search by email
        params.push(`%${searchText}%`);
      }
  
      query += ' ORDER BY email DESC'; // Assuming you want to order by the user ID in descending order
      query += ` LIMIT ${limit} OFFSET ${offset}`;
  
      const results = await executeSql(query, params); // Execute the SQL query with parameters
  
      // Format the results as needed, assuming each result row is an object with properties matching the table columns
      const users = results.map((row) => ({
        email: row.email,
        hourly_rate: row.hourly_rate,
        type: row.type,
      }));
  
      return users;
    } catch (error) {
      console.error('Error listing users:', error);
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
