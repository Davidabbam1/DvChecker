import { router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  LogBox,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebase-config";

LogBox.ignoreLogs([
  'A props object containing a "key" prop is being spread into JSX',
]);

export default function SignUp() {
  const [isChecked, setIsChecked] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dob, setDob] = useState("");
  const [lastName, setLastName] = useState("");
  const [stationName, setStationName] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [rank, setRank] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const rankOptions = [
    { key: 1, label: "Cst." },
    { key: 2, label: "Cpl." },
    { key: 3, label: "Sgt." },
    { key: 4, label: "Insp." },
    { key: 5, label: "C/Insp." },
    { key: 6, label: "Supt." },
    { key: 7, label: "C/Supt." },
    { key: 8, label: "A/Comm." },
    { key: 9, label: "D/Comm." },
    { key: 10, label: "Comm." },
  ];

  const policeNumberToEmail = (policeNumber) => `${policeNumber.trim()}@dv.com`;

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const registerOfficer = async () => {
    if (!isChecked) {
      showCustomAlert("Confirmation Required", "Please confirm your details before registering.");
      return;
    }

    try {
      setLoading(true);
      const modifiedEmail = policeNumberToEmail(id);
      const res = await createUserWithEmailAndPassword(auth, modifiedEmail, password);
      const defaultPhotoURL = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      await updateProfile(res.user, {
        displayName: `${firstName} ${lastName}`,
        photoURL: defaultPhotoURL,
      });

      await setDoc(doc(db, "Officers", res.user.uid), {
        officer_Id: id,
        officer_dob: dob,
        officer_email: modifiedEmail,
        officer_firstname: firstName,
        officer_lastname: lastName,
        officer_phoneNumber: telephoneNumber,
        officer_rank: rank,
        officer_station: stationName,
        officer_photoURL: defaultPhotoURL,
      });

      console.log("Officer added successfully!");
      setTimeout(() => {
        setLoading(false);
        router.replace("/");
      }, 2000);
    } catch (error) {
      console.log("Firestore write error:", error.message);
      setLoading(false);

      if (error.message.includes("network-request-failed")) {
        showCustomAlert("No Internet Connection", "Cannot register. Please check your network and try again.");
      } else if (error.message.includes("email-already-in-use")) {
        showCustomAlert("Account Exists", "An account with this Police ID already exists.");
      } else if (error.message.includes("invalid-email")) {
        showCustomAlert("Invalid Police ID", "Invalid Police ID format. Please check and try again.");
      } else if (error.message.includes("weak-password")) {
        showCustomAlert("Weak Password", "Password is too weak. Use a stronger one.");
      } else {
        showCustomAlert("Registration Failed", "Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginTop: 40, marginBottom: 30 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#273576",
                marginTop: 25,
              }}
            >
              Create Account
            </Text>
          </View>

          {/* First Name */}
          <TextInput
            placeholder="First name"
            placeholderTextColor={"#273576"}
            style={styles.input}
            onChangeText={setFirstName}
          />

          {/* DOB */}
          <View style={[styles.input, styles.dateInputContainer]}>
            <TextInput
              placeholder="DOB eg. yyyy-mm-dd"
              value={dob}
              placeholderTextColor={"#273576"}
              style={styles.dateInput}
              editable={false}
            />
            <Pressable onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={26} color="#273576" />
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  if (event.type === "dismissed") {
                    setShowDatePicker(false);
                    setDob("");
                    return;
                  }
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                    const day = String(selectedDate.getDate()).padStart(2, "0");
                    setDob(`${year}-${month}-${day}`);
                  }
                }}
              />
            )}
          </View>

          {/* Last Name */}
          <TextInput
            placeholder="Last name"
            placeholderTextColor={"#273576"}
            style={styles.input}
            onChangeText={setLastName}
          />

          {/* Police ID */}
          <TextInput
            placeholder="Police ID No."
            placeholderTextColor={"#273576"}
            style={styles.input}
            onChangeText={setId}
          />

          {/* Rank */}
          <View style={{ marginBottom: 15 }}>
            <ModalSelector
              key="rank-selector"
              data={rankOptions}
              initValue="Select Rank"
              onChange={(option) => setRank(option.label)}
              animationType="fade"
              supportedOrientations={["portrait"]}
              backdropPressToClose
              optionContainerStyle={{
                backgroundColor: "#fff",
                borderRadius: 15,
                paddingVertical: 10,
                maxHeight: 350,
                elevation: 10,
              }}
              optionTextStyle={{
                color: "#273576",
                fontSize: 20,
                paddingVertical: 10,
                textAlign: "left",
              }}
              overlayStyle={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.4)",
                justifyContent: "center",
                paddingHorizontal: 30,
              }}
              cancelText=""
              cancelContainerStyle={{ display: "none" }}
            >
              <View style={styles.dropdownContainer}>
                <Text style={{ color: "#273576", fontSize: 22 }}>
                  {rank || "Select Rank"}
                </Text>
                <Text style={{ color: "#273576", fontSize: 18 }}>▼</Text>
              </View>
            </ModalSelector>
          </View>

          {/* Station */}
          <TextInput
            placeholder="Station name"
            placeholderTextColor={"#273576"}
            style={styles.input}
            onChangeText={setStationName}
          />

          {/* Telephone */}
          <TextInput
            placeholder="Telephone No."
            placeholderTextColor={"#273576"}
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={setTelephoneNumber}
          />

          {/* Password */}
          <View style={[styles.input, styles.dateInputContainer]}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              placeholderTextColor={"#273576"}
              style={styles.dateInput}
              onChangeText={setPassword}
            />
            <Pressable style={{ padding: 8 }} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={26}
                color="#273576"
              />
            </Pressable>
          </View>

          {/* Switch */}
          <View
            style={{
              marginBottom: 22,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Switch
              trackColor={{ false: "#767577", true: "#273576" }}
              value={isChecked}
              onValueChange={setIsChecked}
            />
            <Text style={{ fontSize: 17 }}>I have provided the correct details</Text>
          </View>

          {/* Register Button */}
          <Pressable
            onPress={registerOfficer}
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "white", fontSize: 18 }}>Register</Text>
            )}
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Alert Modal */}
      <Modal
        transparent
        visible={showAlertModal}
        animationType="fade"
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Ionicons name="alert-circle-outline" size={50} color="#273576" />
            <Text style={styles.modalTitle}>{alertTitle}</Text>
            <Text style={styles.modalText}>{alertMessage}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowAlertModal(false)}
            >
              <Text style={{ color: "white", fontSize: 16 }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = {
  input: {
    marginBottom: 15,
    color: "#273576",
    paddingHorizontal: 36,
    fontSize: 22,
    height: 61,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 30,
    justifyContent: "center",
  },
  dropdownContainer: {
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 30,
    paddingHorizontal: 36,
    height: 61,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  dateInput: {
    flex: 1,
    color: "#273576",
    fontSize: 22,
  },
  button: {
    marginBottom: 50,
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
};
