import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import BotaoSubmit from "./BotaoSubmit";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const AtualizarSenhaModal = ({
  modalVisible,
  setModalVisible,
  onUpdate,
  erroAtualSenha,
  erroNovaSenha,
  erroConfirmarNovaSenha,
  erroUpdate,
}) => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [erroAtualSenhaVisible, setErroAtualSenhaVisible] = useState(false);
  const [erroNovaSenhaVisible, setErroNovaSenhaVisible] = useState(false);
  const [erroConfirmarNovaSenhaVisible, setErroConfirmarNovaSenhaVisible] =
    useState(false);
  const [erroUpdateVisible, setErroUpdateVisible] = useState(false);

  // Controlar a visibilidade das mensagens de erro com base nos erros recebidos
  useEffect(() => {
    if (erroAtualSenha) {
      setErroAtualSenhaVisible(true);
      const timer = setTimeout(() => {
        setErroAtualSenhaVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [erroAtualSenha]);

  useEffect(() => {
    if (erroNovaSenha) {
      setErroNovaSenhaVisible(true);
      const timer = setTimeout(() => {
        setErroNovaSenhaVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [erroNovaSenha]);

  useEffect(() => {
    if (erroConfirmarNovaSenha) {
      setErroConfirmarNovaSenhaVisible(true);
      const timer = setTimeout(() => {
        setErroConfirmarNovaSenhaVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [erroConfirmarNovaSenha]);

  useEffect(() => {
    if (erroUpdate) {
      setErroUpdateVisible(true);
      const timer = setTimeout(() => {
        setErroUpdateVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [erroUpdate]);

  const handleUpdate = () => {
    onUpdate(senhaAtual, novaSenha, confirmarNovaSenha);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={!modalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.closeButton}
          >
            <FontAwesome
              name="times"
              size={responsiveFontSize(4.5)}
              color="red"
            />
          </TouchableOpacity>
          <Text style={[styles.modalTitle]}>Alterar Senha</Text>
          {erroUpdateVisible && (
            <Text style={[styles.errorMessage, styles.principalError]}>
              {erroUpdate}
            </Text>
          )}
          <Text style={[styles.inputTitulo]}>Senha Atual</Text>
          <View style={styles.inputsContainer}>
            <TextInput
              style={[styles.input]}
              secureTextEntry={true}
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              autoCapitalize={"none"}
            />
          </View>
          {erroAtualSenhaVisible && (
            <Text style={styles.errorMessage}>{erroAtualSenha}</Text>
          )}
          <Text style={[styles.inputTitulo]}>Nova Senha</Text>
          <View style={styles.inputsContainer}>
            <TextInput
              style={[styles.input]}
              secureTextEntry={true}
              value={novaSenha}
              onChangeText={setNovaSenha}
              autoCapitalize={"none"}
            />
          </View>
          {erroNovaSenhaVisible && (
            <Text style={styles.errorMessage}>{erroNovaSenha}</Text>
          )}
          <Text style={[styles.inputTitulo]}>Confirmar Nova Senha</Text>
          <View style={styles.inputsContainer}>
            <TextInput
              style={[styles.input]}
              secureTextEntry={true}
              value={confirmarNovaSenha}
              onChangeText={setConfirmarNovaSenha}
              autoCapitalize={"none"}
            />
          </View>
          {erroConfirmarNovaSenhaVisible && (
            <Text style={styles.errorMessage}>{erroConfirmarNovaSenha}</Text>
          )}
          <BotaoSubmit handleSubmit={handleUpdate} tituloBotao={"ATUALIZAR"} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: responsiveHeight(2),
    borderRadius: responsiveWidth(4),
    width: responsiveWidth(80),
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: responsiveHeight(1),
    textAlign: "center",
    fontSize: responsiveFontSize(3.5),
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputTitulo: {
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(2),
  },
  input: {
    backgroundColor: "#ffffff",
    paddingLeft: responsiveWidth(2),
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    textAlign: "left",
    width: "100%",
    fontSize: responsiveFontSize(2),
  },
  button: {
    backgroundColor: "#F2AE2E",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: responsiveFontSize(2),
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(1),
    right: responsiveWidth(3),
    width: responsiveWidth(8),
    height: responsiveHeight(8),
  },

  errorMessage: {
    color: "red",
    textAlign: "center",
  },
  principalError: {
    fontSize: responsiveFontSize(2),
  },
});

export default AtualizarSenhaModal;
