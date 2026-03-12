import mongoose, { Schema, models } from 'mongoose';

const subcategoriesSchema = new Schema({
    catagoryId: {
        type: Number,
        required: [true, 'ID de la categoria es requerida']
    },
    subcategoryName: {
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Subcategory = models.Subcategory || mongoose.model('Subcategory', subcategoriesSchema);
export default Subcategory;