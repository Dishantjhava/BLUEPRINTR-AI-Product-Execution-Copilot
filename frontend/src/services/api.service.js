// src/services/api.service.js

// Use relative paths so requests go through the Vite proxy in dev
const BASE_URL = '/api';

/**
 * Custom error class that carries HTTP status codes.
 */
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Helper: makes a fetch call and returns parsed JSON.
 * Throws an ApiError (with .status) on non-OK responses or invalid JSON.
 */
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  if (!res.ok) {
    let errorMessage = `Server error: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = `Failed to fetch: Server returned ${res.status} ${res.statusText}`;
    }
    throw new ApiError(errorMessage, res.status);
  }

  const text = await res.text();
  if (!text) {
    throw new Error('Empty response from server');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response: ${text.substring(0, 50)}...`);
  }
}

export const API = {
  // ── AI Generation ────────────────────────────────────────────────────
  async askAI(idea, customApiKey) {
    return apiFetch(`${BASE_URL}/askAI`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idea, customApiKey: customApiKey || undefined }),
    });
  },

  // ── Blueprint CRUD ───────────────────────────────────────────────────
  async saveBlueprint(idea, solution) {
    return apiFetch(`${BASE_URL}/blueprints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idea,
        solution,
        title: solution?.product_summary?.title || 'Untitled Blueprint',
      }),
    });
  },

  async getBlueprintById(id) {
    return apiFetch(`${BASE_URL}/blueprints/${id}`);
  },

  async getUserBlueprints() {
    return apiFetch(`${BASE_URL}/blueprints`);
  },
};
