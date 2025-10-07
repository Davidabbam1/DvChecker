import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text } from "react-native";
import AuthGate from "../components/AuthGate";

export default function RootLayout() {
  return (
    <AuthGate>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="carcheckresults" options={{ title: "Car Check Results",headerTitleAlign:"center",headerTitleStyle:{color:"#273576", } ,headerShown: true, headerLeft:()=>(<Pressable onPress={()=>{router.back()}} style={{flexDirection:"row", alignItems:"center", gap:5}} ><AntDesign name="arrowleft" size={32} color="#273576" /><Text style={{color:"#273576", fontSize:16, marginRight:20}}>Back</Text></Pressable>) }} />
        <Stack.Screen name="licensecheckresults" options={{ title: "License Check Results",headerTitleAlign:"center",headerTitleStyle:{color:"#273576", }, headerShown: true,  headerLeft:()=>(<Pressable onPress={()=>{router.back()}} style={{flexDirection:"row", alignItems:"center", gap:5}} ><AntDesign name="arrowleft" size={32} color="#273576" /><Text style={{color:"#273576", fontSize:16, marginRight:20 }}>Back</Text></Pressable>) }} />
        <Stack.Screen name="+not-found" />
      </Stack>

    </AuthGate>
  );
}
