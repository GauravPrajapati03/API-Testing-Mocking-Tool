import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    name: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ["GET", "POST", "PUT", "DELETE"]
    },
    headers: {
        type: Object,
        default: {}
    },
    body: {
        type: Object,
        default: {}
    },
    response: {
        status: Number,
        statusText: String,
        headers: Object,
        data: Object
    }
}, { timestamps: true });

export default mongoose.model("Request", requestSchema);
