import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const AlertConfirmModal = ({ visible, closeModal, title, message, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={closeModal}
              style={styles.modalButtonClose}
            >
              <Text style={styles.textButton}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.modalButtonConfirm}
            >
              <Text style={styles.textButton}>Confirmar</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: responsiveHeight(2),
  },
  modalMessage: {
    fontSize: responsiveFontSize(2),
    marginBottom: responsiveHeight(4),
    textAlign: "center",
  },
  modalButtonConfirm: {
    backgroundColor: "#F27507",
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(4.5),
    width: responsiveWidth(30),
  },
  modalButtonClose: {
    backgroundColor: "red",
    padding: responsiveHeight(1),
    borderRadius: responsiveWidth(1),
    paddingHorizontal: responsiveWidth(4.5),
    marginRight: responsiveWidth(6),
    width: responsiveWidth(30),
  },
  textButton: {
    color: "#FFF",
    fontSize: responsiveFontSize(2),
    textAlign: "center",
  },
});

export default AlertConfirmModal;
