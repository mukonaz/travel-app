import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import axios from "axios";

const ProfileScreen = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://192.168.1.132:5000/getFavorites", {
        headers: {
          Authorization: `Bearer ${your_jwt_token}`, // Use the actual JWT token
        },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.activityId}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Image
                style={styles.activityImage}
                source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.activityImage}&key=${GOOGLE_APIKEY}` }}
              />
              <Text style={styles.activityName}>{item.activityName}</Text>
              <Text style={styles.activityAddress}>{item.activityAddress}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFavoritesMessage}>You don't have any favorites yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#444",
  },
  favoriteItem: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  activityImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  activityName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  activityAddress: {
    fontSize: 14,
    color: "#777",
  },
  noFavoritesMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
});

export default ProfileScreen;
