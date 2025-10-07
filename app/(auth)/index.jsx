import { Image, ImageBackground } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

const Index = () => {
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loggedSuccess, setLoggedSuccess] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef(null);
  const fieldY = useRef({});

  // Convert Police ID → email (same as signup)
  const policeNumberToEmail = (policeNumber) => `${policeNumber.trim()}@dv.com`;

  async function routeToProfile() {
    try {
      setLoading(true);
      const email = policeNumberToEmail(idNumber);
      const res = await signInWithEmailAndPassword(auth, email, password);

      console.log("Login success:", res.user.uid);
      setLoggedSuccess(true);


      setTimeout(() => {
        setLoading(false);
        router.push("/(tabs)");
      }, 4000);

    } catch (error) {
      console.log("Login error:", error.message);
      setLoggedSuccess(false);
      setLoading(false);
    }
  }

  function routeToRegister() {
    router.push('/signup');
  }

const scrollTo = (y) => {
  if (typeof y === 'number') {
    const extraOffset = 50;
    scrollRef.current?.scrollTo({ y: Math.max(y - extraOffset, 0), animated: true });
  }
};


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Fixed image header */}
      <View style={{ height: hp(40), borderRadius: 30 }}>
        <ImageBackground
          imageStyle={{ borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}
          style={{ width: '100%', height: '100%', alignItems: 'center' }}
          source={require('../../assets/images/building.jpg')}
        >
          <View
            style={{
              borderRadius: 50,
              borderWidth: 3,
              borderColor: '#273576',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              width: '100%',
              height: '100%',
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 25, color: '#273576', fontWeight: 'bold' }}>
              Welcome
            </Text>
            <Image
              style={{ height: 139, width: 139 }}
              source={require('../../assets/images/policelogo.png')}
            />
            <Text
              style={{
                marginBottom: 19,
                fontSize: 18,
                color: '#273576',
                fontWeight: '600',
              }}
            >
              Official Mobile App for Ghana Police Service
            </Text>
            <Text style={{ fontSize: 18, color: '#273576', fontWeight: '600' }}>
              Driver and Vehicle Checker
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Keyboard-aware form scrolls only */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'height' : undefined}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: Platform.OS == "ios" ? 24 : 220 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'interactive'}
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
          >
            <View style={{ paddingTop: 70, width: '80%', alignSelf: 'center' }}>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 28,
                  fontSize: 30,
                  color: '#273576',
                }}
              >
                Login to your account
              </Text>

              {/* Error message */}
              {!loggedSuccess && (
                <Text style={{ color: "red", marginLeft: 15, marginBottom: 10 }}>
                  Wrong credentials, try again
                </Text>
              )}

              <TextInput
                placeholder="ID No."
                placeholderTextColor={'#273576'}
                style={styles.input}
                onLayout={(e) => (fieldY.current.id = e.nativeEvent.layout.y)}
                onFocus={() => scrollTo(fieldY.current.id)}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => scrollTo(fieldY.current.pass)}
                onChangeText={(value) => setIdNumber(value)}
              />

              <TextInput
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={'#273576'}
                style={styles.input}
                onLayout={(e) => (fieldY.current.pass = e.nativeEvent.layout.y)}
                onFocus={() => scrollTo(fieldY.current.pass)}
                returnKeyType="done"
                onChangeText={(value) => setPassword(value)}
              />

              {/* Sign In button with spinner */}
              <Pressable
                onPress={routeToProfile}
                style={[styles.button, loading && { opacity: 0.7 }]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: 'white', fontSize: 18 }}>Sign In</Text>
                )}
              </Pressable>

              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: '#273576',
                  fontWeight: '500',
                }}
              >
                Not having an account?
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  marginBottom: 20,
                  fontSize: 15,
                  color: '#273576',
                  fontWeight: '500',
                }}
              >
                Press the button below to register
              </Text>

              <Pressable
                onPress={routeToRegister}
                style={styles.button}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>Register</Text>
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
    color: '#273576',
    paddingHorizontal: 36,
    fontSize: 22,
    height: 61,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 30,
  },
  button: {
    marginBottom: 20,
    width: '100%',
    height: 61,
    backgroundColor: '#273576',
    borderRadius: 30,
    marginHorizontal: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
