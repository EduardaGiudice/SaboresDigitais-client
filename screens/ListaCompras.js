import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import axios from "axios";
import ModalAdicionarItem from "../components/ModalAdicionarItem";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AlertConfirmModal from "../components/AlertConfirmModal";



const ListaCompras = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [lista, setLista] = useState([]);

  // Carregar a lista de compras ao montar o componente
  useEffect(() => {
    carregarLista();
  }, []);

  // Função para carregar a lista de compras
  const carregarLista = async () => {
    try {
      // Requisição GET para obter os itens da lista
      const response = await axios.get("lista/listarItens");
      // Atualiza o estado com os itens obtidos
      setLista(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    }
  };

  // Função para adicionar um item à lista de compras
  const adicionarItem = async ({ quantidade, unidadeMedida, nomeItem }) => {
    try {
      // Requisição POST para adicionar o item
      await axios.post("/lista/adicionarItem", {
        quantidade,
        unidadeMedida,
        nomeItem,
      });
      carregarLista(); // Recarrega a lista após adicionar o item
      setModalVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  };

  // Função para remover um item da lista de compras
  const removerItem = async (itemId) => {
    try {
      // Requisição DELETE para remover o item
      await axios.delete(`/lista/removerItem/${itemId}`);
      carregarLista(); // Recarrega a lista após remover o item
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };

  // Função que chama o modal de confirmação da limpeza dos itens da lista
  const limparLista = async () => {
    setConfirmModalVisible(true);
  };

  // Função para confirmar a limpeza da lista
  const confirmLimparLista = async () => {
    try {
      // Requisição DELETE para excluir todos os itens da lista
      await axios.delete("/lista/limparLista");
      carregarLista(); // Recarrega a lista após limpar
      setConfirmModalVisible(false); // Escondendo o modal de confirmação após a limpeza
    } catch (error) {
      console.error("Erro ao limpar lista:", error);
    }
  };

  // Função para renderizar um item da lista de compras
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text
        style={styles.textoItem}
      >{`${item.quantidade} ${item.unidadeMedida} de ${item.nomeItem}`}</Text>
      <TouchableOpacity onPress={() => removerItem(item._id)}>
        <FontAwesome name="times" size={responsiveFontSize(3)} color="red" />
      </TouchableOpacity>
    </View>
  );

  React.useLayoutEffect(() => {
    // Efeito para configurar o header da tela, adicionando o botão limpar lista
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={[styles.botaoLimparLista]}
          onPress={limparLista}
        >
          <Text style={styles.textoBotao}>LIMPAR LISTA</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  //Dimensões da imagem
  const { width, height } = Dimensions.get("window");
  const menorDimensao = Math.min(width, height);
  const tamanhoDaImagem = menorDimensao * 1;

  return (
    <>
      <AlertConfirmModal
        visible={confirmModalVisible}
        closeModal={() => setConfirmModalVisible(false)}
        title="Limpar Lista"
        message="Tem certeza que deseja limpar a lista de compras?"
        onConfirm={confirmLimparLista} // Função para confirmar a limpeza da lista
      />
      <ModalAdicionarItem
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        adicionarItem={adicionarItem}
      />
      <View style={styles.listaContainer}>
        {lista.length === 0 ? (
          <View style={styles.imageView}>
            <Image
              source={require("../assets/ListaDeCompras.png")}
              style={[
                styles.emptyImage,
                {
                  width: tamanhoDaImagem,
                  height: tamanhoDaImagem,
                },
              ]}
            />
          </View>
        ) : (
          <FlatList
            data={lista}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.botaoNovoItem}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5
          name="plus"
          size={responsiveFontSize(4)}
          color="#ffffff"
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDE998",
  },
  listaContainer: {
    backgroundColor: "#FDE998",
    flex: 1,
    paddingTop: responsiveHeight(2),
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(1),
    height: responsiveHeight(6),
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
    borderWidth: 1,
    borderColor: "#A94B5C",
    borderRadius: responsiveWidth(2),
    backgroundColor: "white",
    marginHorizontal: responsiveWidth(5),
  },
  textoItem: {
    fontSize: responsiveFontSize(2),
    marginLeft: responsiveWidth(1.5)
  },
  remover: {
    marginLeft: responsiveWidth(2),
  },

  botaoNovoItem: {
    backgroundColor: "#A94B5C",
    alignItems: "center",
    justifyContent: "center",
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    borderRadius: responsiveWidth(7.5),
    position: "absolute",
    bottom: responsiveHeight(5),
    right: responsiveWidth(11),
  },
  botaoLimparLista: {
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(3),
    width: responsiveWidth(33),
    paddingVertical: responsiveHeight(1),
    borderWidth: 1,
    borderColor: "white",
    marginRight: responsiveWidth(3),
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: responsiveFontSize(2),
    textAlign: "center",
  },
  imageView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ListaCompras;
