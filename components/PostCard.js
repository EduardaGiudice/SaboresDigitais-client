import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import moment from "moment";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import EditarModal from "./EditarModal";
import InformacoesReceita from "./InformacoesReceita";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import AlertConfirmModal from "./AlertConfirmModal";

const PostCard = ({ telaMeusPosts, post, listarMeusPosts }) => {
  const navigation = useNavigation();
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [postagens, setPostagens] = useState({});
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comentariosCount, setComentariosCount] = useState(0);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);


    useFocusEffect(
      useCallback(() => {
        checkIfLiked();
        fetchLikesCount();
        fetchComentariosCount()
      }, [post._id])
    );


  const checkIfLiked = async () => {
    try {
      const response = await axios.get(`/post/checkLike/${post._id}`);
      setLiked(response.data.liked);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLikesCount = async () => {
    try {
      const response = await axios.get(`/post/numLikes/${post._id}`);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.log(error);
    }
  };

    const fetchComentariosCount = async () => {
      try {
        const response = await axios.get(`/comentarios/numComentarios/${post._id}`);
        setComentariosCount(response.data.comentariosCount);
      } catch (error) {
        console.log(error);
      }
    };

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete(`/post/dislike/${post._id}`);
        setLiked(false);
        setLikesCount((prevCount) => prevCount - 1);
      } else {
        await axios.post(`/post/like/${post._id}`);
        setLiked(true);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletarPrompt = () => {
    setModalConfirmVisible(true);
  };

  //Deletar post
  const handleDeletar = async (id) => {
    try {
      const { data } = await axios.delete(`/post/deletarPost/${id}`);
      setModalConfirmVisible(false);
      listarMeusPosts();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDaImagem = menorDimensao * 0.8;
  const tamanhoAvatar = menorDimensao * 0.1;

  return (
    <View>
      {modalEditarVisible && (
        <EditarModal
          modalVisible={modalEditarVisible}
          setModalVisible={setModalEditarVisible}
          post={postagens}
          listarMeusPosts={listarMeusPosts}
        />
      )}
      {modalInfoVisible && (
        <InformacoesReceita
          modalVisible={modalInfoVisible}
          setModalVisible={setModalInfoVisible}
          post={postagens}
        />
      )}
      <AlertConfirmModal
        visible={modalConfirmVisible}
        closeModal={() => setModalConfirmVisible(false)}
        title="Excluir Post"
        message="Tem certeza que deseja excluir esse post?"
        onConfirm={() => handleDeletar(post?._id)}
      />
      <View style={styles.card}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
                uri: post?.donoPost?.imagemPerfil,
              }}
            />
            <Text
              style={{
                textAlignVertical: "center",
                marginLeft: responsiveWidth(1),
                fontSize: responsiveFontSize(2),
              }}
            >
              {post?.donoPost?.nomeUsuario}
            </Text>
          </View>
          {telaMeusPosts && (
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginRight: responsiveWidth(3.5) }}>
                <FontAwesome5
                  name="pen"
                  size={responsiveFontSize(2.7)}
                  color={"darkblue"}
                  onPress={() => {
                    setPostagens(post);
                    setModalEditarVisible(true);
                  }}
                />
              </Text>
              <Text style={{ textAlign: "right" }}>
                <FontAwesome
                  name="trash"
                  size={responsiveFontSize(2.7)}
                  color={"red"}
                  onPress={() => handleDeletarPrompt(post?._id)}
                />
              </Text>
            </View>
          )}
        </View>
        <View style={styles.fotoContainer}>
          <Image
            style={[
              styles.fotoReceita,
              {
                width: tamanhoDaImagem,
                height: (tamanhoDaImagem * 4) / 3,
              },
            ]}
            source={{ uri: post?.imagemReceita }}
          />
        </View>
        <Text style={styles.receitaNome}>{post?.nomeReceita}</Text>
        <Text>{post?.descricaoReceita}</Text>

        <View style={styles.footerCard}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={handleLike}
              style={{
                marginRight: responsiveFontSize(0.2),
              }}
            >
              {liked ? (
                <FontAwesome
                  name="heart"
                  size={responsiveFontSize(3)}
                  color="red"
                />
              ) : (
                <FontAwesome
                  name="heart-o"
                  size={responsiveFontSize(3)}
                  color="black"
                />
              )}
            </TouchableOpacity>

            <Text> {likesCount}</Text>
          </View>
          <View
            style={{ flexDirection: "row", marginLeft: responsiveWidth(3.5) }}
          >
            <TouchableOpacity
              style={{
                marginRight: responsiveFontSize(0.4),
              }}
              onPress={() =>
                navigation.navigate("Comentarios", { postId: post._id })
              }
            >
              <FontAwesome
                name="comment-o"
                size={responsiveFontSize(3)}
                color="black"
              />
            </TouchableOpacity>

            <Text> {comentariosCount}</Text>
          </View>

          <TouchableOpacity
            style={styles.verReceitaButton}
            onPress={() => {
              setPostagens(post);
              setModalInfoVisible(true);
            }}
          >
            <Text style={styles.verReceitaText}>Ver Receita</Text>
          </TouchableOpacity>
          <Text style={styles.date}>
            <FontAwesome
              name="calendar"
              color={"#F27507"}
              size={responsiveFontSize(2)}
            />{" "}
            {moment(post?.createdAt).format("DD/MM/YYYY")}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#A94B5C",
    padding: responsiveWidth(4),
    borderRadius: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
    marginTop: responsiveHeight(1),
  },
  footerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: responsiveHeight(2),
    alignItems: "flex-end", // Adicionado para alinhar os itens na parte inferior
  },
  receitaNome: {
    fontSize: responsiveFontSize(3),
    marginBottom: responsiveHeight(1),
    marginTop: responsiveHeight(1),
  },
  fotoContainer: {
    alignItems: "center",
  },
  fotoReceita: {
    resizeMode: "cover",
    borderRadius: responsiveHeight(1),
  },
  fotoPerfil: {
    borderRadius: responsiveHeight(5),
  },
  verReceitaButton: {
    backgroundColor: "#A94B5C",
    padding: responsiveHeight(1.3),
    borderRadius: responsiveHeight(0.5),
    alignSelf: "center",
    marginTop: responsiveHeight(1),
    marginLeft: responsiveWidth(5.5),
  },
  verReceitaText: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },

  date: {
    flex: 1,
    textAlign: "right",
    fontSize: responsiveFontSize(1.6),
  },
});

export default PostCard;
