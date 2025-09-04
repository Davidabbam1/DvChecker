import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";

const CarCheckResults = () => {
  const { data } = useLocalSearchParams();
  const parsed = data ? JSON.parse(data) : null;

  const { details, roadWorth, insurance } = parsed || {};

  const renderObject = (obj) =>
    obj ? (
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
            <Text style={{ color: "white", fontSize: 16 }}>
              <Text style={{ fontWeight: "600" }}>{key}</Text>:{" "}
              <Text style={{ fontWeight: "200" }}>{String(value)}</Text>
            </Text>
          </View>
        ))}
      </View>
    ) : (
      <Text style={{ color: "gray", marginBottom: 20 }}>No data available</Text>
    );

  return (
    <View style={{ width: "100%", height: "100%" }}>
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#273576",
              marginBottom: 12,
            }}
          >
            CAR DETAILS
          </Text>
          {renderObject(details)}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#273576",
              marginBottom: 12,
            }}
          >
            ROAD WORTH DVLA
          </Text>
          {renderObject(roadWorth)}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#273576",
              marginBottom: 12,
            }}
          >
            INSURANCE
          </Text>
          {renderObject(insurance)}
        </ScrollView>
      </View>
    </View>
  );
};

export default CarCheckResults;
