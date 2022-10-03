import {
    getDatabase,
    set, ref, push,
    get, child, onValue, 
    update,
    remove, serverTimestamp, query, orderByChild,
} from "firebase/database";
let database = null;

// initialize database reference
export function initializeDatabase(app) {
    database = getDatabase(app);
}

// write data
export function write(writeData, callback) {
    const guideRef = ref(database, `guides`);
    const newGuideRef = push(guideRef);
    set(newGuideRef, {
        title: writeData.title,
        content: writeData.content,
        createdBy: writeData.userId,
        createdOn: serverTimestamp(),
    }).then(() => {
        console.log("realTimeListDB.write -> Successfully add the data");
        callback();
    }).catch(err => {
        console.log("realTimeListDB.write -> Error in adding the data");
        console.log(err.message);
    });
}

// read the data
export function read(callback) {
    const dbRef = ref(database);
    get(child(dbRef, `guides`)).then((snapshot) => {
        console.log("realTimeListDB.read -> Successfully fetch the data");
        const data = readSnapshot(snapshot);
        callback(data);
    }).catch((error) => {
        console.log("realTimeListDB.read -> error in fetching the data");
        console.error(error);
    });
};

// observe the change of data
export function observe(callback) {
    const userGuidesRef = ref(database, `guides`);
    // onValue(userGuidesRef, (snapshot) => {
    //     console.log("realTimeListDB.observe -> data is changed");
    //     const data = readSnapshot(snapshot);
    //     callback(data);
    // });

    // explaining order by
    const topUserPostsRef = query(userGuidesRef, orderByChild('title'));
    console.log(topUserPostsRef);
    onValue(topUserPostsRef, (snapshot) => {
        console.log("realTimeListDB.observe -> data is changed ordering via title");
        const data = readSnapshot(snapshot);
        callback(data);
    });
};

// function to read data snapshot
const readSnapshot = (snapshot) => {
    let guides = [];
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        guides.push({
            title: data.title,
            content: data.content,
            createdBy: data.createdBy,
            createdOn: data.createdOn,
            updatedBy: data.updatedBy,
            updatedOn: data.createdOn,
            key: childSnapshot.key
        });
    });
    console.log("realTimeListDB.readSnapshot");
    console.log(guides);
    return guides;
};

// function to update the data
export function modify(modifyData, callback) {
    const updates = {};
    updates[`/guides/${modifyData.key}/content`] = modifyData.content;
    updates[`/guides/${modifyData.key}/updatedBy`] = modifyData.updatedBy;
    updates[`/guides/${modifyData.key}/updatedOn`] = serverTimestamp();

    return update(ref(database), updates).then(() => {
        console.log("realTimeListDB.update -> Successfully update the data");
        callback();
    }).catch(err => {
        console.log("realTimeListDB.update -> Error in updating the data");
        console.log(err.message);
    });
};

// function to erase guide
export function erase(snapshot) {
    remove(ref(database, 'guides/' + snapshot.key));
};