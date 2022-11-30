import { doc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/Firebase";

const Context = createContext();
export const StateContext = ({ children }) => {
  // const [user] = useAuthState(auth);
  // const [data, setData] = useState(null);
  // useEffect(() => {
  //   if (!user) return;
  //   const getData = async () => {
  //     const docRef = doc(db, "users", user.email);
  //     const docSnap = await getDoc(docRef);
  //     docSnap.exists() ? setData(docSnap.data()) : setData(null);
  //   };
  //   getData();
  // }, [user]);

  return <Context.Provider >{children}</Context.Provider>;
};
export const useStateContext = () => useContext(Context);
