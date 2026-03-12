import mongoose, { Schema, models } from 'mongoose';

const cuponesSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere ID de la cuenta'],
        select: false
    },
    codigo: {
        type: String,
        required: [true, 'El código del cupón es requerido'],
        uppercase: true,
        trim: true
    },
    descuento: {
        type: String,
        required: [true, 'El valor del descuento es requerido']
    },
    fechaAplicacion: {
        type: Date,
        required: [true, 'La fecha de vencimiento es requerida']
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

const Coupon = models.Coupon || mongoose.model('Coupon', cuponesSchema);
export default Coupon;