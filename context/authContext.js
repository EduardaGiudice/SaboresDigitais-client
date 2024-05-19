import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

//context
const AuthContext = createContext();
//Provider
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    usuario: null,
    token: "",
  });
  //dados iniciais de armazenamento local
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      let loginData = JSON.parse(data);
      setState({
        ...state,
        usuario: loginData?.usuario,
        token: loginData?.token,
      });
    };
    loadLocalStorageData();
  }, []);
  useEffect(() => {
    // Configurar o Axios sempre que o token mudar
    axios.defaults.headers.common[`Authorization`] = `Bearer ${state.token}`;
    axios.defaults.baseURL =
      "https://sabores-digitais-api-666095ca7851.herokuapp.com/";
  }, [state.token]);
  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthProvider };