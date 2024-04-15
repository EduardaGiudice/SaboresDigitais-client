import React from "react";
import {Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const BotaoSubmit = ({ handleSubmit, tituloBotao}) => {
  return (
    <TouchableOpacity style={styles.botao} onPress={handleSubmit}>
      <Text style={styles.textoBotao}>
        {tituloBotao}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    backgroundColor: "#F27507",
    marginHorizontal: responsiveHeight(5), 
    height: responsiveHeight(7), 
    borderRadius: responsiveHeight(2), 
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(2), 
    marginBottom: responsiveHeight(2), 
  },

  textoBotao: {
    textAlign: "center",
    color: "#ffffff",
    fontSize: responsiveFontSize(2.5), 
    fontWeight: "bold",
  },
});

export default BotaoSubmit;
