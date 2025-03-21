import axios from "axios";

/**
 * Makes an authenticated API request.
 * @param {string} url - The API endpoint.
 * @param {object} auth - Authentication object { username, password }.
 * @param {object} options - Additional Axios options.
 * @returns {Promise<any>} - The API response.
 */
export async function makeApiRequest(url, auth, options = {}) {
  try {
    const response = await axios.get(url, {
      auth,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Erro na Requisição API: ${error.response?.data || error.message}`);
    throw error;
  }
}
