import mongoose, { Schema, models } from 'mongoose';

const accountsSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre de cuenta es requerido'],
        unique: true
    },
    telephone: Number,
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'La clave es requerida'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpired: {
        type: Date,
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

const Account = models.Account || mongoose.model('Account', accountsSchema);
export default Account;