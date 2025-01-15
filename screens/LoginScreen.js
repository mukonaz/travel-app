import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.132:5000/login", {
        email,
        password,
      });
      const { token } = response.data;
      // Store the token securely (e.g., AsyncStorage, Redux)
      Alert.alert("Login successful!");
      navigation.navigate("Profile"); // Navigate to the home screen
    } catch (error) {
      Alert.alert("Login failed", error.response.data.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("Register")}>Don't have an account? Register</Text>
    </View>
  );
};

export default LoginScreen;
