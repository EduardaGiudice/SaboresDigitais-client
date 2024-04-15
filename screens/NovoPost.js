import React, { useContext, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { PostContext } from "../context/postContext";
import BotaoSubmit from "../components/BotaoSubmit";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useForm, Controller, reset } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  nomeReceita: yup.string().required("O nome da receita é obrigatório"),
  descricaoReceita: yup
    .string()
    .required("A descrição da receita é obrigatória"),
  ingredientes: yup
    .array()
    .of(yup.string())
    .test(
      "is-not-empty",
      "Você deve adicionar ao menos 1 ingrediente",
      (array) => array.some((item) => !!item)
    ),
  passosPreparo: yup
    .array()
    .of(yup.string())
    .test(
      "is-not-empty",
      "Você deve adicionar ao menos 1 passo de preparo",
      (array) => array.some((item) => !!item)
    ),
});

const NovoPost = ({ navigation }) => {
  const [posts, setPosts] = useContext(PostContext);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [nomeReceita, setNomeReceita] = useState("");
  const [descricaoReceita, setDescricaoReceita] = useState("");
  const [ingredientes, setIngredientes] = useState([""]);
  const [passosPreparo, setPassosPreparo] = useState([""]);
  const [imagemReceita, setImagemReceita] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [erroImagem, setErroImagem] = useState(""); // Estado para armazenar o erro da imagem
  const [errorVisible, setErrorVisible] = useState(false);
  const [erroImagemVisible, setErroImagemVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      // Scroll para o topo quando a tela receber foco
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }, [])
  );

  const erroTemporarioImagem = (errorMessage) => {
        setErroImagem(errorMessage);
    setErroImagemVisible(true);

    setTimeout(() => {
      setErroImagemVisible(false);
      setErroImagem("")
    }, 4000);
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

  const limparCampos = () => {
    setNomeReceita("");
    setDescricaoReceita("");
    setIngredientes([""]);
    setPassosPreparo([""]);
    setImagemReceita(null);

  };

  const adicionarIngrediente = () => {
    setIngredientes([...ingredientes, ""]);
  };

  const adicionarPassoPreparo = () => {
    setPassosPreparo([...passosPreparo, ""]);
  };

  const removerIngrediente = (index) => {
    const novosIngredientes = [...ingredientes];
    novosIngredientes.splice(index, 1);
    setIngredientes(novosIngredientes);
  };

  const removerPassoPreparo = (index) => {
    const novosPassos = [...passosPreparo];
    novosPassos.splice(index, 1);
    setPassosPreparo(novosPassos);
  };

  const abrirModal = () => {
    setModalVisible(true);
  };

  const escolherImagem = (source) => {
    if (source) {
      console.log("URI da imagem selecionada:", source); // Adicionando este log para verificar o URI da imagem selecionada
      setImagemReceita(source);
      setModalVisible(false);
    }
  };

  const escolherDaGaleria = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      console.log("Resultado da galeria:", result); // Adicionar este log para verificar o resultado da seleção de imagem

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        escolherImagem(uri);
        console.log("Imagem selecionada:", uri); // Adicionar este log para verificar o URI da imagem selecionada
      }
    } catch (error) {
      console.log("Erro ao selecionar imagem da galeria:", error);
    }
  };

  const tirarFoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      console.log("Resultado da camera:", result); // log para verificar o resultado da captura de imagem

      if (
        !result.cancelled &&
        result.assets &&
        result.assets.length > 0 &&
        result.assets[0].uri
      ) {
        const uri = result.assets[0].uri;
        escolherImagem(uri);
        console.log("Imagem capturada:", uri);
      }
    } catch (error) {
      console.log("Erro ao capturar imagem pela câmera:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!imagemReceita) {
        erroTemporarioImagem("Adicione uma imagem da sua Receita");
        return;
      }
      const formData = new FormData();
      formData.append("nomeReceita", data.nomeReceita);
      formData.append("descricaoReceita", data.descricaoReceita);
      data.ingredientes.forEach((ingrediente, index) => {
        formData.append(`ingredientes[${index}]`, ingrediente);
      });
      data.passosPreparo.forEach((passo, index) => {
        formData.append(`passosPreparo[${index}]`, passo);
      });
      formData.append("imagemReceita", {
        uri: imagemReceita,
        name: `imagem_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
      const { data: responseData } = await axios.post(
        "/post/novoPost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigation.navigate("Feed");
      setPosts([...posts, responseData?.posts]);
      reset();
      limparCampos();
    } catch (error) {
      erroTemporario("Erro ao criar um post");
      console.log(error);
    }
  };

  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDaImagem = menorDimensao * 0.6;

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <View style={styles.containerTitulo}>
            <Text style={styles.titulo}>ADICIONE SUA RECEITA</Text>
          </View>
          <TouchableOpacity onPress={abrirModal}>
            <View style={styles.imagemContainer}>
              {imagemReceita ? (
                <Image
                  source={{ uri: imagemReceita }}
                  style={[
                    styles.imagem,
                    {
                      width: tamanhoDaImagem,
                      height: (tamanhoDaImagem * 4) / 3,
                    },
                  ]}
                />
              ) : (
                <MaterialIcons
                  name="add-a-photo"
                  style={styles.inputImagem}
                ></MaterialIcons>
              )}
            </View>
          </TouchableOpacity>
          {erroImagem !== "" && ( // Verificando se há mensagem de erro
            <Text
              style={[
                styles.error,
                styles.principalError,
                { marginBottom: responsiveHeight(1) },
              ]}
            >
              {erroImagem}
            </Text>
          )}
          <Text style={styles.inputTitulo}>Nome da Receita</Text>
          <View style={styles.inputsContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.inputnormal}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="nomeReceita"
              defaultValue=""
            />
          </View>
          {errors.nomeReceita && (
            <Text style={styles.error}>{errors.nomeReceita.message}</Text>
          )}
          <Text style={styles.inputTitulo}>Descrição</Text>
          <View style={styles.inputsContainer}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.inputMultiline}
                  multiline={true}
                  numberOfLines={2}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="descricaoReceita"
              defaultValue=""
            />
          </View>
          {errors.descricaoReceita && (
            <Text style={styles.error}>{errors.descricaoReceita.message}</Text>
          )}
          <Text
            style={{
              textAlign: "center",
              marginTop: responsiveHeight(3),
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
              color: "gray",
            }}
          >
            INGREDIENTES
          </Text>
          <Text style={[styles.error, { marginBottom: responsiveHeight(2) }]}>
            {errors.ingredientes && errors.ingredientes.message}
          </Text>
          {ingredientes.map((ingrediente, index) => (
            <View key={index} style={styles.inputsContainer}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.inputnormal}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
                name={`ingredientes[${index}]`}
                defaultValue={""}
              />
              <FontAwesome
                name="close"
                onPress={() => removerIngrediente(index)}
                style={styles.removerInput}
              ></FontAwesome>
            </View>
          ))}
          <FontAwesome6
            name="plus"
            style={styles.adicionarInput}
            onPress={adicionarIngrediente}
          ></FontAwesome6>
          <Text
            style={{
              textAlign: "center",
              marginTop: responsiveHeight(3),
              fontSize: responsiveFontSize(2.5),
              fontWeight: "bold",
              color: "gray",
            }}
          >
            MODO DE PREPARO
          </Text>
          <Text style={styles.error}>
            {errors.passosPreparo && errors.passosPreparo.message}
          </Text>
          {passosPreparo.map((passo, index) => (
            <View key={index}>
              <Text style={styles.inputTitulo}>Passo {index + 1}</Text>
              <View style={styles.inputsContainer}>
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.inputMultiline}
                      multiline={true}
                      numberOfLines={3}
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                  name={`passosPreparo[${index}]`}
                  defaultValue={""}
                />

                <FontAwesome
                  name="close"
                  onPress={() => removerPassoPreparo(index)}
                  style={styles.removerInput}
                ></FontAwesome>
              </View>
            </View>
          ))}
          <FontAwesome6
            name="plus"
            style={styles.adicionarInput}
            onPress={adicionarPassoPreparo}
          ></FontAwesome6>
          <BotaoSubmit
            tituloBotao="ADICIONAR"
            handleSubmit={handleSubmit(onSubmit)}
          />
        </View>
      </ScrollView>

      {/* Modal para seleção de imagem */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  containerTitulo: {
    marginBottom: responsiveHeight(2),
    alignItems: "center",
  },
  titulo: {
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(3),
  },
  inputTitulo: {
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(3),
  },
  scrollViewContent: {
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(2),
  },
  inputnormal: {
    backgroundColor: "#ffffff",
    paddingLeft: responsiveWidth(2),
    height: responsiveHeight(6),
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    textAlign: "left",
    width: responsiveWidth(85),
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
    width: responsiveWidth(85),
    fontSize: responsiveFontSize(2),
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  removerInput: {
    color: "red",
    marginLeft: responsiveWidth(1),
    fontSize: responsiveFontSize(3),
    alignSelf: "stretch",
  },
  adicionarInput: {
    color: "#F2AE2E",
    fontSize: responsiveFontSize(4),
    marginLeft: responsiveWidth(1),
    textAlign: "center",
    marginTop: responsiveHeight(2)
  },
  imagemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveHeight(2),
  },
  imagem: {
    resizeMode: "cover",
    borderRadius: responsiveHeight(1),
  },
  inputImagem: {
    fontSize: responsiveFontSize(8),
    color: "gray",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  principalError: {
    fontSize: responsiveFontSize(2),
  },

  // Estilos do modal

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: responsiveHeight(2),
    borderRadius: responsiveHeight(1),
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

export default NovoPost;
