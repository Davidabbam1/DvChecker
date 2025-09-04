import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";

const CarCheckResults = () => {
  // Receive the params sent with router.push()
  const { data } = useLocalSearchParams();

  // Parse the stringified data
  const parsed = data ? JSON.parse(data) : null;

  // fallback if nothing came through
  const licenseResults = parsed || {
    Name: "N/A",
    Expiry: "N/A",
    Issue: "N/A",
    DOB: "N/A",
    Class: "N/A",
    Nationality: "N/A",
    RefNumber: "N/A",
    LicenseNumber: "N/A",
  };

  // helper renderer
  const renderObject = (obj) => (
    <View style={{ marginBottom: 20 }}>
      {Object.entries(obj).map(([key, value]) => (
        <View
          key={key}
          style={{
            width: "100%",
            marginBottom: 8,
            paddingVertical: 15,
            borderRadius: 15,
            paddingLeft: 20,
            backgroundColor: "#273578",
          }}
        >
          <Text style={{ color: "white", marginBottom: 2, fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>{key}</Text>:{" "}
            <Text style={{ fontWeight: "200" }}>{String(value)}</Text>
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={{ width: "100%", height: "80%" }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          marginBottom: 25,
          padding: 25,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#273576",
            marginBottom: 20,
          }}
        >
          REPUBLIC OF GHANA DRIVERS LICENSE
        </Text>

        {renderObject(licenseResults)}
      </View>

      <Pressable
        onPress={() => {
          router.back();
        }}
        style={{
          marginBottom: 50,
          width: "90%",
          height: 61,
          backgroundColor: "#273576",
          borderRadius: 30,
          marginHorizontal: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>BACK</Text>
      </Pressable>
    </View>
  );
};

export default CarCheckResults;
