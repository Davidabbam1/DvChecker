import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getLicenseDetails } from "../../helpers";

const LicenseCheck = () => {
  const [licenseNumber, setLicenseNumber] = useState("");

  const handleLicenseChange = (text) => {
    // Remove non-alphanumeric characters and convert to uppercase
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

  const onSearch = async () => {
    console.log("Pressed, searching for:", licenseNumber);

    try {
      const licenseData = await getLicenseDetails(licenseNumber.trim());
      console.log("License record:", licenseData);

      if (!licenseData) {
        Alert.alert("Not found", "No records for this license number");
        return;
      }

      router.push({
        pathname: "/licensecheckresults",
        params: { data: JSON.stringify(licenseData) },
      });
    } catch (error) {
      console.log("Caught error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
  };

  return (
    <View>
      <View style={{ width: "90%", marginHorizontal: "auto", marginTop: 45 }}>
        <TextInput
          onChangeText={handleLicenseChange}
          value={licenseNumber}
          placeholder="Enter license number"
          placeholderTextColor={"#273576"}
          style={{
            color: "#273576",
            marginBottom: 18,
            paddingHorizontal: 36,
            fontSize: 22,
            height: 61,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.15)",
            borderRadius: 30,
          }}
          keyboardType="default"
          autoCapitalize="characters"
        />

        <Text style={{ width: "90%", marginHorizontal: "auto", color: "#273576", marginBottom: 41 }}>
          eg. DAV-15111994-86606
        </Text>
        <Text
          style={{
            width: "90%",
            marginHorizontal: "auto",
            color: "#273576",
            marginBottom: 41,
            fontSize: 18,
          }}
        >
          NB. Enter all characters with no space
        </Text>

        <Pressable
          onPress={onSearch}
          style={{
            marginBottom: 50,
            width: "100%",
            height: 61,
            backgroundColor: "#273576",
            borderRadius: 30,
            marginHorizontal: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>CHECK</Text>
        </Pressable>
      </View>

      <View>
        <Image
          source={require("../../assets/images/dl.jpg")}
          style={{ height: 395, width: "100%" }}
        />
      </View>
    </View>
  );
};

export default LicenseCheck;

const styles = StyleSheet.create({});
