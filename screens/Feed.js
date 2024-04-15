import { View, StyleSheet, ScrollView, TextInput } from "react-native";
import React, { useState, useCallback } from "react";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import PostCard from "../components/PostCard";
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

  const listarTodosPosts = async () => {
    try {
      const { data } = await axios.get("/post/posts");
      setPosts(data?.posts);
      setOriginalPosts(data?.posts); // Salva os posts originais
    } catch (error) {
      console.log(error);
    }
  };

  const buscarPorNome = async (text) => {
    setBuscarItem(text);
    try {
      if (text.trim() === "") {
        setPosts(originalPosts); // Restaura os posts originais
      } else {
        const { data } = await axios.get(`/post/buscarPorNome/${text}`);
        setPosts(data?.posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      listarTodosPosts();
    }, [])
  );

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
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
});

export default Feed;
