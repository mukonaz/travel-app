import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import axios from "axios";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://192.168.1.132:5000/register", {
        username,
        email,
        password,
      });
      Alert.alert("Registration successful!");
      navigation.navigate("Login"); // Navigate to login after registration
    } catch (error) {
      Alert.alert("Registration failed", error.response.data.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
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
      <Button title="Register" onPress={handleRegister} />
      <Text onPress={() => navigation.navigate("Login")}>Already have an account? Login</Text>
    </View>
  );
};

export default RegisterScreen;
