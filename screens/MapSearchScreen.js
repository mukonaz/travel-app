// screens/MapSearchScreen.js
import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_API_KEY } from "@env";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const MapSearchScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 37.4221,
    longitude: -122.0841,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePlaceSelect = (data, details = null) => {
    if (details?.geometry?.location) {
      const { lat, lng } = details.geometry.location;

      setRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setSelectedLocation({
        latitude: lat,
        longitude: lng,
        name: details.name,
        address: details.formatted_address,
      });

      navigation.navigate("WeatherActivities", {
        cityName: details.name,
      });
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
          listView: styles.listView,
        }}
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
        listViewDisplayed={false}
      />

      <MapView style={styles.map} region={region}>
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title={selectedLocation.name}
            description={selectedLocation.address}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  autocompleteContainer: {
    position: "absolute",
    top: 40,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  textInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
  listView: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginTop: 5,
  },
});

export default MapSearchScreen;
