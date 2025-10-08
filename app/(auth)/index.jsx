import { Image, ImageBackground } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

const Index = () => {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedSuccess, setLoggedSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [showNoInternetModal, setShowNoInternetModal] = useState(false);

  // Listen for connection changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const policeNumberToEmail = (policeNumber) => `${policeNumber.trim()}@dv.com`;

  async function routeToProfile() {
    if (!isConnected) {
      setShowNoInternetModal(true);
      return;
    }

    try {
      setLoading(true);
      const email = policeNumberToEmail(idNumber);
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login success:", res.user.uid);
      setLoggedSuccess(true);

      // Simulate loading before navigation
      setTimeout(() => {
        setLoading(false);
        router.push("/(tabs)");

        // ✅ Clear inputs *after* navigation
        setIdNumber("");
        setPassword("");
      }, 1500);
    } catch (error) {
      console.log("Login error:", error.message);
      setLoggedSuccess(false);
      setLoading(false);

      // ✅ Clear inputs *after* login failure
      setTimeout(() => {
        setIdNumber("");
        setPassword("");
      }, 500);
    }
  }

  function routeToRegister() {
    // Navigate first
    router.push("/signup");

    // ✅ Then clear fields *after* navigation delay
    setTimeout(() => {
      setIdNumber("");
      setPassword("");
    }, 500);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* No Internet Modal */}
      <Modal
        transparent
        visible={showNoInternetModal}
        animationType="fade"
        onRequestClose={() => setShowNoInternetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="wifi-off" size={50} color="#273576" />
            <Text style={styles.modalTitle}>No Internet Connection</Text>
            <Text style={styles.modalText}>
              You appear to be offline. Please check your connection and try again.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowNoInternetModal(false)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={{ height: hp(40), borderRadius: 30 }}>
        <ImageBackground
          imageStyle={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
          style={{ width: "100%", height: "100%", alignItems: "center" }}
          source={require("../../assets/images/building.jpg")}
        >
          <View
            style={{
              borderRadius: 50,
              borderWidth: 3,
              borderColor: "#273576",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              width: "100%",
              height: "100%",
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 25, color: "#273576", fontWeight: "bold" }}>
              Welcome
            </Text>
            <Image
              style={{ height: 139, width: 139 }}
              source={require("../../assets/images/policelogo.png")}
            />
            <Text
              style={{
                marginBottom: 19,
                fontSize: 18,
                color: "#273576",
                fontWeight: "600",
              }}
            >
              Official Mobile App for Ghana Police Service
            </Text>
            <Text style={{ fontSize: 18, color: "#273576", fontWeight: "600" }}>
              Driver and Vehicle Checker
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Login Form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 200 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ paddingTop: 70, width: "80%", alignSelf: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 28,
                  fontSize: 30,
                  color: "#273576",
                }}
              >
                Login to your account
              </Text>

              {!loggedSuccess && isConnected && (
                <Text style={{ color: "red", marginLeft: 15, marginBottom: 10 }}>
                  Wrong credentials, try again
                </Text>
              )}

              <TextInput
                placeholder="ID No."
                placeholderTextColor={"#273576"}
                style={styles.input}
                value={idNumber}
                onChangeText={(value) => setIdNumber(value)}
                autoCapitalize="none"
                keyboardType="default"
                returnKeyType="next"
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  secureTextEntry={!showPassword}
                  placeholder="Password"
                  placeholderTextColor={"#273576"}
                  style={[styles.pwdInput, { flex: 1, marginBottom: 0 }]}
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  autoCapitalize="none"
                  returnKeyType="done"
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={26}
                    color="#273576"
                  />
                </Pressable>
              </View>

              <Pressable
                onPress={routeToProfile}
                style={[styles.button, loading && { opacity: 0.7 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: "white", fontSize: 18 }}>Sign In</Text>
                )}
              </Pressable>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "#273576",
                  fontWeight: "500",
                }}
              >
                Not having an account?
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                  fontSize: 15,
                  color: "#273576",
                  fontWeight: "500",
                }}
              >
                Press the button below to register
              </Text>

              <Pressable onPress={routeToRegister} style={styles.button}>
                <Text style={{ color: "white", fontSize: 18 }}>Register</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  input: {
    marginBottom: 22,
    color: "#273576",
    paddingHorizontal: 36,
    fontSize: 22,
    height: 61,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 30,
  },
  pwdInput: {
    color: "#273576",
    paddingLeft: 36,
    fontSize: 22,
    height: 61,
    backgroundColor: "transparent",
    borderRadius: 30,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 30,
    paddingRight: 15,
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    marginBottom: 20,
    width: "100%",
    height: 61,
    backgroundColor: "#273576",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#273576",
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#273576",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#273576",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
