import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const AlertModal = ({ visible, message, onClose, titulo }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{titulo}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    alignItems: "center",
    width: responsiveWidth(80),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: responsiveHeight(1),
  },
  modalMessage: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(3),
  },
  modalButton: {
    backgroundColor: "#F27507",
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(4.5)
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: responsiveFontSize(2),
    textAlign: 'center'
  },
});

export default AlertModal;