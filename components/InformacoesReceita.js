import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

  //Dimensões da imagem da receita
    const { width, height } = Dimensions.get("window");
    const menorDimensao = Math.min(width, height);
    const tamanhoDaImagem = menorDimensao * 0.7;

const InformacoesReceita = ({ modalVisible, setModalVisible, post }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <FontAwesome
                name="times"
                size={responsiveFontSize(4)}
                color="red"
              />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Image
                style={[
                  styles.modalImage,
                  {
                    width: tamanhoDaImagem,
                    height: (tamanhoDaImagem * 4) / 3,
                  },
                ]}
                source={{ uri: post.imagemReceita }}
              />
            </View>
            <Text style={styles.modalTitle}>{post.nomeReceita}</Text>
            <View>
              <Text style={[styles.modalText, {textAlign: 'center'}]}> {post.descricaoReceita}</Text>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: responsiveHeight(2),
                  marginTop: responsiveHeight(3),
                  fontSize: responsiveFontSize(2.2),
                  fontWeight: "bold",
                  color: "#CE3502",
                }}
              >
                INGREDIENTES
              </Text>
              {post.ingredientes.map((ingrediente, index) => (
                <Text key={index} style={styles.modalText}>
                  • {ingrediente}
                </Text>
              ))}
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: responsiveHeight(2),
                  marginTop: responsiveHeight(3),
                  fontSize: responsiveFontSize(2.2),
                  fontWeight: "bold",
                  color: "#CE3502",
                }}
              >
                MODO DE PREPARO
              </Text>
              {post.passosPreparo.map((passo, index) => (
                <View key={index}>
                  <Text style={styles.passosTitulo}>Passo {index + 1}:</Text>
                  <Text style={styles.modalText}>{passo}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FDE998",
    borderTopStartRadius: responsiveWidth(6),
    borderTopEndRadius: responsiveWidth(6),
    padding: responsiveWidth(5),
    width: "95%",
    marginTop: responsiveHeight(2),
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(1),
    right: responsiveWidth(3),
    width: responsiveWidth(8),
    height: responsiveHeight(8),
  },
  modalImage: {
    marginTop: responsiveHeight(3),
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: responsiveHeight(2),
  },
  modalTitle: {
    fontSize: responsiveFontSize(3.5),
    fontWeight: "bold",
    marginBottom: responsiveHeight(2),
    textAlign: "center",
  },
  modalText: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(1),
  },
  passosTitulo: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(1),
  },
});

export default InformacoesReceita;
