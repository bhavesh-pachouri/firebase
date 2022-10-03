// importing authentication dependencies
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile,
    sendEmailVerification,
    signInWithPopup, GoogleAuthProvider,
    RecaptchaVerifier, signInWithPhoneNumber,
} from "firebase/auth";

export let currentUser = {};
let auth = {};

// creating reference to the authentication library
export function initializeAuth(app, captchaContainer, callback) {
    auth = getAuth(app);
    console.log("auth.initializeAuth");
    console.log(auth);

    // listening for the auth changes
    onAuthStateChanged(auth, (user) => {
        console.log("auth.initializeAuth.onAuthStateChanged");
        console.log(user);
        currentUser = user;
        callback();
    });

    // loading recaptcha-container
    window.recaptchaVerifier = new RecaptchaVerifier(captchaContainer, {}, auth);
    recaptchaVerifier.render();
};

// Function to sign up the user using email and password
export function signUpWithEmailAndPassword(email, password, callback) {
    // sign up the user
    createUserWithEmailAndPassword(auth, email, password).then(cred => {
        console.log('auth.signUpWithEmailAndPassword.createUserWithEmailAndPassword -> user created:');
        console.log(cred.user);
        callback();
    }).catch(err => {
        console.log('auth.signUpWithEmailAndPassword.createUserWithEmailAndPassword -> Error Occured:');
        console.log(err.message)
    });
};

// function to sign out the user
export function logOutUser() {
    signOut(auth).then(() => {
        console.log('auth.logout.signOut -> user signed out');
        console.log(auth);
    }).catch(err => {
        console.log('auth.logout.signOut -> Error occured');
        console.log(err.message)
    });
};

// function to login the user
export function logInWithEmailAndPassword(email, password, callback) {
    // log the user in
    signInWithEmailAndPassword(auth, email, password).then((cred) => {
        console.log('auth.logInWithEmailAndPassword.signInWithEmailAndPassword -> user signed in');
        console.log(cred.user);
        console.log(auth);
        callback();
    }).catch(err => {
        console.log('auth.logInWithEmailAndPassword.signInWithEmailAndPassword -> Error');
        console.log(err.message)
    });
};

// update account information
export function updateAccount(user, callback) {
    updateProfile(auth.currentUser, user).then(() => {
        console.log('auth.updateAccount.updateProfile -> profile updated');
        callback();
    }).catch(err => {
        console.log('auth.updateAccount.updateProfile -> Error');
        console.log(err.message)
    });
};

// Function to send verification mail
export function verifyEmail(callback) {
    // update account information
    sendEmailVerification(auth.currentUser).then(() => {
        console.log('auth.verifyEmail.sendEmailVerification -> Email Verification Sent');
        callback();
    }).catch(err => {
        console.log('auth.verifyEmail.sendEmailVerification -> Error');
        console.log(err.message)
    });
};

// Function to login via google
export function googleLogin(callback) {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider).then((result) => {
        console.log("googleLogin.signInWithPopup -> Sign in successful with google");
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log("credential: " + credential);
        const token = credential.accessToken;
        console.log("token: " + token);
        // The signed-in user info.
        const user = result.user;
        console.log("user: " + user);
        // ...
        // call callback
        callback();
    }).catch((error) => {
        console.log("googleLogin.signInWithPopup -> Error");
        console.log(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
    });
};

// function to login via phone number
export function loginWithPhoneNumber(callback) {
    // log the user in
    signInWithPhoneNumber(auth, telephone, window.recaptchaVerifier).then((confirmationResult) => {
        console.log("auth.loginWithPhoneNumber.signInWithPhoneNumber -> OTP is send");
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        callback();
    }).catch((err) => {
        console.log("auth.loginWithPhoneNumber.signInWithPhoneNumber -> Error");
        console.log(err.message)
    });
};