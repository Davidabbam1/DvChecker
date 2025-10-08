import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { getCarCheckResults } from "../../helpers";

const Carcheck = () => {
  const [carNumber, setCarNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const onSearch = async () => {
    if (!carNumber.trim()) {
      showModal("Please enter a car number.");
      return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      showModal("No Internet Connection.\nPlease turn on your data or Wi-Fi.");
      return;
    }

    try {
      setLoading(true);
      const data = await getCarCheckResults(carNumber.trim());
      console.log("Fetched data:", data);

      if (!data.details && !data.roadWorth && !data.insurance) {
        showModal("No records found for this car number.");
        return;
      }

      router.push({
        pathname: "/carcheckresults",
        params: { data: JSON.stringify(data) },
      });
    } catch (err) {
      console.log("Caught error:", err);
      showModal("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={{ width: "90%", marginHorizontal: "auto", marginTop: 45 }}>
          <TextInput
            value={carNumber}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            keyboardType="default"
            onChangeText={(value) => {
              let cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
              let formatted = "";

              if (cleaned.length <= 2) {
                formatted = cleaned;
              } else if (cleaned.length <= 6) {
                formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
              } else {
                formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(
                  2,
                  cleaned.length - 2
                )}-${cleaned.slice(-2)}`;
              }

              setCarNumber(formatted);
            }}
            placeholder="Enter plate number"
            placeholderTextColor="#273576"
            style={styles.input}
            maxLength={12}
          />

          <Text style={styles.hint}>eg. GX-2803-21</Text>
          <Text style={styles.note}>NB. Enter private, commercial and motor</Text>

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
            source={require("../../assets/images/carcheck.jpg")}
            style={{ height: 395, width: "100%" }}
          />
        </View>

        {/* Modal for alerts */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <Pressable style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: "white", fontSize: 16 }}>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Carcheck;

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
  hint: {
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
