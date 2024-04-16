import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import AtualizarSenhaModal from "../components/AtualizarSenhaModal";
import AlertModal from "../components/AlertModal";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Perfil = () => {
  // Estado global de autenticação
  const [state, setState] = useContext(AuthContext);
  const { usuario, token } = state;

  // State local
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const [imagemSelecionada, setImagemSelecionada] = useState(
    usuario?.imagemPerfil || null
  );
  const [modalImagemVisible, setModalImagemVisible] = useState(false);
  const [dadosCarregados, setDadosCarregados] = useState(false);
  const [modalSenhaVisible, setModalSenhaVisible] = useState(false);
  const [erroAtualSenha, setErroAtualSenha] = useState("");
  const [erroNovaSenha, setErroNovaSenha] = useState("");
  const [erroConfirmarNovaSenha, setErroConfirmarNovaSenha] = useState("");
  const [erroUpdate, setErroUpdate] = useState("");
  const [tituloAlertModal, setTituloAlertModal] = useState("");
  const [message, setMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get("/auth/dadosUsuario", {
          headers: {
            Authorization: `Bearer ${token}`, // Token de autorização
          },
        });

        const userData = response.data; // Dados do usuário retornados pela API
        // Define os campos de usuário no estado local
        setNomeUsuario(userData.usuario.nomeUsuario);
        setEmail(userData.usuario.email);
        setImagemSelecionada(userData.usuario.imagemPerfil || null);
        setDadosCarregados(true); // Marque os dados como carregados
      } catch (error) {
        console.log("Erro ao buscar dados do usuário:", error);
      }
    }

    fetchUserData();
  }, []);

  // Renderizar o componente apenas quando os dados estiverem carregados
  if (!dadosCarregados) {
    return null;
  }

  //logout
  const handleLogout = async () => {
    setState({ token: "", usuario: null }); // Limpa o estado global de autenticação
    await AsyncStorage.removeItem("@auth"); // Remove os dados de autenticação do armazenamento local
  };

  const escolherImagem = (source) => {
    if (source) {
      console.log("URI da imagem selecionada:", source);
      setImagemSelecionada(source); // Define a imagem selecionada no estado
      setModalImagemVisible(false); // Fecha o modal de escolha de imagem
    }
  };

  // Função para escolher imagem da galeria
  const escolherDaGaleria = async () => {
    try {
      // Abrir a galeria de imagens
      let result = await ImagePicker.launchImageLibraryAsync({
        // Apenas imagens são permitidas
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // Permite ao usuário editar a imagem antes de selecioná-la
        allowsEditing: true,
        aspect: [1, 1], // Proporção da imagem
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
        aspect: [1, 1], // Proporção da imagem
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

  // Função para atualizar dados do usuário
  const handleUpdate = async () => {
    try {
      // Cria um objeto FormData para enviar os dados do usuário
      const formData = new FormData();
      formData.append("nomeUsuario", nomeUsuario);
      formData.append("email", email);
      // Se uma imagem foi selecionada, adiciona-a ao FormData
      if (imagemSelecionada) {
        formData.append("imagemPerfil", {
          uri: imagemSelecionada,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }
      // Faz uma requisição PUT para atualizar os dados do usuario
      const { data } = await axios.put("/auth/atualizarUsuario", formData, {
        headers: {
          Authorization: `Bearer ${token && token}`, // Adiciona o token de autenticação
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Resposta da requisição:", data);

      // Atualizar os estados com os novos dados do usuário após a atualização
      setState({
        ...state,
        usuario: {
          ...state.usuario,
          nomeUsuario: data.atualizarUsuario.nomeUsuario,
          email: data.atualizarUsuario.email,
          imagemPerfil: data.atualizarUsuario.imagemPerfil,
        },
      });

      // Atualiza os estados locais com os novos dados do usuário
      setNomeUsuario(data.atualizarUsuario.nomeUsuario);
      setEmail(data.atualizarUsuario.email);
      setImagemSelecionada(data.atualizarUsuario.imagemPerfil);

      // Define o título e a mensagem para o modal de alerta de sucesso
      setTituloAlertModal("Sucesso!");
      setMessage(data && data.message);
      setShowAlertModal(true);
    } catch (error) {
      // Em caso de erro, exibe um modal de alerta com uma mensagem genérica de erro
      setTituloAlertModal("Erro!");
      setMessage("Erro ao atualizar os dados do usuário.");
      setShowAlertModal(true);
      console.log(error);
    }
  };

  // Função para atualizar a senha do usuário
  const atualizarSenha = async (senhaAtual, novaSenha, confirmarNovaSenha) => {
    try {
      // Verifica se o campo 'senhaAtual' está vazio
      if (!senhaAtual) {
        setErroAtualSenha("Digite a Senha Atual.");
        return;
      }

      // Verifica se o campo 'novaSenha' está vazio
      if (!novaSenha) {
        setErroNovaSenha("Digite a Nova Senha.");
        return;
      }

      // Verifica se a nova senha possui mais de 6 caracteres
      if (novaSenha.length < 6) {
        setErroNovaSenha("A Senha deve ter pelo menos 6 caracteres.");
        return;
      }

      // Verifica se o campo 'confirmarNovaSenha' está vazio
      if (!confirmarNovaSenha) {
        setErroConfirmarNovaSenha("Digite a Confirmação da senha.");
        return;
      }

      // Verifica se a nova senha e a confirmação da nova senha são iguais
      if (novaSenha !== confirmarNovaSenha) {
        setErroConfirmarNovaSenha("As senhas não coincidem.");
        return;
      }

      // Faz a requisição PUT para atualizar a senha
      const response = await axios.put(
        "/auth/atualizarSenha",
        {
          senhaAtual,
          novaSenha,
          confirmarNovaSenha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token de autenticação
          },
        }
      );

      // Se a requisição for bem-sucedida, exibe uma mensagem de sucesso
      setTituloAlertModal("Sucesso!");
      setMessage("Senha atualizada com sucesso");
      setShowAlertModal(true);
      setModalSenhaVisible(false);
    } catch (error) {
      // Se a resposta de erro for 400 (Bad Request), indica que a senha atual está incorreta
      if (error.response && error.response.status === 400) {
        setErroAtualSenha("Senha atual incorreta");
      } else {
        // exibe uma mensagem genérica de erro
        setErroUpdate("Erro ao atualizar senha. Por favor, tente novamente.");
        console.error("Erro ao atualizar senha:", error);
      }
    }
  };

  // Função para alternar a visibilidade do modal de escolha de imagem
  const toggleModalImagem = () => {
    setModalImagemVisible(!modalImagemVisible);
  };

  // Função para abrir o modal de Atualização de senha
  const abrirModalSenha = () => {
    setModalSenhaVisible(true);
  };

  //Dimensões da imagem de perfil
  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDaImagem = menorDimensao * 0.5;

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <MaterialIcons
                name="logout"
                style={{ fontSize: responsiveFontSize(4) }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.imagemContainer}>
            <Image
              source={{ uri: imagemSelecionada }}
              style={[
                styles.imagem,
                {
                  width: tamanhoDaImagem,
                  height: (tamanhoDaImagem * 1) / 1,
                },
              ]}
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={toggleModalImagem}
            >
              <FontAwesome
                name="camera"
                size={responsiveFontSize(3)}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputTitulo}>Nome</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputNormal}
              value={nomeUsuario}
              onChangeText={(text) => setNomeUsuario(text)}
            />
          </View>
          <Text style={styles.inputTitulo}>Email</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputNormal}
              value={email}
              editable={false}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.botao} onPress={handleUpdate}>
              <Text style={styles.textoBotao}>ATUALIZAR</Text>
            </TouchableOpacity>
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
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.botaoSenha}
              onPress={abrirModalSenha}
            >
              <Text style={styles.textoBotao}>ALTERAR SENHA</Text>
            </TouchableOpacity>
          </View>
          <AtualizarSenhaModal
            modalVisible={modalSenhaVisible}
            setModalVisible={setModalSenhaVisible}
            onUpdate={atualizarSenha}
            erroAtualSenha={erroAtualSenha}
            erroUpdate={erroUpdate}
            erroNovaSenha={erroNovaSenha}
            erroConfirmarNovaSenha={erroConfirmarNovaSenha}
          />
        </View>
      </ScrollView>
      <AlertModal
        visible={showAlertModal}
        message={message}
        onClose={() => setShowAlertModal(false)}
        titulo={tituloAlertModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inputTitulo: {
    fontWeight: "bold",
    color: "gray",
    textAlign: "left",
    marginBottom: responsiveHeight(1),
    marginLeft: responsiveWidth(6),
  },
  inputNormal: {
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
  botao: {
    backgroundColor: "#F2AE2E",
    color: "white",
    height: responsiveHeight(7),
    width: responsiveWidth(50),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveHeight(5),
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
  },
  botaoSenha: {
    backgroundColor: "#F27507",
    color: "white",
    height: responsiveHeight(7),
    width: responsiveWidth(70),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveHeight(5),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveHeight(5),
  },
  imagemContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveHeight(3),
    marginHorizontal: responsiveWidth(20),
    marginTop: responsiveHeight(3),
  },
  cameraButton: {
    position: "absolute",
    bottom: responsiveHeight(1),
    right: responsiveWidth(7.5),
    backgroundColor: "#F27507",
    borderRadius: responsiveWidth(7),
    padding: responsiveWidth(2.5),
  },
  imagem: {
    resizeMode: "cover",
    borderRadius: responsiveHeight(16),
  },
  logoutButton: {
    position: "absolute",
    top: responsiveHeight(1),
    right: responsiveWidth(3),
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

export default Perfil;
