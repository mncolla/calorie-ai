import type { Context } from 'hono'
import { saveImage, analyzeImageWithAI } from '../services/imageService.js'
import { MealModel } from '../models/Meal.js'

export const analyzeImage = async (c: Context) => {
  try {
    const body = await c.req.parseBody()
    const image = body.image as File
    const mealType = body.mealType as string
    
    if (!image) {
      return c.json({ error: 'No image provided' }, 400)
    }
    
    if (!mealType || !['breakfast', 'snack', 'lunch', 'dinner', 'other'].includes(mealType)) {
      return c.json({ error: 'Invalid mealType. Must be: breakfast, snack, lunch, dinner, or other' }, 400)
    }
    
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const imageUrl = await saveImage(imageBuffer, image.name)
    
    const analysis = await analyzeImageWithAI(imageBuffer)
    
    const meal = new MealModel({
      id: crypto.randomUUID(),
      imageUrl,
      mealType,
      foods: analysis.foods,
      totalCalories: analysis.totalCalories
    })
    
    await meal.save()
    
    return c.json({
      id: meal.id,
      imageUrl: meal.imageUrl,
      mealType: meal.mealType,
      foods: meal.foods,
      totalCalories: meal.totalCalories,
      analyzedAt: meal.analyzedAt
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return c.json({ error: 'Failed to analyze image' }, 500)
  }
}

export const getMeals = async (c: Context) => {
  try {
    const startDate = c.req.query('startDate')
    const endDate = c.req.query('endDate')
    
    const query: any = {}
    
    if (startDate || endDate) {
      query.analyzedAt = {}
      if (startDate) query.analyzedAt.$gte = new Date(startDate)
      if (endDate) query.analyzedAt.$lte = new Date(endDate)
    }
    
    const meals = await MealModel.find(query).sort({ analyzedAt: -1 })
    
    const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0)
    
    return c.json({
      meals: meals.map(meal => ({
        id: meal.id,
        imageUrl: meal.imageUrl,
        mealType: meal.mealType,
        foods: meal.foods,
        totalCalories: meal.totalCalories,
        analyzedAt: meal.analyzedAt
      })),
      totalCalories,
      count: meals.length
    })
  } catch (error) {
    console.error('Get meals error:', error)
    return c.json({ error: 'Failed to get meals' }, 500)
  }
}