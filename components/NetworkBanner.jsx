import React, { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Animated, Text, View, StyleSheet } from "react-native";

export default function NetworkBanner() {
  const [isConnected, setIsConnected] = useState(true);
  const [translateY] = useState(new Animated.Value(-50));

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: isConnected ? -50 : 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [isConnected]);

  if (isConnected) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top:0,
    left: 0,
    right: 0,
    backgroundColor: "#D32F2F",
    height: 89,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
