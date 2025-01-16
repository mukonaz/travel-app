import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState(""); // Placeholder username; replace with dynamic data if needed.
const [userId, setUserId] = useState("");

useEffect(() => {
  // You should get this from your authentication state/storage
  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error("Error retrieving userId:", error);
    }
  };
  
  getUserId();
}, []);

useEffect(() => {
  if (userId) {
    fetchUsername();
    fetchFavorites();
  }
}, [userId]);

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`http://192.168.1.139:5000/user/${userId}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
      Alert.alert("Error", "Failed to fetch username.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://192.168.1.139:5000/getFavorites?userId=${userId}`);
      if (response.data.length === 0) {
        setFavorites([]);
      } else {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      Alert.alert("Error", "Failed to fetch favorites.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Icon name="person-circle-outline" size={100} color="#007BFF" />
        <Text style={styles.username}>{username || "Loading..."}</Text>
      </View>
      <Text style={styles.title}>Your Favorites</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.activityId}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Image
                style={styles.activityImage}
                source={{
                  uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.activityImage}&key=YOUR_GOOGLE_API_KEY`,
                }}
              />
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{item.activityName}</Text>
                <Text style={styles.activityAddress}>{item.activityAddress}</Text>
              </View>
              <TouchableOpacity>
                <Icon name="heart" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFavoritesMessage}>
          You don't have any favorites yet.
        </Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Map Search")}
      >
        <Text style={styles.buttonText}>Go to Map Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#444",
    textAlign: "center",
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  activityAddress: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  noFavoritesMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ProfileScreen;
