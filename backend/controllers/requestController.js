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

// Get all saved requests of a user
export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Execute request (send API call)
export const executeRequest = async (req, res) => {
  try {
    const { url, method, headers, body } = req.body;

    const response = await axios({
      url,
      method,
      headers,
      data: body,
    });

    res.json({
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
