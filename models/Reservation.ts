import mongoose, { Schema, models } from 'mongoose';

const reservationsSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere ID de la cuenta'],
        select: false
    },
    locationId: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: [true, 'El nombre del servicio apartado es requerido']
    },
    cliente: {
        type: String,
        required: [true, 'El nombre del cliente es requerido']
    },
    descripcion: {
        type: String
    },
    start: {
        type: Date,
        required: [true, 'La fecha de la reserva es requerida']
    },
    color: {
        type: String,
        default: '#da3743'
    },
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

const Reservation = models.Reservation || mongoose.model('Reservation', reservationsSchema);
export default Reservation;