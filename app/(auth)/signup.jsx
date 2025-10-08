import { router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../../firebase-config";

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

  const rankOptions = [
    { id: 1, label: "Cst." },
    { id: 2, label: "Cpl." },
    { id: 3, label: "Sgt." },
    { id: 4, label: "Insp." },
    { id: 5, label: "C/Insp." },
    { id: 6, label: "Supt." },
    { id: 7, label: "C/Supt." },
    { id: 8, label: "A/Comm." },
    { id: 9, label: "D/Comm." },
    { id: 10, label: "Comm." },
  ];

  const policeNumberToEmail = (policeNumber) => `${policeNumber.trim()}@dv.com`;

  const registerOfficer = async () => {
    if (!isChecked) {
      alert("Please confirm your details before registering.");
      return;
    }

    try {
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
      router.replace("/");
    } catch (error) {
      console.log("Firestore write error:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
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

            {/* DOB with Calendar */}
            <View style={[styles.input, styles.dateInputContainer]}>
              <TextInput
                placeholder="DOB eg. yyyy-mm-dd"
                value={dob}
                placeholderTextColor={"#273576"}
                style={[styles.dateInput]}
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
                      // User pressed cancel, just close picker and do nothing
                      setShowDatePicker(false);
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

            {/* Rank Selector */}
            <View style={{ marginBottom: 15 }}>
              <ModalSelector
                data={rankOptions}
                keyExtractor={(item) => item.id.toString()}
                labelExtractor={(item) => item.label}
                initValue="Select Rank"
                onChange={(option) => setRank(option.label)}
                animationType="fade"
                supportedOrientations={["portrait"]}
                backdropPressToClose={true}
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
                scrollViewAccessibilityLabel="Rank options"
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
            <TextInput
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={"#273576"}
              style={styles.input}
              onChangeText={setPassword}
            />

            {/* Confirmation Switch */}
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
              style={{
                marginBottom: 50,
                width: "100%",
                height: 61,
                backgroundColor: "#273576",
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>Register</Text>
            </Pressable>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
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
};
