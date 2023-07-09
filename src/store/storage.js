import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('projectManagerDBv1.0.db');

export const executeSql = async (sql, params = []) => {
    return new Promise((resolve, reject) =>
        db.transaction(tx => {
            tx.executeSql(sql, params, (_, { rows }) => {
                resolve(rows._array)
            }, reject);
        })
    );
};

export const initializeDB = async () => {
    await executeSql(`CREATE TABLE IF NOT EXISTS Users (
        email TEXT PRIMARY KEY NOT NULL,
        password TEXT NOT NULL,
        type TEXT NOT NULL,
        hourly_rate FLOAT NOT NULL,
        created_by TEXT DEFAULT ''
    )`);
};
