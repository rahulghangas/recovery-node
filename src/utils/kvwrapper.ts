const level = require('level-rocksdb');
import * as os from 'os';

const homeDir = os.homedir();

const db = level(`${homeDir}/.electron-db`, {createIfMissing: true})

export async function isDbOpen() {
    return await db.isOpen();
}

export async function isDbClosed() {
    return db.isDBClosed();
}

export async function getValueFromKey(key: string): Promise<string> {
    let value!: string;
    await db.get(key)
        .then(function () {return db.get(key)})
        .then(function (val: string) {value = val})
        .catch(function (err) {
            console.log(err)
        })
    if (value) {
        return value;
    }
    throw Error('value not found');
}


export async function addOrUpdateKeyValue(key:string, val: string): Promise<string> {
    let value!: string;
    await db.put(key, val)
        .then(function () {return db.get(key)})
        .then(function (data: string) {value = data})
        .catch(function (err) {
            console.log(err)
        })
    if (value) {
        return value;
    }
    throw Error('value not found');
}


export async function deleteKey(key: string): Promise<boolean> {
    let deleted = true;
    await db.del(key)
        .catch(function (err) {
            console.log(err);
            deleted = false;
        })
    return deleted;
}
