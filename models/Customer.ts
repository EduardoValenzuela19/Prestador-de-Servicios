import mongoose, { Schema, models } from 'mongoose';

const customersSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere ID de la cuenta'],
        select: false
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true,
        lowercase: true
    },
    telephone: Number,
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

const Customer = models.Customer || mongoose.model('Customer', customersSchema);
export default Customer;