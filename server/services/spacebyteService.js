let cachedToken = null;

const parseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Spacebyte returned a non-JSON response: ${text.slice(0, 200)}`);
  }
};

const authenticateSpacebyte = async () => {
  try {
    const url = `${process.env.SPACEBYTE_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        email: process.env.SPACEBYTE_EMAIL,
        password: process.env.SPACEBYTE_PASSWORD,
        token_name: process.env.SPACEBYTE_TOKEN_NAME || "bod-system",
      }),
    });

    if (!response.ok) {
      const errorData = await parseJsonSafely(response);
      throw new Error(
        `Spacebyte authentication failed: ${
          errorData.message || response.statusText || "Unknown authentication error"
        }`
      );
    }

    const data = await parseJsonSafely(response);
    cachedToken =
      data.token ||
      data.accessToken ||
      data?.user?.access_token ||
      data?.user?.token ||
      null;

    if (!cachedToken) {
      throw new Error("Spacebyte authentication succeeded, but no access token was returned.");
    }

    return cachedToken;
  } catch (error) {
    console.error("Failed to authenticate with Spacebyte:", error);
    throw error;
  }
};

const getSpacebyteToken = async () => {
  if (!cachedToken) {
    return await authenticateSpacebyte();
  }
  return cachedToken;
};

/**
 * A fetch wrapper that automatically handles Bearer token attachment and automatic
 * token refreshing if a 401 Unauthorized response is returned from Spacebyte.
 */
const spacebyteFetch = async (endpoint, options = {}) => {
  let token = await getSpacebyteToken();

  const makeRequest = async (currentToken) => {
    const headers = {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
      Authorization: `Bearer ${currentToken}`,
    };
    return await fetch(`${process.env.SPACEBYTE_BASE_URL}${endpoint}`, { ...options, headers });
  };

  let response = await makeRequest(token);

  // If token is expired or unauthorized, refresh and retry exactly once
  if (response.status === 401) {
    console.log("Spacebyte token expired. Refreshing...");
    token = await authenticateSpacebyte();
    response = await makeRequest(token);
  }

  return response;
};

module.exports = {
  spacebyteFetch,
};
