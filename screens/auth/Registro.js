import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import MeuInput from "../../components/Meuinput";
import BotaoSubmit from "../../components/BotaoSubmit";
import AlertModal from "../../components/AlertModal";

// Esquema de validação Yup para os campos do formulário
const schema = yup.object().shape({
  nomeUsuario: yup
    .string()
    .required("Nome é obrigatório")
    .min(4, "O nome precisa de no mínimo 4 caracteres"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
  senha: yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "A senha precisa de no mínimo 6 caracteres"),
  confirmarSenha: yup
    .string()
    .required("Confirmar a senha é obrigatório")
    .oneOf([yup.ref("senha"), null], "As senhas não coincidem"),
});

const Registro = ({ navigation }) => {
  // Hooks do react-hook-form para gerenciamento do formulário
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
    const [emailError, setEmailError] = useState("");
  const [errorEmailVisible, setErrorEmailVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Função para mostrar o erro temporariamente
  const erroTemporario = (errorMessage) => {
    setError(errorMessage);
    setErrorVisible(true);

    // Define um temporizador para limpar o estado de erro após 4 segundos
    setTimeout(() => {
      setErrorVisible(false); // Torna o erro invisível
      setError(""); // Limpa o erro
    }, 4000);
  };
    const erroEmailTemporario = (errorMessage) => {
    setEmailError(errorMessage);
    setErrorEmailVisible(true);

    // Define um temporizador para limpar o estado de erro após 4 segundos
    setTimeout(() => {
      setErrorEmailVisible(false); // Torna o erro invisível
      setEmailError(""); // Limpa o erro
    }, 4000);
  };


  // Função para lidar com o envio do formulário
  const onSubmit = async (data) => {
    try {
      const { nomeUsuario, email, senha } = data;
      // Requisição POST para fazer o registro de usuário
      const { data: responseData } = await axios.post("/auth/registro", {
        nomeUsuario,
        email,
        senha,
      });
      setMessage(responseData && responseData.message);
      setModalVisible(true);
      console.log("Cadastro efetuado com sucesso");
    } catch (error) {
       if (error.response && error.response.status === 409) {
      erroEmailTemporario("Já existe um usuário com esse email");
    } else {
      erroTemporario("Campos inválidos"); 
      console.log(error);
    }
    }
  };

  // Função para fechar o modal e navegar para a tela Login
  const closeModal = () => {
    setModalVisible(false);
    if (!error) {
      navigation.navigate("Login");
    }
  };
  
  //Dimensões do Logo
  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDoLogo = menorDimensao * 0.55;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logoContainer}>
          <Image
            style={[
              styles.logo,
              { width: tamanhoDoLogo, height: tamanhoDoLogo },
            ]}
            source={require("../../assets/images/icone.png")}
          />
        </View>
        <Text style={styles.titulo}>Registre-se</Text>
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
                inputTitulo={"Nome"}
              />
            )}
            name="nomeUsuario"
            defaultValue=""
          />
          {errors.nomeUsuario && (
            <Text style={styles.error}>{errors.nomeUsuario.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <MeuInput
                setValue={onChange}
                value={value}
                inputTitulo={"Email"}
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
          {emailError !== "" && ( // Verificando se há mensagem de erro
            <Text style={[styles.error, styles.principalError]}>{emailError}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <MeuInput
                setValue={onChange}
                value={value}
                inputTitulo={"Senha"}
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

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <MeuInput
                setValue={onChange}
                value={value}
                inputTitulo={"Confirmar Senha"}
                secureTextEntry={true}
                autoComplete="password"
                autoCapitalize="none"
              />
            )}
            name="confirmarSenha"
            defaultValue=""
          />
          {errors.confirmarSenha && (
            <Text style={styles.error}>{errors.confirmarSenha.message}</Text>
          )}
        </View>
        <BotaoSubmit
          tituloBotao="CADASTRAR"
          handleSubmit={handleSubmit(onSubmit)}
        />
        <Text style={styles.descricaoLink}>
          Já possui uma conta? Faça seu{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
      <AlertModal
        visible={modalVisible}
        message={message}
        titulo={"Sucesso!"}
        onClose={closeModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FDE998",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: responsiveHeight(10),
  },
  logo: {
    borderRadius: responsiveWidth(27.5),
    marginBottom: responsiveHeight(3),
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
  error: {
    color: "red",
    textAlign: "center",
  },
  principalError: {
    fontSize: responsiveFontSize(2),
  },
});

export default Registro;
