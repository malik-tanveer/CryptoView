import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Track user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ Signup
  const signup = async (name, email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // update name
    await updateProfile(res.user, {
      displayName: name,
    });

    setCurrentUser({
      ...res.user,
      displayName: name,
    });
  };

  // ✅ Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ✅ Google Login
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // ✅ Logout
  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle, 
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};