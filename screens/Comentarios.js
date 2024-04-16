import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  responsiveWidth,
  responsiveFontSize,
  responsiveHeight,
} from "react-native-responsive-dimensions";
import moment from "moment";
import FontAwesome from "react-native-vector-icons/FontAwesome";


const Comentarios = ({ route }) => {
  const { postId } = route.params;
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");

  // Busca os comentários quando o componente monta
  useEffect(() => {
    fetchComentarios();
  }, []);

  // Função para buscar os comentários do servidor
  const fetchComentarios = async () => {
    try {
      // Faz uma requisição GET para buscar os comentários
      const response = await axios.get(
        `/comentarios/listarComentarios/${postId}`
      );
      // Atualiza o estado com os comentários obtidos
      setComentarios(response.data.comentarios);
    } catch (error) {
      console.log(error);
    }
  };

  // Função para enviar um novo comentário
  const enviarComentario = async () => {
    try {
      // Faz uma requisição POST para enviar o novo comentário
      await axios.post(`/comentarios/novoComentario/${postId}`, {
        comentario: novoComentario,
      });
      fetchComentarios(); // Atualiza a lista de comentários após o envio
      setNovoComentario(""); // Limpa o input para adicionar novo comentário
    } catch (error) {
      console.log(error);
    }
  };

  //Dimensões da foto de perfil no comentário
  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoAvatar = menorDimensao * 0.12;

  return (
    <View style={styles.container}>
      <FlatList
        data={comentarios}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "row",
                marginBottom: responsiveHeight(1),
                marginLeft: responsiveWidth(1),
              }}
            >
              <Image
                style={[
                  styles.fotoPerfil,
                  {
                    width: tamanhoAvatar,
                    height: tamanhoAvatar,
                  },
                ]}
                source={{
                  uri: item?.usuario?.imagemPerfil,
                }}
              />
              <View style={styles.comentarioView}>
                <View>
                  <Text style={{ fontSize: responsiveFontSize(1.7) }}>
                    {item.usuario.nomeUsuario}
                  </Text>
                </View>
                <View style={{ width: responsiveWidth(75) }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      marginVertical: responsiveHeight(1),
                    }}
                  >
                    {item.comentario}
                  </Text>
                </View>
              </View>
              <Text style={styles.date}>
                <FontAwesome
                  name="calendar"
                  color={"#F27507"}
                  size={responsiveFontSize(1.6)}
                />{" "}
                {moment(item?.createdAt).format("DD/MM/YYYY")}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
      />
      <View style={styles.inputsContainer}>
        <TextInput
          placeholder="Digite seu comentário"
          multiline={true}
          numberOfLines={2}
          value={novoComentario}
          onChangeText={(text) => setNovoComentario(text)}
          style={styles.inputMultiline}
        />
      </View>
      <TouchableOpacity onPress={enviarComentario} style={styles.botaoEnviar}>
        <Text style={styles.textoBotao}>ENVIAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
    marginTop: responsiveHeight(1.5)
  },
  inputMultiline: {
    backgroundColor: "#ffffff",
    paddingLeft: responsiveWidth(3),
    height: responsiveHeight(8),
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    textAlignVertical: "top",
    textAlign: "left",
    width: responsiveWidth(90),
    fontSize: responsiveFontSize(2),
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveHeight(1.5)
  },
  fotoPerfil: {
    borderRadius: responsiveHeight(5),
  },
  comentarioView: {
    marginLeft: responsiveWidth(3),
  },
  botaoEnviar: {
    height: responsiveHeight(7),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A94B5C",
  },
  textoBotao: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: responsiveFontSize(2.5),
    fontWeight: "bold",
  },
  date: {
    position: "absolute",
    right: responsiveWidth(1),
    fontSize: responsiveFontSize(1.4)
  },
});

export default Comentarios;
