// Firebase SDK Scripts

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDIFN5Ua7VJaB7gJRQ5CfqkrvyTQsn16I",
  authDomain: "asep2-534cf.firebaseapp.com",
  projectId: "asep2-534cf",
  storageBucket: "asep2-534cf.firebasestorage.app",
  messagingSenderId: "687010698166",
  appId: "1:687010698166:web:c892e174f2a35e366ce717",
};






try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  provider.addScope("email");
  provider.addScope("profile");

  window.auth = auth;
  window.db = db;
  window.provider = provider;

  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}



window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signInWithPopup = signInWithPopup;
window.onAuthStateChanged = onAuthStateChanged;
window.signOut = signOut;
window.doc = doc;
window.setDoc = setDoc;


onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user.email);
  } else {
    console.log("User is signed out");
  }
});



window.loginUser = async (email, password) => {
  try {
    showLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    
    const rememberMe = document.getElementById("rememberMe").checked;
    if (rememberMe) {
      localStorage.setItem("playpal_remember_email", email);
      localStorage.setItem("playpal_remember_me", "true");
    } else {
      localStorage.removeItem("playpal_remember_email");
      localStorage.removeItem("playpal_remember_me");
    }

    showMessage("Login successful! Redirecting...", "success");
    console.log("User logged in:", userCredential.user.email);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    showMessage(getErrorMessage(error.code), "error");
    throw error;
  } finally {
    showLoading(false);
  }
};


window.signupUser = async (email, password, firstName, lastName, phone) => {
  try {
    showLoading(true);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      createdAt: new Date().toISOString(),
      isActive: true,
    });

    showMessage("Account created successfully! Redirecting...", "success");
    console.log("User created:", user.email);

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    return user;
  } catch (error) {
    console.error("Signup error:", error);
    showMessage(getErrorMessage(error.code), "error");
    throw error;
  } finally {
    showLoading(false);
  }
};


window.signInWithGoogle = async () => {
  try {
    showLoading(true);
    console.log("Starting Google sign-in...");

    const messageContainer = document.getElementById("messageContainer");
    messageContainer.style.display = "none";

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Google sign-in successful:", user.email);


    await setDoc(
      doc(db, "users", user.uid),
      {
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email,
        photoURL: user.photoURL,
        provider: "google",
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      { merge: true }
    );

    showMessage("Google sign-in successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);

    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    let errorMessage = "Google sign-in failed. ";

    switch (error.code) {
      case "auth/unauthorized-domain":
        errorMessage += "Domain not authorized. Please contact support.";
        break;
      case "auth/popup-blocked":
        errorMessage += "Popup was blocked. Please allow popups and try again.";
        break;
      case "auth/popup-closed-by-user":
        errorMessage += "Sign-in was cancelled.";
        break;
      case "auth/network-request-failed":
        errorMessage += "Network error. Please check your connection.";
        break;
      default:
        errorMessage += error.message;
    }

    showMessage(errorMessage, "error");
    throw error;
  } finally {
    showLoading(false);
  }
};

function showLoading(show) {
  const spinner = document.getElementById("loadingSpinner");
  spinner.style.display = show ? "flex" : "none";
}

function showMessage(message, type) {
  const container = document.getElementById("messageContainer");
  const text = document.getElementById("messageText");

  text.textContent = message;
  container.className = `message-container ${type}`;
  container.style.display = "block";

  setTimeout(() => {
    container.style.display = "none";
  }, 5000);
}

function getErrorMessage(errorCode) {
  const errorMessages = {
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password":
      "Password is too weak. Please use at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
    "auth/popup-closed-by-user": "Sign-in popup was closed before completion.",
  };
  return errorMessages[errorCode] || "An error occurred. Please try again.";
}


document
  .getElementById("loginFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      await loginUser(email, password);
    } catch (error) {
      // Error already handled in loginUser function
    }
  });

document
  .getElementById("signupFormElement")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const phone = document.getElementById("phoneNumber").value;

    if (password !== confirmPassword) {
      showMessage("Passwords do not match!", "error");
      return;
    }

    try {
      await signupUser(email, password, firstName, lastName, phone);
    } catch (error) {
      
    }
  });


document.addEventListener("DOMContentLoaded", function () {
  const rememberedEmail = localStorage.getItem("playpal_remember_email");
  const isRemembered = localStorage.getItem("playpal_remember_me");

  if (isRemembered === "true" && rememberedEmail) {
    document.getElementById("loginEmail").value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;
  }
});


import { getRedirectResult } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


getRedirectResult(auth)
  .then((result) => {
    if (result && result.user) {
      showMessage("Sign-in successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    }
  })
  .catch((error) => {
    if (error.code !== "auth/no-redirect-result") {
      console.error("Redirect result error:", error);
      showMessage(getErrorMessage(error.code), "error");
    }
  });

window.logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("playpal_remember_email");
    localStorage.removeItem("playpal_remember_me");
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
  }
};