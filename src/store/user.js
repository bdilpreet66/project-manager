import * as SQLite from 'expo-sqlite';

export const validateLogin = async (email, password) => {
    const db = await openDB();
    /*let db = SQLite.openDatabase(
        {
            name: 'UserDatabase.db',
            location: 'default',
            createFromLocation: '~www/UserDatabase.db',
        },
        () => console.log('Database opened!'),
        error => console.error("SQLite Error: " + error),
    );*/
    /*
    let sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.transaction((tx) => {
        tx.executeSql(sql, [email, password], (tx, results) => {
            let len = results.rows.length;
            let row = results.rows.item(0);
            if (len > 0) {
                // A match was found in the database
                console.log('User login successful');
                return {success: true, type:'admin', message: 'User login successfully.'}
            } else {
                // No match found
                console.log('Login Failed');
                return {success: false, type: 'admin', message: 'Login failed.'}
            }
        });
    });*/
    
    //return null;
    return {success: true, type:'admin', message: 'User login successfully.'}
    //console.log('Login!');
}

export const registerUser = () => {
    // Open a new database connection
    let db = SQLite.openDatabase(
        {
            name: 'UserDatabase.db',
            location: 'default',
            createFromLocation: '~www/UserDatabase.db',
        },
        () => console.log('Database opened!'),
        error => console.error("SQLite Error: " + error),
    );
    db.transaction(function (txn) {
        // Create the users table if it does not already exist
        txn.executeSql(
            "CREATE TABLE IF NOT EXISTS users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(30), password VARCHAR(30), type VARCHAR(10))",
            []
        );
        // Insert the new user into the users table
        txn.executeSql(
            "INSERT INTO users (email, password, type) VALUES (?,?,?)",
            [email, password, type],
            function (tx, res) {
                console.log('User inserted successfully');
            },
            function (error) {
                console.log('Error occurred while inserting user', error);
            }
        );
    });
}
