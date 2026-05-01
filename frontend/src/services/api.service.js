// src/services/api.service.js

const BASE_URL = 'http://localhost:5000/api'; // Direct connection to backend, bypassing Vite proxy

export const API = {
  async askAI(idea) {
    try {
      const response = await fetch(`${BASE_URL}/askAI`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea }),
      });

      // Handle non-200 HTTP responses
      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // Response wasn't valid JSON (e.g., HTML error page or 404 proxy error)
          errorMessage = `Failed to fetch: Server returned ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Read response as text first to handle cases where it's not JSON
      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      // Try parsing it
      try {
        const data = JSON.parse(text);
        return data;
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 50)}...`);
      }
      
    } catch (error) {
      console.error("API Error in askAI:", error);
      throw error; // Rethrow to be caught by the UI
    }
  }
};
