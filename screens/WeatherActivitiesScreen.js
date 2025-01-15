import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { OPENWEATHER_APIKEY, GOOGLE_APIKEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Make sure to install this

const WeatherActivitiesScreen = ({ route }) => {
  const { latitude, longitude, cityName } = route.params;
  const [weather, setWeather] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

  async function getUserToken() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error("Error retrieving user token", error);
      return null;  // Return null if no token is found
    }
  }

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_APIKEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        fetchNearbyActivities(latitude, longitude, data.weather[0].main.toLowerCase());
      } else {
        alert("City not found");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchNearbyActivities = async (lat, lon, condition) => {
    try {
      const type = getActivityTypeBasedOnWeather(condition);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=25000&type=${type}&key=${GOOGLE_APIKEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setActivities(data.results);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityTypeBasedOnWeather = (condition) => {
    if (condition === "clear") return "park"; // Sunny: Parks or outdoor activities
    if (condition.includes("cloud")) return "museum"; // Cloudy: Museums or indoor sightseeing
    if (condition.includes("rain") || condition.includes("drizzle")) return "movie_theater"; // Rainy: Movie theaters
    if (condition.includes("snow") || condition.includes("cold")) return "cafe"; // Cold: Cozy indoor places
    return "tourist_attraction"; // Default: Tourist attractions
  };

  const handleFavorite = async (activity) => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Assuming the token is stored in AsyncStorage
      if (!token) {
        Alert.alert("Please login to add to favorites");
        navigation.navigate("Login");
        return;
      }

      const response = await axios.post("http://192.168.1.132:5000/addFavorite", {
        activityId: activity.place_id,
        activityName: activity.name,
        activityImage: activity.photos ? activity.photos[0].photo_reference : "",
        activityAddress: activity.vicinity,
        token, // Send token for authentication
      });

      if (response.data.success) {
        Alert.alert("Activity added to favorites!");
        // Optionally, update the favorites list after adding to the backend
        setFavorites((prevFavorites) => [...prevFavorites, activity]);
      } else {
        Alert.alert("Error adding activity to favorites");
      }
    } catch (error) {
      console.error("Error adding favorite:", error);
      Alert.alert("Something went wrong. Please try again.");
    }
  };

  const renderWeatherIcon = (condition) => {
    switch (condition) {
      case "clear":
        return <MaterialCommunityIcons name="weather-sunny" size={40} color="#FFAA00" />;
      case "clouds":
        return <MaterialCommunityIcons name="weather-cloudy" size={40} color="#777777" />;
      case "rain":
        return <MaterialCommunityIcons name="weather-rainy" size={40} color="#0000FF" />;
      case "snow":
        return <MaterialCommunityIcons name="weather-snowy" size={40} color="#FFFFFF" />;
      default:
        return <MaterialCommunityIcons name="weather-cloudy" size={40} color="#777777" />;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap the weather icon to see the next 7-Day forecast</Text>

      {weather && (
        <TouchableOpacity
          style={styles.weatherInfo}
          onPress={() => navigation.navigate("Weather Forecast", { latitude, longitude })}
        >
          {renderWeatherIcon(weather.weather[0].main.toLowerCase())}
          <Text style={styles.cityName}>{cityName}</Text>
          <Text style={styles.temperature}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Nearby Activities</Text>

      {activities.length > 0 ? (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              {item.photos && item.photos[0] && (
                <Image
                  style={styles.activityImage}
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_APIKEY}`,
                  }}
                />
              )}
              <Text style={styles.activityName}>{item.name}</Text>
              <Text style={styles.activityAddress}>{item.vicinity}</Text>
              {item.rating && <Text style={styles.activityRating}>Rating: {item.rating}⭐</Text>}
              <TouchableOpacity onPress={() => handleFavorite(item)}>
                <MaterialCommunityIcons name="heart" size={30} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noActivitiesMessage}>
          There's nothing available to do in your area based on the current weather.
        </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  weatherInfo: {
    alignItems: "center",
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cityName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "200",
    marginBottom: 8,
    color: "#FFAA00",
  },
  weatherDescription: {
    fontSize: 18,
    color: "#666",
    textTransform: "capitalize",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#444",
  },
  activityItem: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  activityRating: {
    fontSize: 14,
    color: "#FFAA00",
  },
  noActivitiesMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#444",
  },
});

export default WeatherActivitiesScreen;
