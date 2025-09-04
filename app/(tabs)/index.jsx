import { FontAwesome, FontAwesome6, Foundation, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { auth } from "../../firebase-config";
import { getOfficerData } from "../../helpers";

export default function HomeScreen() {
  const [profilePic, setProfilePic] = useState(
    require("../../assets/images/dp.jpg")
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [officer_data, setOfficerData] = useState(null);

  // 👇 New: logout modal visibility
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const onSearch = async () => {
      const data = await getOfficerData(auth.currentUser.email);
      setOfficerData(data);
    };
    onSearch();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)");
    } catch (error) {
      Alert.alert("Logout failed", error.message);
    }
  };

  return (
    <View style={{ marginHorizontal: 25, marginVertical: 25 }}>
      {/* TOP BAR WITH AVATAR + NAME */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          marginBottom: 48,
          backgroundColor: "rgba(39, 53, 118, 0.2)",
          borderRadius: 30,
          height: 100,
          width: "100%",
        }}
      >
        <Image
          source={profilePic}
          style={{
            height: 73,
            width: 73,
            borderRadius: 70,
            borderColor: "#273576",
            marginLeft: 15,
            borderWidth: 3,
          }}
        />

        <View style={{ flex: 1, marginRight: 10 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: Colors.light.text,
            }}
          >
            {officer_data?.officer_rank}. {officer_data?.officer_firstname}{" "}
            {officer_data?.officer_lastname}
          </Text>
        </View>
      </View>

      {/* PROFILE HEADER WITH POWER BUTTON */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 17,
          width: "85%",
          marginHorizontal: "auto",
        }}
      >
        <Text
          style={{ color: Colors.light.text, fontSize: 22, fontWeight: "bold" }}
        >
          Profile
        </Text>

        <FontAwesome
          name="power-off"
          size={25}
          color={Colors.light.text}
          onPress={() => setShowLogoutModal(true)}
        />
      </View>

      {/* DETAILS BOX */}
      <View
        style={{
          height: "67%",
          width: "100%",
          backgroundColor: "rgba(39, 53, 118, 0.2)",
          gap: 19,
          borderRadius: 30,
        }}
      >
        <View
          style={{
            width: "80%",
            height: "100%",
            marginHorizontal: "auto",
            display: "flex",
            gap: 17,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {/* Officer Name */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <FontAwesome name="user" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_rank} {officer_data?.officer_firstname}{" "}
              {officer_data?.officer_lastname}
            </Text>
          </View>

          {/* Station */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <FontAwesome6
                name="location-dot"
                size={30}
                color={Colors.light.text}
              />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_station}
            </Text>
          </View>

          {/* Rank */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <MaterialIcons
                name="grade"
                size={30}
                color={Colors.light.text}
              />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_rank}
            </Text>
          </View>

          {/* DOB */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Foundation
                name="calendar"
                size={30}
                color={Colors.light.text}
              />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_dob}
            </Text>
          </View>

          {/* Email */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Foundation name="mail" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_email}
            </Text>
          </View>

          {/* Phone */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <FontAwesome name="phone" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_phoneNumber}
            </Text>
          </View>
        </View>
      </View>

      {/* LOGOUT MODAL */}
      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, { backgroundColor: Colors.light.background }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.buttonText, { color: Colors.light.text }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: "#E53935" }]}
                onPress={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 23,
    width: "100%",
  },
  iconBox: {
    height: 55,
    width: 55,
    backgroundColor: "rgba(39,53,118,0.2)",
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    flexShrink: 1, // makes text wrap/truncate properly
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.light.text,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.text,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
