import axios from "axios";

const ENV_URL = process.env.RUTTER_URL || "production.rutterapi.com";
const CLIENT_ID = process.env.RUTTER_CLIENT_ID || "96ff6b2b-63f5-4e0a-8e11-1d55fe31842b";
const SECRET = process.env.RUTTER_SECRET || "18af1c27-2ddf-488f-945f-fdffc6cbc58d";

// handles exchanging the token and calling a sample API route
export default async (req, res) => {
  if (req.method === "POST") {
    // Process a POST request
    const { publicToken } = req.body;
    // Exchange publictoken for access_token
    try {
      const response = await axios.post(
        `https://${ENV_URL}/item/public_token/exchange`,
        {
          client_id: CLIENT_ID,
          public_token: publicToken,
          secret: SECRET,
        }
      );
      const {
        data: { access_token },
      } = response;
      // Respond with the access-token
      res.statusCode = 200;
      res.json({
        accessToken: access_token,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        error: e.message,
      });
    }
  } else {
    // Handle any other HTTP method
    res.statusCode(401).json({
      error_message: "Unauthorized Method",
    });
  }
};
