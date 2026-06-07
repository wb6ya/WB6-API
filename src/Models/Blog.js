import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    titleEn: {
        type: String,
    },
    descriptionEn: {
        type: String,
    },
    contentEn: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    image: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default mongoose.model("Blog", blogSchema);