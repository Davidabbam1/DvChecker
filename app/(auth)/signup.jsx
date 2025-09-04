import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";
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
  View
} from "react-native";
import { auth, db } from '../../firebase-config';
 

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


  const scrollRef = useRef(null);
  const fieldY = useRef({});

  const scrollTo = (y) => {
    if (typeof y === "number" && scrollRef.current) {
      scrollRef.current.scrollTo({ y: Math.max(y - 20, 0), animated: true });
    }
  };

  function routeToLogin(){
    router.push("/")
  }


  const policeNumberToEmail = (policeNumber) =>`${policeNumber.trim()}@dv.com`

const registerOfficer = async () => {
  try {
    const modifiedEmail = policeNumberToEmail(id);
    const res = await createUserWithEmailAndPassword(auth, modifiedEmail, password);

    await setDoc(doc(db, "Officers", res.user.uid), {
      officer_Id: id,
      officer_dob: dob,
      officer_email: modifiedEmail,
      officer_firstname: firstName,
      officer_lastname: lastName,
      officer_phoneNumber: telephoneNumber,
      officer_rank: rank,
      officer_station: stationName,
    });

    console.log("Officer added successfully!");
    router.replace("/");
    return res.user;
  } catch (error) {
    console.log("Firestore write error:", error.message);
    alert("Error: " + error.message);
  }
};






  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "height" : undefined}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, paddingHorizontal: 40, width: "100%", backgroundColor: "#fff" }}>
          
          {/* Fixed header */}
          <View style={{ alignItems: "center", marginTop: 40, marginBottom: 30 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: "#273576", marginTop:25 }}>
              Create Account
            </Text>
          </View>

          {/* Scrollable form starts here */}
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 30 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === "ios" ? "on-drag" : "interactive"}
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
          >
            <TextInput
              placeholder="First name"
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.first = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.first)}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(value)=>{setFirstName(value)}}

            />

            <TextInput
              placeholder="DOB eg. yyyy-mm-dd"
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.middle = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.middle)}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(value)=>{setDob(value)}}

            />

            <TextInput
              placeholder="Last name"
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.last = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.last)}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(value)=>{setLastName(value)}}

            />

            <TextInput
              placeholder="Police ID No."
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.policeId = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.policeId)}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(value)=>{setId(value)}}
            />
            <TextInput
              placeholder="Rank eg. inspector"
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.policeId = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.policeId)}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(value)=>{setRank(value)}}
            />

            <TextInput
              placeholder="Station name"
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.station = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.station)}
              returnKeyType="next"
              blurOnSubmit={false}
              onChangeText={(value)=>{setStationName(value)}}

            />

            <TextInput
              placeholder="Telephone No."
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              keyboardType="phone-pad"
              onLayout={(e)=> (fieldY.current.telephone = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.telephone)}
              returnKeyType="done"
              onChangeText={(value)=>{setTelephoneNumber(value)}}
              
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              placeholderTextColor={"#273576"}
              style={{ marginBottom: 15, color: "#273576", paddingHorizontal: 36, fontSize: 22, height: 61, width: "100%", backgroundColor: "rgba(0,0,0,0.15)", borderRadius: 30 }}
              onLayout={(e)=> (fieldY.current.telephone = e.nativeEvent.layout.y)}
              onFocus={()=> scrollTo(fieldY.current.telephone)}
              returnKeyType="done"
              onChangeText={(value)=>{setPassword(value)}}


            />

            <View style={{ marginBottom: 22, width: "100%", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Switch
                trackColor={{ false: "#767577", true: "#273576" }}
                value={isChecked}
                onValueChange={setIsChecked}
              />
              <Text style={{ fontSize: 17 }}>I have provided the correct details</Text>
            </View>

            <Pressable onPress={registerOfficer} style={{ marginBottom: 10, width: "100%", height: 61, backgroundColor: "#273576", borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "white", fontSize: 18 }}>Register</Text>
            </Pressable>

            {/* <Image resizeMode="contain" style={{ height: 200, width: "100%" }} source={require("../../assets/images/policemancar.png")} /> */}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}