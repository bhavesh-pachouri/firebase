// importing realtime database dependencies
import {
    getDatabase,
    set, ref,
    get, child, onValue, 
    update,
    remove,
} from "firebase/database";
let database = null;

// initialize database reference
export function initializeDatabase(app) {
    database = getDatabase(app);
}

// write data
export function write(writeData, callback) {
    set(ref(database, 'guides/' + writeData.title), {
        createdBy: writeData.userId,
        content: writeData.content
    }).then(() => {
        console.log("realTimeDB.write -> Successfully add the data");
        callback();
    }).catch(err => {
        console.log("realTimeDB.write -> Error in adding the data");
        console.log(err.message);
    });
}

// read the data
export function read(callback) {
    const dbRef = ref(database);
    get(child(dbRef, `guides`)).then((snapshot) => {
        console.log("realTimeDB.read -> Successfully fetch the data");
        const data = readSnapshot(snapshot);
        callback(data);
    }).catch((error) => {
        console.log("realTimeDB.read -> error in fetching the data");
        console.error(error);
    });
};

// observe the change of data
export function observe(callback) {
    onValue(ref(database, `guides`), (snapshot) => {
        console.log("realTimeDB.observe -> Successfully fetch the data");
        const data = readSnapshot(snapshot);
        callback(data);
    });
};

// function to read data snapshot
const readSnapshot = (snapshot) => {
    let guides = [];
    if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("realTimeDB.readSnapshot");
        console.log(data);
        for (const property in data) {
            guides.push({
                title: property,
                content: data[property].content,
                createdBy: data[property].createdBy
            });
        }
    }
    console.log("realTimeDB.readSnapshot");
    console.log(guides);
    return guides;
};

// function to update the data
export function modify(modifyData, callback) {
    const updates = {};
    updates['/guides/' + modifyData.title + '/content'] = modifyData.content;
    updates['/guides/' + modifyData.title + '/updatedBy'] = modifyData.updatedBy;

    return update(ref(database), updates).then(() => {
        console.log("realTimeDB.update -> Successfully update the data");
        callback();
    }).catch(err => {
        console.log("realTimeDB.update -> Error in updating the data");
        console.log(err.message);
    });
};

// function to erase guide
export function erase(snapshot) {
    remove(ref(database, 'guides/' + snapshot.title));
};