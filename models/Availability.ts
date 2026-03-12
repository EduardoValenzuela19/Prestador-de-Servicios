import mongoose, { Schema, models } from 'mongoose';

const availabilitySchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere ID de la cuenta'],
        select: false
    },
    accountLocationId: Number,
    locationId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere el ID del lugar'],
    },
    locationName: {
        type: String,
        required: [true, 'El nombre del lugar es requerido']
    },
    busienessHours: Array,
    reserved: Array,
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

const Availability = models.Availability || mongoose.model('Availability', availabilitySchema);
export default Availability;