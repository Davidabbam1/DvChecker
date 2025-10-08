import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Modal,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { getLicenseDetails } from "../../helpers";

const LicenseCheck = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLicenseChange = (text) => {
    // Format license number (e.g. DAV-15111994-86606)
    let cleaned = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const part1 = cleaned.slice(0, 3);
    const part2 = cleaned.slice(3, 11);
    const part3 = cleaned.slice(11, 16);

    let formatted = "";
    if (part1) formatted += part1;
    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;

    setLicenseNumber(formatted);
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const onSearch = async () => {
    if (!licenseNumber.trim()) {
      showModal("Please enter a license number.");
      return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      showModal("No Internet Connection.\nPlease turn on your data or Wi-Fi.");
      return;
    }

    try {
      setLoading(true);
      const licenseData = await getLicenseDetails(licenseNumber.trim());
      console.log("License record:", licenseData);

      if (!licenseData) {
        showModal("No records found for this license number.");
        return;
      }

      router.push({
        pathname: "/licensecheckresults",
        params: { data: JSON.stringify(licenseData) },
      });
    } catch (error) {
      console.log("Caught error:", error);
      showModal("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "90%", marginHorizontal: "auto", marginTop: 45 }}>
        <TextInput
          onChangeText={handleLicenseChange}
          value={licenseNumber}
          placeholder="Enter license number"
          placeholderTextColor={"#273576"}
          style={styles.input}
          keyboardType="default"
          autoCapitalize="characters"
        />

        <Text style={styles.example}>eg. DAV-15111994-86606</Text>
        <Text style={styles.note}>NB. Enter all characters with no space</Text>

        <Pressable
          onPress={onSearch}
          style={[styles.button, loading && { opacity: 0.7 }]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "white", fontSize: 18 }}>CHECK</Text>
          )}
        </Pressable>
      </View>

      <View>
        <Image
          source={require("../../assets/images/dl.jpg")}
          style={{ height: 395, width: "100%" }}
        />
      </View>

      {/* Reusable Styled Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LicenseCheck;

const styles = StyleSheet.create({
  input: {
    color: "#273576",
    marginBottom: 18,
    paddingHorizontal: 36,
    fontSize: 22,
    height: 61,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 30,
  },
  example: {
    width: "90%",
    marginHorizontal: "auto",
    color: "#273576",
    marginBottom: 15,
  },
  note: {
    width: "90%",
    marginHorizontal: "auto",
    color: "#273576",
    marginBottom: 41,
    fontSize: 18,
  },
  button: {
    marginBottom: 50,
    width: "100%",
    height: 61,
    backgroundColor: "#273576",
    borderRadius: 30,
    marginHorizontal: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: "center",
    width: "100%",
    elevation: 10,
  },
  modalText: {
    color: "#273576",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 25,
  },
  modalButton: {
    backgroundColor: "#273576",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
});
