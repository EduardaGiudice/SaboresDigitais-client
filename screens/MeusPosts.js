import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import PostCard from "../components/PostCard";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const MeusPosts = ({navigation}) => {
  const [posts, setPosts] = useState([]);

  //Listar posts de usuario
  const listarMeusPosts = async () => {
    try {
      const { data } = await axios.get("/post/meusPosts");
      setPosts(data?.usuarioPosts);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      listarMeusPosts();
    }, [])
  );

  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDaImagem = menorDimensao * 1;

  return (
    <View style={styles.container}>
      {posts.length === 0 ? ( // Renderiza a imagem apenas se a lista de posts estiver vazia
        <TouchableOpacity // TouchableOpacity wrapping the image
          onPress={() => navigation.navigate("NovoPost")} // Navigating to 'NovoPost' screen on press
          style={styles.imageView}
        >
          <Image
            source={require("../assets/AdicionarReceita.png")}
            style={[
              styles.emptyImage,
              {
                width: tamanhoDaImagem,
                height: tamanhoDaImagem,
              },
            ]}
          />
        </TouchableOpacity>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {posts.map((post, i) => (
            <PostCard
              key={i}
              posts={posts}
              post={post}
              telaMeusPosts={true}
              listarMeusPosts={listarMeusPosts}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#FDE998",
  },
  scrollViewContent: {
    paddingHorizontal: responsiveWidth(4),
    paddingTop: responsiveHeight(2),
  },
  imageView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default MeusPosts;
