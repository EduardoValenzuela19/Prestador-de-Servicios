import mongoose, { Schema, models } from 'mongoose';

const locationsSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere ID de la cuenta'],
        select: false
    },
    accountLocationId: Number,
    locationName: {
        type: String,
        required: [true, 'El nombre del lugar es requerido']
    },
    locationImage: String,
    busienessHours: Array,
    category: String,
    subcategory: String,
    summary: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: Number,
    ratingAvarage: {
        type: Number,
        default: 1,
        min: [1, 'La calificación tiene que ser mayor a 1.0'],
        max: [5, 'La calificación tiene que ser menor a 5.0'],
    },
    ratingQuantity: Number,
    recomendations: [],
    experiences: {
        hoursOfOperation: String,
        priceRange: String,
        cuisines: [],
        additional: String,
        maxCapacity: String,
        delivery: String,
        takeout: String
    },
    images: [],
    menu: [],
    services: [],
    additionalServices: [],
    website: String,
    whatsapp: Number,
    telephone: Number,
    email: String,
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        locationName: String
    }],
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
});

const Location = models.Location || mongoose.model('Location', locationsSchema);
export default Location;