import Request from "../models/requestModel.js";
import axios from "axios";

// Save request
export const saveRequest = async (req, res) => {
  try {
    const { name, url, method, headers, body } = req.body;

    const newRequest = await Request.create({
      userId: req.user._id,
      name,
      url,
      method,
      headers,
      body,
    });

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all/History of saved requests of a user
// export const getRequests = async (req, res) => {
//   try {
//     const requests = await Request.find({ userId: req.user._id });
//     res.json(requests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getHistory = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // last 50 requests
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
};

// Execute request (send API call)

export const executeRequest = async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;

    if (!url || !method) {
      return res.status(400).json({ error: "URL and method are required" });
    }

    const response = await axios({
      url,
      method,
      headers,
      data: body,
      validateStatus: () => true,
    });

    const responseData = {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
    };

    const requestLog = new Request({
      userId: req.user.id,
      url,
      method,
      headers,
      body,
      response: responseData,
    });

    await requestLog.save();

    return res.status(response.status).json(responseData);
  } catch (error) {
    console.error("❌ Request execution error:", error);
    return res.status(500).json({ error: error.message });
  }
};
