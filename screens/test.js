import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { OPENWEATHER_APIKEY, GOOGLE_APIKEY } from "@env";
import { MaterialCommunityIcons } from "react-native-vector-icons";

const WeatherActivitiesScreen = ({ route, navigation }) => {
  const { latitude, longitude, cityName } = route.params;
  const [weather, setWeather] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData();
  }, [latitude, longitude]);

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
      <Text style={styles.title}>tap the weather icon to see the next 7-Days weather </Text>
      {weather && (
        <TouchableOpacity
          style={styles.weatherInfo}
          onPress={() =>
            navigation.navigate("WeatherForecast", { latitude, longitude })
          }
        >
          {renderWeatherIcon(weather.weather[0].main.toLowerCase())}
          <Text style={styles.cityName}>{cityName}</Text>
          <Text style={styles.temperature}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={styles.weatherDescription}>
            {weather.weather[0].description}
          </Text>
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
              {item.rating && (
                <Text style={styles.activityRating}>
                  Rating: {item.rating}⭐
                </Text>
              )}
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