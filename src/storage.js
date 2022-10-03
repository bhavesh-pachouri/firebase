import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    listAll,
} from "firebase/storage";
let storage = null;

// Initialize Cloud Storage
export function initializeStorage(app) {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    storage = getStorage(app);
};

export function upload(file, callback) {
    // Create the file metadata
    const metadata = {
        contentType: 'image/jpeg',
    };
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
        (snapshot) => {
            console.log(snapshot);
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            callback('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('upload -> Upload is paused');
                    break;
                case 'running':
                    console.log('upload -> Upload is running');
                    break;
            }
        },
        (error) => {
            console.log('upload -> Error in uploading');
            console.log(downloadURL);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    break;
            }
        },
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('upload -> File available at', downloadURL);
            });
        }
    );
}

export function download(fileName, callback) {
    // download file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + fileName);
    // Get the download URL
    getDownloadURL(storageRef)
        .then((url) => {
            console.log('download -> Downloaded Successfully');
            // Insert url into an <img> tag to "download"
            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
                const blob = xhr.response;
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
            };
            xhr.open('GET', url);
            xhr.send();
            callback(url);
        })
        .catch((error) => {
            console.log('download -> Error in downloading');
            console.log(error);
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/object-not-found':
                    // File doesn't exist
                    break;
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    break;
                case 'storage/canceled':
                    // User canceled the upload
                    break;

                // ...

                case 'storage/unknown':
                    // Unknown error occurred, inspect the server response
                    break;
            }
        });

};

export function fetchImageList(callback) {
    const storageRef = ref(storage, 'images');
    // Find all the prefixes and items.
    listAll(storageRef)
        .then((res) => {
            var imgList = [];
            res.items.forEach((itemRef) => {
                imgList.push(itemRef.name);
            });
            callback(imgList);
        }).catch((error) => {
            console.log('fetchImageList -> Error in fetching list');
            console.log(error);
            // Uh-oh, an error occurred!
        });
}