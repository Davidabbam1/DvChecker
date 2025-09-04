import { Image } from "expo-image"
import { router } from "expo-router"
import { useState } from "react"
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import { getCarCheckResults } from "../../helpers"

const Carcheck = () => {
  const [carNumber, setCarNumber] = useState("")

  const onSearch = async () => {
    try {
      const data = await getCarCheckResults(carNumber.trim());
      console.log("Fetched data:", data);

      if (!data.details && !data.roadWorth && !data.insurance) {
        Alert.alert("Not found", "No records for this car number");
      }
      router.push({
        pathname: "/carcheckresults",
        params: { data: JSON.stringify(data) }
      });

    } catch (err) {
      console.log("Caught error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={{width: "90%", marginHorizontal: "auto", marginTop: 45}}>
          <TextInput
            onChangeText={(value)=>{setCarNumber(value)}}
            placeholder='Enter plate number'
            placeholderTextColor={'#273576'}
            style={styles.input}
          />
          <Text style={{ width: "90%", marginHorizontal: "auto", color: '#273576', marginBottom: 41 }}>
            eg. GX 2803 - 21
          </Text>
          <Text style={{ width: "90%", marginHorizontal: "auto", color: '#273576', marginBottom: 41, fontSize: 18 }}>
            NB. Enter private, commercial and motor
          </Text>

          <Pressable onPress={onSearch} style={styles.button}>
            <Text style={{color: "white", fontSize: 18}}>CHECK</Text>
          </Pressable>
        </View>

        <View>
          <Image source={require("../../assets/images/carcheck.jpg")} style={{height: 395, width: "100%"}}/>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Carcheck

const styles = StyleSheet.create({
  input: {
    color: '#273576',
    marginBottom: 18,
    paddingHorizontal: 36,
    fontSize: 22,
    height: 61,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 30
  },
  button: {
    marginBottom: 50,
    width: "100%",
    height: 61,
    backgroundColor: '#273576',
    borderRadius: 30,
    marginHorizontal: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
})
