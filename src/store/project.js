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

export const getAvailableTasks = async (projectId, currentTaskId) => {
  try {
    let query = `SELECT * FROM Tasks WHERE project_id = ${projectId} AND id != ${currentTaskId}`;

    const results = await executeSql(query, []); // Execute the SQL query with parameters

    // Format the results as needed, assuming each result row is an object with properties matching the table columns
    let tasks = results.map((row) => ({
      id: row.id,
      name: row.name,
    }));

    // Remove tasks for which the current task is a prerequisite
    const prerequisiteQuery = `SELECT * FROM Prerequisites WHERE prerequisite_task_id = ${currentTaskId}`;
    const prerequisiteResults = await executeSql(prerequisiteQuery, []);
    const prerequisiteIds = prerequisiteResults.map((row) => row.task_id);
    tasks = tasks.filter((task) => !prerequisiteIds.includes(task.id));

    return tasks;
  } catch (error) {
    console.error('Error listing tasks:', error);
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

export const updateProjectByID = async (id, projectData) => {
  try {
      const { name, description } = projectData;

      let query = `
          UPDATE Projects 
          SET 
              name = '${name}', 
              description = '${description}'                            
          WHERE id = ${id};
      `;

      let params = [];
      console.log(id);

      console.log('Project Update Query: ' + query);
      const results = await executeSql(query, params);

      if (results.rowsAffected > 0) {
          console.log('Project updated successfully.');
      } else {
          console.log('No project found with the provided ID.');
      }
      return results.rowsAffected > 0;
  } catch (error) {
      console.error('Error updating project:', error);
      throw error;
  }
};

// project.js
export const createTask = async (task) => {
  try {
    let query = `INSERT INTO Tasks (name, description, start_date, end_date, assigned_to, status, project_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      task.name,
      task.description,
      task.start_date,
      task.end_date,
      task.assigned_to,
      task.status,
      task.project_id,
    ];

    await executeSql(query, params);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};
