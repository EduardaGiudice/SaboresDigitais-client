import { View, StyleSheet, ScrollView, TextInput, RefreshControl, TouchableOpacity, Animated } from "react-native";
import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import PostCard from "../components/PostCard";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [buscarItem, setBuscarItem] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Inicializa a animação com valor inicial de opacidade 0

  //Função para recarregar a página quando puxar
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await listarTodosPosts();
    setRefreshing(false);
  }, []);

  // Função para buscar todos os posts
  const listarTodosPosts = async () => {
    try {
      // Faz uma requisição GET para obter todos os posts
      const { data } = await axios.get("/post/posts");
      // Atualiza o estado 'posts' com os posts obtidos
      setPosts(data?.posts);
      setOriginalPosts(data?.posts); // Salva os posts originais
    } catch (error) {
      console.log(error);
    }
  };

  // Função para buscar receitas por nome
  const buscarPorNome = async (text) => {
    // Atualiza o estado 'buscarItem' com o texto da busca
    setBuscarItem(text);
    try {
      // Restaura os posts originais se o campo de busca estiver vazio
      if (text.trim() === "") {
        setPosts(originalPosts);
      } else {
        // Faz uma requisição GET para buscar posts pelo nome
        const { data } = await axios.get(`/post/buscarPorNome/${text}`);
        setPosts(data?.posts); // Atualiza o estado 'posts' com os posts encontrados
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Hook para listar todos os posts quando o componente é focado
  useFocusEffect(
    useCallback(() => {
      listarTodosPosts();
    }, [])
  );

  // Função chamada quando o ScrollView é rolado
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 0) {
      // Se o ScrollView for rolado para baixo, a opacidade do botão é aumentada para 1
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      // Se o ScrollView for rolado para cima, a opacidade do botão é diminuída para 0
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  // Função para rolar para o topo quando o botão é pressionado
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      // Utiliza a referência do ScrollView para rolar para o topo
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.searchContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Buscar receita"
                value={buscarItem}
                onChangeText={buscarPorNome}
              />
              <FontAwesome
                name="search"
                size={responsiveFontSize(3)}
                color="#A94B5C"
                style={styles.searchIcon}
              />
            </View>
          </View>
          {posts?.map((post, i) => (
            <PostCard key={i} posts={posts} post={post} />
          ))}
        </ScrollView>
        <Animated.View
          style={[
            styles.floatingButton,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity onPress={scrollToTop}>
            <AntDesign
              name="up"
              size={responsiveFontSize(3)}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
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
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDE998",
    paddingBottom: responsiveHeight(1),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#A94B5C",
    marginTop: responsiveHeight(1),
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(90),
    paddingHorizontal: responsiveWidth(4),
  },
  input: {
    fontSize: responsiveFontSize(2),
    flex: 1,
    height: responsiveHeight(6),
  },
  searchIcon: {
    marginLeft: responsiveWidth(2),
  },
  floatingButton: {
    position: "absolute",
    bottom: responsiveHeight(2),
    right: responsiveWidth(3),
    backgroundColor: "#A94B5C",
    borderRadius: responsiveWidth(5.5),
    width: responsiveWidth(11,5),
    height: responsiveWidth(11,5),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Feed;
