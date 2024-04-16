import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import BotaoSubmit from "./BotaoSubmit";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AlertModal from "./AlertModal";

const EditarModal = ({
  modalVisible,
  setModalVisible,
  post,
  listarMeusPosts,
}) => {
  const [nomeReceita, setNomeReceita] = useState("");
  const [descricaoReceita, setDescricaoReceita] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [passosPreparo, setPassosPreparo] = useState([]);
  const navigation = useNavigation();
  const [imagemSelecionada, setImagemSelecionada] = useState(
    post?.imagemReceita || null
  );

  const [modalImagemVisible, setModalImagemVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [error, setError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);

  // Chama os dados do post quando o modal é aberto
  useEffect(() => {
    setNomeReceita(post?.nomeReceita);
    setDescricaoReceita(post?.descricaoReceita);
    setIngredientes(post?.ingredientes || []);
    setPassosPreparo(post?.passosPreparo || []);
    setImagemSelecionada(post?.imagemReceita || null);
  }, [post]);

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, ""]);
  };

  const removerIngrediente = (index) => {
    const novosIngredientes = [...ingredientes];
    novosIngredientes.splice(index, 1);
    setIngredientes(novosIngredientes);
  };

  const adicionarPassoPreparo = () => {
    setPassosPreparo([...passosPreparo, ""]);
  };

  const removerPassoPreparo = (index) => {
    const novosPassos = [...passosPreparo];
    novosPassos.splice(index, 1);
    setPassosPreparo(novosPassos);
  };

  const escolherImagem = (source) => {
    if (source) {
      console.log("URI da imagem selecionada:", source);
      setImagemSelecionada(source);
      setModalImagemVisible(false);
    }
  };

  //Função para selecionar a foto da galeria
  const escolherDaGaleria = async () => {
    try {
      // Abrir a galeria de imagens
      let result = await ImagePicker.launchImageLibraryAsync({
        // Apenas imagens são permitidas
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // Permite ao usuário editar a imagem antes de selecioná-la
        allowsEditing: true,
        aspect: [3, 4], // Proporção da imagem
        quality: 1, //Qualidade
      });

      console.log("Resultado da galeria:", result);

      // Se o usuário não cancelou e uma imagem foi selecionada
      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        // Chama a função escolherImagem para definir a imagem selecionada
        escolherImagem(uri);
        console.log("Imagem selecionada:", uri);
      }
    } catch (error) {
      console.log("Erro ao selecionar imagem da galeria:", error);
    }
  };

  //Função para tirar a foto usando a camera
  const tirarFoto = async () => {
    try {
      // Abrir a câmera
      let result = await ImagePicker.launchCameraAsync({
        // Apenas imagens são permitidas
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // Permite ao usuário editar a imagem antes de selecioná-la
        allowsEditing: true,
        aspect: [3, 4], // Proporção da imagem
        quality: 1, //Qualidade
      });
      console.log("Resultado da camera:", result);

      // Se o usuário não cancelou e uma imagem foi capturada
      if (
        !result.cancelled &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        const uri = result.assets[0].uri;
        // Chama a função escolherImagem para definir a imagem selecionada
        escolherImagem(uri);
        console.log("Imagem capturada:", uri);
      }
    } catch (error) {
      console.log("Erro ao capturar imagem pela câmera:", error);
    }
  };

  // Função para mostrar o erro temporariamente
  const erroTemporario = (errorMessage) => {
    setError(errorMessage);
    setErrorVisible(true);

    // Define um temporizador para limpar o estado de erro após 3 segundos
    setTimeout(() => {
      setErrorVisible(false);
      setError(""); // Limpa o erro
    }, 4000);
  };

  const atualizarPostHandler = async (id) => {
    try {
      // Criar um novo objeto FormData
      const formData = new FormData();
      formData.append("nomeReceita", nomeReceita);
      formData.append("descricaoReceita", descricaoReceita);
      formData.append("imagemReceita", {
        uri: imagemSelecionada,
        name: `imagem_${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      // Adicionar os ingredientes e passos de preparo
      ingredientes.forEach((ingrediente, index) => {
        formData.append(`ingredientes[${index}]`, ingrediente);
      });
      passosPreparo.forEach((passo, index) => {
        formData.append(`passosPreparo[${index}]`, passo);
      });

      // Enviar a requisição com o objeto FormData
      const { data } = await axios.put(`/post/atualizarPost/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //Chamar a função para atualizar a lista de meus posts
      await listarMeusPosts();
      showAlertModal(data?.message);
    } catch (error) {
      erroTemporario("Erro ao atualizar o post");
      console.log(error);
    }
  };

  // Função para alternar a visibilidade do modal de escolha de imagem
  const toggleModalImagem = () => {
    setModalImagemVisible(!modalImagemVisible);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Função para mostrar o modal de alerta
  const showAlertModal = (message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  // Função para fechar o AlertModal e, em seguida, fechar o EditarModal
  const closeModals = () => {
    setAlertVisible(false);
    closeModal();
  };

  //Dimensões da imagem
  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDaImagem = menorDimensao * 0.6;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setShouldCloseModal(false);
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.containerTitulo}>
              <Text
                style={[styles.titulo, { fontSize: responsiveFontSize(2.5) }]}
              >
                ATUALIZAR POST
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.closeButton}
            >
              <FontAwesome
                name="close"
                size={responsiveFontSize(4.5)}
                color="red"
              />
            </TouchableOpacity>
            <View style={styles.imagemContainer}>
              <Image
                source={{ uri: imagemSelecionada }}
                style={[
                  styles.imagem,
                  {
                    width: tamanhoDaImagem,
                    height: (tamanhoDaImagem * 4) / 3,
                  },
                ]}
              />
              <TouchableOpacity
                style={[styles.cameraButton]}
                onPress={toggleModalImagem}
              >
                <FontAwesome
                  name="camera"
                  size={responsiveFontSize(3.5)}
                  color="white"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputTitulo}>Nome da Receita</Text>
            <View style={styles.inputsContainer}>
              <TextInput
                style={[
                  styles.inputnormal,
                  {
                    height: responsiveHeight(7),
                    fontSize: responsiveFontSize(2),
                  },
                ]}
                value={nomeReceita}
                onChangeText={(text) => {
                  setNomeReceita(text);
                }}
              />
            </View>
            <Text style={styles.inputTitulo}>Descrição</Text>
            <View style={styles.inputsContainer}>
              <TextInput
                style={[
                  styles.inputMultiline,
                  {
                    height: responsiveHeight(10),
                    fontSize: responsiveFontSize(2),
                  },
                ]}
                multiline={true}
                numberOfLines={3}
                value={descricaoReceita}
                onChangeText={(text) => {
                  setDescricaoReceita(text);
                }}
              />
            </View>
            <Text
              style={{
                textAlign: "center",
                marginBottom: responsiveHeight(2),
                marginTop: responsiveHeight(2),
                fontSize: responsiveFontSize(2),
                fontWeight: "bold",
                color: "gray",
              }}
            >
              INGREDIENTES
            </Text>
            {ingredientes.map((ingrediente, index) => (
              <View key={index} style={styles.inputsContainer}>
                <TextInput
                  style={[
                    styles.inputnormal,
                    {
                      height: responsiveHeight(7),
                      fontSize: responsiveFontSize(2),
                    },
                  ]}
                  value={ingrediente}
                  onChangeText={(text) => {
                    const newIngredients = [...ingredientes];
                    newIngredients[index] = text;
                    setIngredientes(newIngredients);
                  }}
                />
                <Pressable
                  onPress={() => removerIngrediente(index)}
                  style={styles.removerInput}
                >
                  <FontAwesome
                    name="close"
                    size={responsiveFontSize(3)}
                    color="red"
                  />
                </Pressable>
              </View>
            ))}
            <FontAwesome6
              name="plus"
              size={responsiveFontSize(3)}
              onPress={adicionarIngrediente}
              style={styles.adicionarInput}
            />
            <Text
              style={{
                textAlign: "center",
                marginBottom: responsiveHeight(2),
                marginTop: responsiveHeight(2),
                fontSize: responsiveFontSize(2),
                fontWeight: "bold",
                color: "gray",
              }}
            >
              MODO DE PREPARO
            </Text>
            {passosPreparo.map((passo, index) => (
              <View key={index} style={styles.inputsContainer}>
                <TextInput
                  style={[
                    styles.inputMultiline,
                    {
                      height: responsiveHeight(10),
                      fontSize: responsiveFontSize(2),
                    },
                  ]}
                  multiline={true}
                  numberOfLines={3}
                  value={passo}
                  onChangeText={(text) => {
                    const newPreparo = [...passosPreparo];
                    newPreparo[index] = text;
                    setPassosPreparo(newPreparo);
                  }}
                />
                <Pressable
                  onPress={() => removerPassoPreparo(index)}
                  style={styles.removerInput}
                >
                  <FontAwesome
                    name="close"
                    size={responsiveFontSize(3)}
                    color="red"
                  />
                </Pressable>
              </View>
            ))}
            <FontAwesome6
              name="plus"
              size={responsiveFontSize(3)}
              onPress={adicionarPassoPreparo}
              style={styles.adicionarInput}
            />
            {error !== "" && ( // Verificando se há mensagem de erro
              <Text style={[styles.error, styles.principalError]}>{error}</Text>
            )}
            <BotaoSubmit
              tituloBotao="ATUALIZAR"
              handleSubmit={() => atualizarPostHandler(post && post?._id)}
            />
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalImagemVisible}
          onRequestClose={toggleModalImagem}
        >
          <View style={styles.modalImgContainer}>
            <View style={styles.modalImgContent}>
              <View style={styles.modalOptionsContainer}>
                <FontAwesome
                  name="camera"
                  onPress={tirarFoto}
                  style={styles.modalOption}
                ></FontAwesome>
                <FontAwesome
                  name="photo"
                  onPress={escolherDaGaleria}
                  style={styles.modalOption}
                ></FontAwesome>
              </View>
              <TouchableOpacity onPress={() => setModalImagemVisible(false)}>
                <Text style={styles.modalCancel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <AlertModal
          visible={alertVisible}
          message={alertMessage}
          titulo="Atualizar Post"
          onClose={closeModals}
        />
      </ScrollView>
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
  containerTitulo: {
    marginBottom: responsiveHeight(2),
    alignItems: "center",
  },
  titulo: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(4),
  },
  modalContent: {
    backgroundColor: "#eeeeee",
    borderTopStartRadius: responsiveWidth(6),
    borderTopEndRadius: responsiveWidth(6),
    padding: responsiveWidth(5),
    width: "95%",
    marginTop: responsiveHeight(2),
  },
  btnContainer: {
    flexDirection: "row",
  },
  button: {
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(3),
    elevation: 2,
    width: responsiveWidth(30),
    margin: responsiveWidth(2),
  },
  buttonSubmit: {
    backgroundColor: "#F27507",
  },
  closeButton: {
    position: "absolute",
    top: responsiveHeight(1),
    right: responsiveWidth(3),
    width: responsiveWidth(8),
    height: responsiveHeight(8),
  },
  removerInput: {
    color: "red",
    marginLeft: responsiveWidth(1),
    fontSize: responsiveFontSize(3),
    alignSelf: "stretch",
  },
  inputTitulo: {
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
    marginBottom: responsiveHeight(1),
  },
  adicionarInput: {
    color: "#F2AE2E",
    fontSize: responsiveFontSize(3),
    marginLeft: responsiveWidth(1),
    textAlign: "center",
    marginBottom: responsiveHeight(2),
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputnormal: {
    backgroundColor: "#ffffff",
    paddingLeft: responsiveWidth(2),
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginBottom: responsiveHeight(3),
    borderRadius: responsiveHeight(1),
    textAlign: "left",
    width: responsiveWidth(80),
    fontSize: responsiveFontSize(2),
  },
  inputMultiline: {
    backgroundColor: "#ffffff",
    paddingLeft: responsiveWidth(2),
    height: responsiveHeight(8),
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    textAlignVertical: "top",
    textAlign: "left",
    width: responsiveWidth(80),
    fontSize: responsiveFontSize(2),
  },
  imagemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveHeight(5),
  },
  imagem: {
    resizeMode: "cover",
    borderRadius: responsiveWidth(5),
  },
  cameraButton: {
    position: "absolute",
    bottom: responsiveHeight(1),
    right: responsiveWidth(8),
    backgroundColor: "#F27507",
    borderRadius: responsiveWidth(7),
    padding: responsiveWidth(2.5),
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  principalError: {
    fontSize: responsiveFontSize(2),
  },

  //Estilos modal imagem

  modalImgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImgContent: {
    backgroundColor: "white",
    padding: responsiveWidth(5),
    borderRadius: responsiveWidth(5),
    width: "80%",
    alignItems: "center",
  },
  modalOptionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: responsiveHeight(2),
  },
  modalOption: {
    fontSize: responsiveFontSize(6),
    marginHorizontal: responsiveWidth(7),
  },
  modalCancel: {
    fontSize: responsiveFontSize(2.5),
    marginVertical: responsiveHeight(1),
    color: "red",
  },
});

export default EditarModal;
