import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
    image: {
        type: String,
        required: true
    },
    stack: {
        type: [String],
        required: true
    },
    github_url: {
        type: String,
        required: true
    },
    live_url: {
        type: String
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
