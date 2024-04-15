import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import BotaoSubmit from "./BotaoSubmit";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const unidadesDeMedida = [
  { label: "Unidade(s)", value: "unidade(s)" },
  { label: "Grama(s)", value: "grama(s)" },
  { label: "Quilo(s)", value: "quilo(s)" },
  { label: "Mililitro(s)", value: "mililitro(s)" },
  { label: "Litro(s)", value: "litro(s)" },
  { label: "Dúzia(s)", value: "duzia(s)" },
  { label: "Caixa(s)", value: "caixa(s)" },
];

const ModalAdicionarItem = ({ modalVisible, closeModal, adicionarItem }) => {
  const [quantidade, setQuantidade] = useState("");
  const [unidadeMedida, setUnidadeMedida] = useState("");
  const [nomeItem, setNomeItem] = useState("");
  const [erros, setErros] = useState({
    quantidade: "",
    unidadeMedida: "",
    nomeItem: "",
  });

  const handleAdicionarItem = () => {
    // Limpar erros
    setErros({ quantidade: "", unidadeMedida: "", nomeItem: "" });

    // Validar campos
    let temErro = false;
    if (!quantidade) {
      setErros((prevErros) => ({
        ...prevErros,
        quantidade: "Digite a quantidade desejada",
      }));
      temErro = true;
    }
    if (!unidadeMedida) {
      setErros((prevErros) => ({
        ...prevErros,
        unidadeMedida: "Selecione a unidade de medida",
      }));
      temErro = true;
    }
    if (!nomeItem) {
      setErros((prevErros) => ({
        ...prevErros,
        nomeItem: "Digite o nome do item",
      }));
      temErro = true;
    }

    // Se houver erro, não adicionar o item
    if (temErro) return;

    // Adicionar o item
    adicionarItem({ quantidade, unidadeMedida, nomeItem });
    setQuantidade("");
    setUnidadeMedida("");
    setNomeItem("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <FontAwesome
              name="times"
              size={responsiveFontSize(4.5)}
              color="red"
            />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Adicionar Item</Text>
          <Text style={styles.inputTitulo}>Quantidade</Text>
          <View style={styles.inputsContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  height: responsiveHeight(6),
                  fontSize: responsiveFontSize(1.8),
                },
              ]}
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
            />
          </View>
          {!!erros.quantidade && (
            <Text style={styles.errorMessage}>{erros.quantidade}</Text>
          )}
          <Text style={styles.inputTitulo}>Unidade de medida</Text>
          <View style={styles.selectView}>
            <RNPickerSelect
              style={pickerSelectStyles}
              placeholder={{
                label: "Selecionar...",
                value: null,
              }}
              items={unidadesDeMedida}
              value={unidadeMedida}
              onValueChange={(value) => setUnidadeMedida(value)}
            />
          </View>
          {!!erros.unidadeMedida && (
            <Text style={styles.errorMessage}>{erros.unidadeMedida}</Text>
          )}
          <Text style={styles.inputTitulo}>Nome do Item</Text>
          <View style={styles.inputsContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  height: responsiveHeight(6),
                  fontSize: responsiveFontSize(1.8),
                },
              ]}
              value={nomeItem}
              onChangeText={setNomeItem}
            />
          </View>
          {!!erros.nomeItem && (
            <Text style={styles.errorMessage}>{erros.nomeItem}</Text>
          )}
          <View style={styles.botaoView}>
            <BotaoSubmit
              handleSubmit={handleAdicionarItem}
              tituloBotao={"SALVAR"}
              
            />
          </View>
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
    backgroundColor: "#fff",
    padding: responsiveWidth(5),
    borderRadius: responsiveWidth(2),
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
  selectView: {
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginBottom: responsiveHeight(1),
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(1),
    right: responsiveWidth(3),
    width: responsiveWidth(8),
    height: responsiveHeight(8),
  },
  botaoView: {
    marginTop: responsiveHeight(1),
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: responsiveFontSize(1.8),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: responsiveWidth(2),
    color: "black",
    paddingRight: responsiveWidth(10),
    marginBottom: responsiveHeight(1),
  },
  inputAndroid: {
    fontSize: responsiveFontSize(1.8),
    borderColor: "black",
    color: "black",
    paddingRight: responsiveWidth(10),
  },
});

export default ModalAdicionarItem;
