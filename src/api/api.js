const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : "https://travel-log-express-react.herokuapp.com";

export const getEntries = async () => {
  let response = await fetch(`${API_URL}/api/logs`);
  return response.json();
};

export const getEntriesByQuery = async(query) => {
  let response = await fetch(`${API_URL}/api/logs/find/${query}`);
  return response.json();
}

export const addEntry = async (body) => {
  let response = await fetch(`${API_URL}/api/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export default getEntries;
