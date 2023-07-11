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
    let query = `SELECT Tasks.id, Tasks.name,
                    CASE WHEN EXISTS (SELECT 1 FROM Prerequisites 
                                      WHERE Prerequisites.prerequisite_task_id = Tasks.id 
                                      AND Prerequisites.task_id = ${currentTaskId})
                        THEN 1 
                        ELSE 0 
                    END AS isPreReq
                FROM Tasks
                WHERE Tasks.project_id = ${projectId}
                AND Tasks.id != ${currentTaskId}
                AND NOT EXISTS (
                SELECT 1 FROM Prerequisites 
                WHERE Prerequisites.prerequisite_task_id = ${currentTaskId} 
                AND Prerequisites.task_id = Tasks.id)`;

    const results = await executeSql(query, []); // Execute the SQL query with parameters
    console.log(results)
    // Format the results as needed, assuming each result row is an object with properties matching the table columns
    let tasks = results.map((row) => ({
      id: row.id,
      name: row.name,
      isPreReq: Boolean(row.isPreReq),
    }));
    
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

export const updateTask = async (task) => {
  try {
    console.log("GO: ", task)
    let query = 'UPDATE Tasks SET name = ?, description = ?, start_date = ?, end_date = ?, assigned_to = ?, status = ? WHERE id = ?';
    const params = [
      task.name,
      task.description,
      task.start_date,
      task.end_date,
      task.assigned_to,
      task.status,
      task.id,
    ];

    console.log(query)
    await executeSql(query, params);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};


export const getTasksByProject = async (projectId) => {
  try {
    let query = `SELECT * FROM Tasks WHERE project_id = ${projectId}`;

    const results = await executeSql(query, []); // Execute the SQL query with parameters

    // Format the results as needed, assuming each result row is an object with properties matching the table columns
    let tasks = results.map((row) => ({
      id: row.id,
      name: row.name,
      end_date: row.end_date,
      start_date: row.start_date,
      assigned_to: row.assigned_to,
      status: row.status,
      description: row.description
    }));    

    return tasks;
  } catch (error) {
    console.error('Error listing tasks:', error);
    throw error;
  }
};

export const getProjectTotalCost = async (projectId) => {
  try {
    let query = `SELECT SUM(WorkHours.hours * Users.hourly_rate) AS total_cost
    FROM Projects 
    INNER JOIN Tasks ON Projects.id = Tasks.project_id 
    INNER JOIN WorkHours ON Tasks.id = WorkHours.task_id 
    INNER JOIN Users ON WorkHours.recorded_by = Users.email 
    WHERE Projects.id = ${projectId};`;
    const results = await executeSql(query, []); 
    return results;
  } catch (error) {
    console.log('Error calculating project cost.');
    throw error;
  }
}

export const getWorkHistoryByProjectId = async (projectId) => {
  try {
      let query = `
          SELECT 
              Tasks.id AS task_id,
              Tasks.name AS task_name,
              Tasks.assigned_to,
              WorkHours.recorded_date
          FROM Tasks 
          INNER JOIN WorkHours ON Tasks.id = WorkHours.task_id 
          WHERE Tasks.project_id = ?
          ORDER BY WorkHours.recorded_date DESC`;

      let params = [projectId];

      const results = await executeSql(query, params);
            
      return results;
  } catch (error) {
      console.error('Error retrieving work history:', error);
      throw error;
  }
};

export const isIndirectDependency = async (taskId, prerequisiteTaskId) => {
  let query = `SELECT prerequisite_task_id FROM Prerequisites WHERE task_id = ?`;
  let params = [prerequisiteTaskId];

  const results = await executeSql(query, params);

  if (results.length > 0) {
    for (let i = 0; i < results.length; i++) {
      let row = results[i];
      if (row.prerequisite_task_id === taskId) {
        return true;
      } else {
        let indirect = await isIndirectDependency(taskId, row.prerequisite_task_id);
        if (indirect) {
          return true;
        }
      }
    }
  }

  return false;
};

export const createPrerequisite = async (taskId, prerequisiteTaskId) => {
  try {
    if (await isIndirectDependency(taskId, prerequisiteTaskId)) {
      throw new Error(`Task ID #${taskId} is an indirect dependency of Task ID #${prerequisiteTaskId}.`);
    }

    let query = `INSERT INTO Prerequisites (task_id, prerequisite_task_id) VALUES (?, ?)`;

    await executeSql(query, [taskId, prerequisiteTaskId]);

    console.log(`Prerequisite created: Task ${prerequisiteTaskId} is a prerequisite for Task ${taskId}`);
  } catch (error) {
    console.error('Error creating prerequisite:', error);
    throw error;
  }
};

export const listPrerequisite = async (taskId) => {
  try {
    let query = `SELECT * FROM Prerequisites WHERE task_id = ${taskId}`;

    const results = await executeSql(query, []);

    let tasks = results.map((row) => ({
      id: row.id,
      prerequisite_task_id: row.prerequisite_task_id,
    }));

    return tasks;
  } catch (error) {
    console.error('Error creating prerequisite:', error);
    throw error;
  }
};

export const deletePrerequisite = async (taskId, prerequisiteTaskId) => {
  try {
    let query = `DELETE FROM Prerequisites WHERE task_id = ? AND prerequisite_task_id = ?`;

    await executeSql(query, [taskId, prerequisiteTaskId]); // Execute the SQL query with parameters

    console.log(`Prerequisite deleted: Task ${prerequisiteTaskId} is no longer a prerequisite for Task ${taskId}`);
  } catch (error) {
    console.error('Error deleting prerequisite:', error);
    throw error;
  }
};


export const getTaskComments = async (taskId) => {
  try {    
    let query = `SELECT * FROM TaskComments WHERE task_id = ${taskId} ORDER BY id DESC`;    
    
    console.log('Task Comments Get Query: ' + query);
    const results = await executeSql(query, []); // Execute the SQL query with parameters

    return results;
    
  } catch (error) {
    console.error('Error retrieving task comments:', error);
    throw error;
  }
};

export const addTaskComment = async (comment,taskid) => {
  try {
    user = await getUserData();

    let query = `
      INSERT INTO TaskComments (task_id, comment, comment_date, commented_by) 
      VALUES (?, ?, datetime('now'), ?)
    `;
    let params = [taskid, comment, user.email];
    
    console.log('Task Comment Insert Query: ' + query);
    await executeSql(query, params); // Execute the SQL query with parameters
    
  } catch (error) {
    console.error('Error inserting task comment:', error);
    throw error;
  }
};


export const listWorkHours = async (page, id) => {
  try {
    const offset = (page - 1) * 10; // Assuming each page shows 10 work hours records
    const limit = 10; // Number of work hours records to fetch per page

    let query = `
      SELECT 
        WorkHours.*, 
        Users.hourly_rate,
        (Users.hourly_rate * WorkHours.hours) + (Users.hourly_rate * WorkHours.minutes / 60) as cost
      FROM 
        WorkHours 
      INNER JOIN 
        Users ON WorkHours.recorded_by = Users.email 
      WHERE 
        WorkHours.task_id = ${id}`;
      
    let params = [];
    
    query += ' ORDER BY WorkHours.recorded_date DESC'; // Assuming you want to order by the recorded date in descending order
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    
    const results = await executeSql(query, params); // Execute the SQL query with parameters

    // Format the results as needed, assuming each result row is an object with properties matching the table columns
    const workHours = results.map((row) => ({
      id: row.id,
      hours: row.hours,
      minutes: row.minutes,
      recorded_date: row.recorded_date,
      approved: row.approved,
      recorded_by: row.recorded_by,
      cost: row.cost,
    }));

    return workHours;
  } catch (error) {
    console.error('Error listing work hours:', error);
    throw error;
  }
};



export const getTasksByMember = async (page, searchText) => {
  try {
    const offset = (page - 1) * 10;
    const limit = 10;
    user = await getUserData();

    let query = `SELECT Tasks.*, Projects.name as project_name FROM Tasks INNER JOIN Projects ON Projects.id = Tasks.project_id WHERE Tasks.assigned_to = '${user.email}'`;
    let params = [];

    if (searchText) {
      query += ` AND Lower(Tasks.name) LIKE '%${searchText.toLowerCase()}%'`;
      
      // Check if searchText can be parsed to an integer
      if (!isNaN(parseInt(searchText))) {
        query += ` OR Tasks.id = ${parseInt(searchText)}`;
      }
    }

    query += ' ORDER BY Tasks.end_date';
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const results = await executeSql(query, params);

    const tasks = results.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      start_date: row.start_date,
      end_date: row.end_date,
      assigned_to: row.assigned_to,
      is_active: Boolean(row.is_active),
      status: row.status,
      project_name: row.project_name,
    }));

    return tasks;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};


export const createWorkedHour = async (workedHour) => {
  const { hours, minutes, recorded_date, approved, task_id } = workedHour;

  user = await getUserData();
  
  const query = `INSERT INTO WorkHours (hours, minutes, recorded_date, approved, task_id, recorded_by) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [hours, minutes, recorded_date, approved, task_id, user.email];

  return executeSql(query, params);
};

