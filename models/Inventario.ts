import mongoose, { Schema, models } from 'mongoose';

const inventarioSchema = new Schema({
    accountId: {
        type: Schema.Types.ObjectId,
        required: [true, 'Se requiere ID de la cuenta'],
        select: false 
    },
    titulo: {
        type: String,
        required: [true, 'El título del servicio o producto es requerido'],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true
    },
    precio: {
        type: String,
        required: [true, 'El precio es requerido']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida']
        
    },
    horarios: {
        type: [String], 
        default: []
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

const ServicioMenu = models.ServicioMenu || mongoose.model('ServicioMenu', inventarioSchema);
export default ServicioMenu;