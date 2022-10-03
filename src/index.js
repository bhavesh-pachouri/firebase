console.log('Document Loading....');
// setup materialize components
document.addEventListener('DOMContentLoaded', function () {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

});

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "..",
    authDomain: "..",
    projectId: "..",
    storageBucket: "..",
    messagingSenderId: "..",
    appId: "..",
    measurementId: ".."
};

// importing all the dependencies
import { initializeApp } from "firebase/app";
import {
    currentUser,
    initializeAuth,
    signUpWithEmailAndPassword,
    logOutUser,
    logInWithEmailAndPassword, googleLogin, loginWithPhoneNumber,
    updateAccount,
    verifyEmail,
} from './auth.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);

//setting up the UI
const setupUI = (user) => {
    // DOM elements
    const loggedOutLinks = document.querySelectorAll('.logged-out');
    const loggedInLinks = document.querySelectorAll('.logged-in');
    const accountDetails = document.querySelector('.account-details');
    const accountEmail = document.querySelector('#account-email');
    const accountPassword = document.querySelector('#account-password');
    const accountDisplayName = document.querySelector('#account-displayName');
    const accountPhotoURL = document.querySelector('#account-photoURL');
    const accountPhoneNumber = document.querySelector('#account-phoneNumber');
    if (user) {
        // account info
        const html = user.emailVerified
            ? `<div>Logged in as ${user.email} (email verified)</div>`
            : `<div>Logged in as ${user.email} (email not verified)</div>`;
        accountDetails.innerHTML = html;
        accountEmail.value = user.email;
        accountPassword.value = user.password;
        accountDisplayName.value = user.displayName;
        accountPhotoURL.value = user.photoURL;
        accountPhoneNumber.value = user.phoneNumber;

        // toggle user UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // clear account info
        accountDetails.innerHTML = ''
        accountEmail.value = '';
        accountPassword.value = '';
        accountDisplayName.value = '';
        accountPhotoURL.value = '';
        accountPhoneNumber.value = '';

        // toggle user elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
};

// setup guides
const setupGuides = (data) => {
    const guideList = document.querySelector('.guides');
    if (data.length) {
        guideList.innerHTML = '';
        data.forEach(guide => {
            const li = document.createElement('li');
            // setting the guide title
            const div1 = document.createElement('div');
            div1.textContent = guide.title;
            div1.classList.add('collapsible-header');
            div1.classList.add('grey');
            div1.classList.add('lighten-4');

            // setting the guide content
            const div2 = document.createElement('div');
            div2.textContent = guide.content;
            div2.classList.add('collapsible-body');
            div2.classList.add('white');

            // setting edit button
            const editbutton = document.createElement('button');
            editbutton.classList.add('darken-2');
            editbutton.classList.add('btn');
            editbutton.classList.add('yellow');
            editbutton.classList.add('z-depth-0');
            editbutton.classList.add('modal-trigger');
            editbutton.textContent = 'Edit';
            editbutton.addEventListener('click', (e) => {
                editRealTimeDB(guide);
            });
            editbutton.setAttribute("data-target", "modal-update");
            div2.appendChild(editbutton);

            // setting delete button
            const deletebutton = document.createElement('button');
            deletebutton.classList.add('darken-2');
            deletebutton.classList.add('btn');
            deletebutton.classList.add('green');
            deletebutton.classList.add('z-depth-0');
            deletebutton.textContent = 'Delete';
            deletebutton.addEventListener('click', (e) => {
                deleteForm(guide);
            });
            div2.appendChild(deletebutton);

            // appending to list
            li.appendChild(div1);
            li.appendChild(div2);
            guideList.appendChild(li);
        });
    } else {
        guideList.innerHTML = '<h5 class="center-align">Create Guide to view them.</h5>';
    }
};

// calling auth.js to initialize auth.js
const initializeAuthCallback = () => {
    if (currentUser) {
        console.log('onAuthStateChanged.initializeAuthCallback -> user logged in');
        //read(setupGuides);
        observe(setupGuides);
    } else {
        console.log('onAuthStateChanged.initializeAuthCallback -> user logged out');
        const guideList = document.querySelector('.guides');
        guideList.innerHTML = '<h5 class="center-align">Login to view guides.</h5>';
    }
    setupUI(currentUser);
};
initializeAuth(app, 'recaptcha-container', initializeAuthCallback);

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    signUpWithEmailAndPassword(email, password, signUpFormCallback);
});
const signUpFormCallback = () => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
};

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    logOutUser();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in
    logInWithEmailAndPassword(email, password, loginFormCallback);
});
const loginFormCallback = () => {
    // close the login modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
};

// update
const updateAccountForm = document.querySelector('#account-form');
updateAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const displayName = updateAccountForm['account-displayName'].value;
    const photoURL = updateAccountForm['account-photoURL'].value;
    const phoneNumber = updateAccountForm['account-phoneNumber'].value;

    // update account information
    updateAccount({
        displayName: displayName, photoURL: photoURL, phoneNumber: phoneNumber
    }, closeAccountModal);
});
const closeAccountModal = () => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-account');
    M.Modal.getInstance(modal).close();
};

// verify Email
const verifyEmailAccount = document.querySelector('#account-verifyEmail');
verifyEmailAccount.addEventListener('click', (e) => {
    e.preventDefault();

    // update account information
    verifyEmail(closeAccountModal);
});

// login with google
const googleLoginForm = document.querySelector('#login-google');
googleLoginForm.addEventListener('click', (e) => {
    e.preventDefault();
    googleLogin(loginFormCallback);
});

// login with phone number
const loginTelephoneForm = document.querySelector('#login-telephone-form');
loginTelephoneForm.addEventListener('submit', (e) => {
    e.preventDefault();

    loginTelephoneOTPForm.style.display = "none";
    // get user info
    const telephone = loginTelephoneForm['login-tel'].value;

    // log the user in
    loginWithPhoneNumber(telephone, loginTelephoneFormCallback);
});
const loginTelephoneFormCallback = () => {
    loginTelephoneOTPForm.style.display = "block";
};
// handling otp
const loginTelephoneOTPForm = document.querySelector('#login-otp-form');
loginTelephoneOTPForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const otp = loginTelephoneOTPForm['login-otp'].value;

    // Verifying the otp
    confirmationResult.confirm(otp).then((result) => {
        console.log("loginTelephoneOTPForm.confirmationResult -> User signed in");
        console.log(result);
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        // ...
        loginFormCallback();
    }).catch((error) => {
        console.log("loginTelephoneOTPForm.confirmationResult -> Error");
        console.log(err.message)
    });
});

// importing the depenedency from realtimedb
import {
    initializeDatabase,
    write,
    read, observe,
    modify,
    erase,
} from "./firestoreDB.js";

//initialize db
initializeDatabase(app);

// writing to realtime database
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const createFormData = {
        title: createForm.title.value,
        content: createForm.content.value,
        userId: currentUser.uid,
    };
    write(createFormData, createFormCallback);
});
const createFormCallback = () => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
};

// updating to realtime database
const updateForm = document.querySelector('#update-form');
const editRealTimeDB = (guide) => {
    updateForm.title.value = guide.title;
    updateForm.content.value = guide.content;
    updateForm.createdBy = guide.createdBy;
    updateForm.key = guide.key;
};
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updateFormData = {
        title: updateForm.title.value,
        content: updateForm.content.value,
        createdBy: updateForm.createdBy,
        updatedBy: currentUser.uid,
        key: updateForm.key,
    };
    modify(updateFormData, updateCallback);
});
const updateCallback = () => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-update');
    M.Modal.getInstance(modal).close();
    updateForm.reset();
};

// deleting from realtime database
const deleteForm = (guide) => {
    erase(guide);
}

// importing storage dependencies
import {
    initializeStorage,
    upload,
    download,
    fetchImageList,
} from "./storage.js";

// initializing storage
initializeStorage(app);

// uploading selected image
const uploadFile = document.querySelector('#uploadFile');
uploadFile.addEventListener('click', (e) => {
    // Get the file from DOM
    var file = filesInput.files[0];
    console.log(file);
    if (file) {
        upload(file, uploadProgress);
    }
});
const uploadProgress = (progress) => {
    var upLabel = document.getElementById("uploadProgress");
    upLabel.innerHTML = progress;
    fetchImageList(showStorageImage);
};

const showStorageImage = (imgList) => {
    console.log(imgList);
    const imageList = document.querySelector('#imageList');
    if (imgList.length) {
        imageList.innerHTML = '';
        imgList.forEach(image => {
            const li = document.createElement('li');
            // setting the guide title
            const div1 = document.createElement('div');
            div1.textContent = image;
            div1.classList.add('grey');
            div1.classList.add('lighten-4');

            // setting edit button
            const editbutton = document.createElement('button');
            editbutton.classList.add('darken-2');
            editbutton.classList.add('btn');
            editbutton.classList.add('green');
            editbutton.classList.add('z-depth-0');
            editbutton.classList.add('modal-trigger');
            editbutton.textContent = 'Download';
            editbutton.addEventListener('click', (e) => {
                download(image, displayDownloadedImage);
            });
            div1.appendChild(editbutton);

            // appending to list
            li.appendChild(div1);
            imageList.appendChild(li);
        });
    }
};
fetchImageList(showStorageImage);

// display downloaded image
const displayDownloadedImage = (url) => {
    document.getElementById("selectedImg").src = url;
};

// showing selected image
const filesInput = document.querySelector('#filesInput');
filesInput.addEventListener('change', (e) => {
    var [file] = filesInput.files;
    if (file) {
        document.getElementById("selectedImg").src = URL.createObjectURL(file)
        var fullName = file.name;
        document.getElementById("imageName").innerHTML = fullName.split('.').slice(0, -1).join('.');
        document.getElementById("imgExt").innerHTML = fullName.split('.').pop();
    }
});

console.log('Application loaded');
