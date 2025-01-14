import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import "react-native-get-random-values";
import { GOOGLE_API_KEY } from "@env"; // Import the API key

const App = () => {
  const [region, setRegion] = useState({
    latitude: 37.4221,
    longitude: -122.0841,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <View style={styles.container}>
      {/* Google Places Search Bar */}
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        fetchDetails={true}
        onPress={(data, details = null) => {
          if (details?.geometry?.location) {
            const { lat, lng } = details.geometry.location;

            // Update map region
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });

            // Set marker location
            setSelectedLocation({
              latitude: lat,
              longitude: lng,
              name: details.name,
              address: details.formatted_address,
            });
          }
        }}
        query={{
          key: GOOGLE_API_KEY, // Use the environment variable here
          language: "en",
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInput: styles.textInput,
        }}
      />

      {/* Map */}
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
    top: 10,
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
  },
});

export default App;
