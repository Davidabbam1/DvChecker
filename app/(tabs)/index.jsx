import { FontAwesome, FontAwesome6, Foundation, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "../../constants/Colors";
import { auth, db } from "../../firebase-config";
import { getOfficerData } from "../../helpers";

export default function HomeScreen() {
  const [profilePic, setProfilePic] = useState(require("../../assets/images/user.png"));
  const [officer_data, setOfficerData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false); //

  useEffect(() => {
    let unsubscribeNetInfo;
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await getOfficerData(auth.currentUser.email);
        if (isMounted) {
          setOfficerData(data);
          if (data?.officer_photoURL) {
            setProfilePic({ uri: data.officer_photoURL });
          }
        }
      } catch (error) {
        console.log("Error loading officer data:", error.message);
      }
    };

    // Initial fetch
    loadData();

    // Listen for network changes
    unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log("Internet restored, refetching data...");
        loadData();
      } else {
        setShowNetworkModal(true);
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribeNetInfo) unsubscribeNetInfo();
    };
  }, []);

  // 🖼 Pick Image from Gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      setShowNetworkModal(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      const selectedBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfilePic({ uri: selectedBase64 });

      try {
        await updateDoc(doc(db, "Officers", auth.currentUser.uid), {
          officer_photoURL: selectedBase64,
        });
      } catch (error) {
        console.log("Error saving image:", error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/(auth)");
    } catch (error) {
      console.log("Logout failed:", error.message);
    }
  };

  if (!officer_data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#273576" />
        <Text style={{ marginTop: 10, color: "#273576" }}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={{ marginHorizontal: 25, marginVertical: 25 }}>
      {/* TOP BAR */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          marginBottom: Platform.OS === "ios" ? 48 : 25,
          backgroundColor: "rgba(39, 53, 118, 0.2)",
          borderRadius: 30,
          height: 100,
          width: "100%",
        }}
      >
        <Pressable onPress={pickImage}>
          <View
            style={{
              height: 55,
              width: 55,
              marginLeft: 15,
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source={profilePic}
              style={{
                height: 70,
                width: 70,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: "#273576",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#273576",
                borderRadius: 20,
                padding: 3,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            >
              <MaterialIcons name="edit" size={12} color="#fff" />
            </View>
          </View>
        </Pressable>

        <View style={{ flex: 1, marginRight: 18 }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: Platform.OS == "ios" ? 30 : 25,
              fontWeight: "bold",
              color: Colors.light.text,
            }}
          >
            {officer_data?.officer_rank} {officer_data?.officer_firstname}{" "}
            {officer_data?.officer_lastname}
          </Text>
        </View>
      </View>

      {/* PROFILE HEADER */}
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
        <Text style={{ color: Colors.light.text, fontSize: 22, fontWeight: "bold" }}>
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
          {/* officer info rows */}
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <FontAwesome name="user" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>
              {officer_data?.officer_rank} {officer_data?.officer_firstname}{" "}
              {officer_data?.officer_lastname}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <FontAwesome6 name="location-dot" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>{officer_data?.officer_station}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <MaterialIcons name="grade" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>{officer_data?.officer_rank}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Foundation name="calendar" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>{officer_data?.officer_dob}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Foundation name="mail" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>{officer_data?.officer_email}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.iconBox}>
              <FontAwesome name="phone" size={30} color={Colors.light.text} />
            </View>
            <Text style={styles.detailText}>{officer_data?.officer_phoneNumber}</Text>
          </View>
        </View>
      </View>

      {/* CUSTOM  MODAL */}
      <Modal
        transparent
        visible={showNetworkModal}
        animationType="fade"
        onRequestClose={() => setShowNetworkModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>No Internet Connection</Text>
            <Text style={styles.modalMessage}>
              You're currently offline. Check your internet connection.
            </Text>
            <Pressable
              style={[styles.button, { backgroundColor: "#273576", marginTop: 10 }]}
              onPress={() => setShowNetworkModal(false)}
            >
              <Text style={styles.buttonText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>
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
  row: { flexDirection: "row", alignItems: "center", gap: 23, width: "100%" },
  iconBox: {
    height: 55,
    width: 55,
    backgroundColor: "rgba(39,53,118,0.2)",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    flexShrink: 1,
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
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.text,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 15 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
