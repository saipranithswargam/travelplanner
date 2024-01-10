export {}
import mongoose from "mongoose"

const Schema = mongoose.Schema
const placeSchema = new Schema({
    place_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: false
    },
    lon: {
        type: String,
        required: false
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: false
    }]
})

export default mongoose.model('Place', placeSchema)
