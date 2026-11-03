import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/collections";

export function loginAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logoutAdmin() {
  return signOut(auth);
}

// A signed-in user is an admin only if their UID exists in /admins.
// The security rules let a user read just their own entry.
export async function checkIsAdmin(uid) {
  const snap = await getDoc(doc(db, COLLECTIONS.ADMINS, uid));
  return snap.exists();
}

// Turns Firebase error codes into messages a person can act on.
export function authErrorMessage(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return "Couldn't sign in. Please try again.";
  }
}