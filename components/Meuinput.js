import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

const MeuInput = ({
  inputTitulo,
  secureTextEntry = false,
  autoComplete,
  keyboardType,
  value,
  setValue,
  autoCapitalize,
  error,
}) => {
  return (
    <View>
      <Text style={styles.tituloInput}>{inputTitulo}</Text>
      <TextInput
        style={styles.input}
        value={value}
        setValue={setValue}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onChangeText={(text) => setValue(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: responsiveHeight(1),
  },
  input: {
    height: responsiveHeight(6),
    marginBottom: responsiveHeight(2),
    marginTop: responsiveHeight(1),
    borderWidth: 1,
    borderColor: "#A94B5C",
    paddingLeft: responsiveWidth(5),
    backgroundColor: "#ffffff",
    borderRadius: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
  },

  tituloInput: {
    fontSize: responsiveFontSize(1.7),
  },
});

export default MeuInput;