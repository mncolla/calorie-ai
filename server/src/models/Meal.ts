import mongoose from 'mongoose'

const mealSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  mealType: { 
    type: String, 
    required: true, 
    enum: ['breakfast', 'snack', 'lunch', 'dinner', 'other'] 
  },
  foods: [{
    name: { type: String, required: true },
    calories: { type: Number, required: true }
  }],
  totalCalories: { type: Number, required: true },
  analyzedAt: { type: Date, default: Date.now }
})

export const MealModel = mongoose.model('Meal', mealSchema)