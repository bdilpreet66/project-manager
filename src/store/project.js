import { executeSql } from './storage';
import { getUserData } from './creds';

export const listProjects = async (page, searchText) => {
    try {
      const offset = (page - 1) * 10; // Assuming each page shows 10 projects
      const limit = 10; // Number of projects to fetch per page
  
      let query = 'SELECT * FROM Projects';
      let params = [];
  
      user = await getUserData(); 
  
      if (searchText) {
        query += ` WHERE created_by = '${user.email}' AND 
                  (Lower(name) LIKE '%${searchText.toLowerCase()}%' OR
                   Lower(description) LIKE '%${searchText.toLowerCase()}%')`; 
      } else {
        query += ` WHERE created_by = '${user.email}'`
      }
  
      query += ' ORDER BY id DESC'; // Assuming you want to order by the project ID in descending order
      query += ` LIMIT ${limit} OFFSET ${offset}`;

      console.log(query)
      const results = await executeSql(query, params); // Execute the SQL query with parameters
      console.log(results)
  
      // Format the results as needed, assuming each result row is an object with properties matching the table columns
      const projects = results.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        total_hours_worked: row.total_hours_worked,
        completion_date: (row.completion_date === null) ? "" : row.completion_date,
        created_by: row.created_by,
        status: row.status,
      }));
  
      return projects;
    } catch (error) {
      console.error('Error listing projects:', error);
      throw error;
    }
};


export const addProject = async (name, description) => {
  try {
    const user = await getUserData(); 

    let query = `INSERT INTO Projects (name, description, created_by) VALUES ('${name}','${description}','${user.email}')`;
    let params = [];    
    
    console.log('Project Add Query: ' + query);
    const results = await executeSql(query, params); // Execute the SQL query with parameters
    return results;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};
