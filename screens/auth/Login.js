import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MeuInput from "../../components/Meuinput";
import BotaoSubmit from "../../components/BotaoSubmit";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const schema = yup.object().shape({
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  senha: yup
    .string()
    .required("Senha é obrigatória")});

const Login = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  //State global
  const [state, setState] = useContext(AuthContext);
   const [error, setError] = useState("");
   const [errorVisible, setErrorVisible] = useState(false);

   // Função para mostrar o erro temporariamente
   const erroTemporario = (errorMessage) => {
     setError(errorMessage); 
     setErrorVisible(true);

     // Define um temporizador para limpar o estado de erro após 3 segundos
     setTimeout(() => {
       setErrorVisible(false); // Torna o erro invisível
       setError(""); // Limpa o erro
     }, 4000);
   };
  

  //função do botão

  const onSubmit = async (data) => {
    try {
      await handleSubmit(handleLogin)();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const { data } = await axios.post("/auth/login", formData);
      setState(data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));
      navigation.navigate("Feed");
      console.log("Login efetuado com sucesso");
    } catch (error) {
      erroTemporario("Campos inválidos"); // Definindo a mensagem de erro
      console.log(error);
    }
  };

  const getLocalStorageData = async () => {
    let data = await AsyncStorage.getItem("@auth");
  };
  getLocalStorageData();

 const { width, height } = Dimensions.get("window");
 const menorDimensao = Math.min(width, height);
 const tamanhoDoLogo = menorDimensao * 0.6;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image
            style={[
              styles.logo,
              { width: tamanhoDoLogo, height: tamanhoDoLogo },
            ]}
            source={require("../../assets/Logo.png")}
          />
        </View>
        <Text style={styles.titulo}>Entrar</Text>
        <View style={{ marginHorizontal: responsiveWidth(5) }}>
          {error !== "" && ( // Verificando se há mensagem de erro
            <Text style={[styles.error, styles.principalError]}>{error}</Text>
          )}
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <MeuInput
                setValue={onChange}
                value={value}
                inputTitulo="Email"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <MeuInput
                setValue={onChange}
                value={value}
                inputTitulo="Senha"
                secureTextEntry={true}
                autoComplete="password"
                autoCapitalize="none"
              />
            )}
            name="senha"
            defaultValue=""
          />
          {errors.senha && (
            <Text style={styles.error}>{errors.senha.message}</Text>
          )}
        </View>
        <BotaoSubmit
          tituloBotao="LOGIN"
          handleSubmit={handleSubmit(onSubmit)}
        />
        <Text style={styles.descricaoLink}>
          Ainda não possui uma conta?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Registro")}
          >
            Registre-se
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FDE998",
  },
  titulo: {
    marginBottom: responsiveHeight(3),
    fontSize: responsiveFontSize(4.5),
    fontWeight: "bold",
    textAlign: "center",
  },
  descricaoLink: {
    textAlign: "center",
    marginBottom: responsiveHeight(5),
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  link: {
    color: "blue",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: responsiveHeight(10),
  },
  logo: {
    borderRadius: responsiveWidth(30),
    marginBottom: responsiveHeight(3),
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  principalError: {
    fontSize: responsiveFontSize(2),
  },
});

export default Login;