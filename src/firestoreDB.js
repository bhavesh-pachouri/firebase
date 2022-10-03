import {
    getFirestore,
    collection,
    getDocs, query, where, orderBy, limit, onSnapshot,
    addDoc,
    serverTimestamp,
    deleteDoc,
    updateDoc,
    deleteField,
    doc,
} from "firebase/firestore";
let database = null;

// initialize database reference
export function initializeDatabase(app) {
    database = getFirestore(app);
};

// write data
export function write(writeData, callback) {
    addDoc(collection(database, `guides`), {
        title: writeData.title,
        content: writeData.content,
        createdBy: writeData.userId,
        createdOn: serverTimestamp(),
    }).then(() => {
        console.log("firestoreDB.write -> Successfully add the data");
        callback();
    }).catch(err => {
        console.log("firestoreDB.write -> Error in adding the data");
        console.log(err.message);
    });
}

// read the data
export function read(callback) {
    const firestoreCollection = collection(database, 'guides');

    // getting all the documents in the collection
    fetchDocument(firestoreCollection, callback);

    // //getting records based on query
    // const q = query(firestoreCollection, where("title", "==", "Mocha"));
    // fetchDocument(q, callback);

    // // introducing order by
    // const orderq = query(firestoreCollection, where("title", ">", "b"), orderBy("title", "desc"), orderBy("content", "desc"), limit(3));
    // fetchDocument(orderq, callback);

    // // introducing order by
    // const orderonleq = query(firestoreCollection, orderBy("title", "desc"), limit(3));
    // fetchDocument(orderonleq, callback);
};

// function to fetch the document based on the query created on collection
const fetchDocument = (col, callback) => {
    // getting all the documents in the collection
    getDocs(col).then(snapshot => {
        console.log("firestoreDB.read -> Successfully fetch the data");
        const data = readSnapshot(snapshot);
        callback(data);
    }).catch((error) => {
        console.log("firestoreDB.read -> error in fetching the data");
        console.error(error);
    });
};

// function to read data snapshot
const readSnapshot = (snapshot) => {
    let guides = [];
    console.log(snapshot);
    snapshot.forEach((doc) => {
        const data = doc.data();
        guides.push({
            title: data.title,
            content: data.content,
            createdBy: data.createdBy,
            createdOn: data.createdOn,
            updatedBy: data.updatedBy,
            updatedOn: data.createdOn,
            key: doc.id
        });
    });
    console.log("firestoreDB.readSnapshot");
    console.log(guides);
    return guides;
};

// observe the change of data
export function observe(callback) {
    const firestoreCollection = collection(database, 'guides');
    onSnapshot(firestoreCollection, (snapshot) => {
        console.log("firestoreDB.observe -> Successfully fetch the data");
        console.log(snapshot.docChanges());
        const data = readSnapshot(snapshot);
        callback(data);
    });
};

// function to update the data
export function modify(modifyData, callback) {
    const guideRef = doc(database, 'guides', modifyData.key);
    updateDoc(guideRef, {
        content: modifyData.content,
        updatedBy: modifyData.updatedBy,
        updatedOn: serverTimestamp(),
    }).then(() => {
        console.log("firestoreDB.modify -> Successfully update the data");
        callback();
    }).catch(err => {
        console.log("firestoreDB.modify -> Error in updating the data");
        console.log(err.message);
    });
};

// function to erase guide
export function erase(snapshot) {
    // deleting the fields
    const guideRef = doc(database, 'guides', snapshot.key);
    updateDoc(guideRef, {
        content: deleteField()
    }).then(() => {
        console.log("firestoreDB.erase -> Successfully deleted field");
    }).catch(err => {
        console.log("firestoreDB.erase -> Error in deleting the field");
        console.log(err.message);
    });
    deleteDoc(guideRef).then(() => {
        console.log("firestoreDB.erase -> Successfully deleted document");
    }).catch(err => {
        console.log("firestoreDB.erase -> Error in deleting the document");
        console.log(err.message);
    });
};