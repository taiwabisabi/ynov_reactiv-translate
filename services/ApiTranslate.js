import axios from 'axios';
import * as FileSystem from "expo-file-system";

const API_URL = 'https://api-translatov.herokuapp.com/';

class ApiTranslate {
  async getTranslate(audioUri, languages, overrideIp = false) {
    const { uri } = await FileSystem.getInfoAsync(audioUri);

    // Prepare Formdata for request
    const formData = new FormData();
    formData.append("audio", {
      uri,
      type: "audio/*",
      name: "speech2text"
    });
    formData.append("from", languages[0].code);
    formData.append("to", languages[1].code);

    // Make api call to get translation
    return axios.post(
      API_URL,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
  }
}

export default ApiTranslate;