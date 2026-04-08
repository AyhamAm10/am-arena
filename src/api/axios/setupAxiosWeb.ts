import axios from "axios";
import { Platform } from "react-native";

/** Avoid Node `http` adapter on web (Metro bundles it and crashes). */
if (Platform.OS === "web") {
  axios.defaults.adapter = "xhr";
}
