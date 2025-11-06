import { apiClient } from './api'

export interface Food {
  name: string
  calories: number
}

export interface Meal {
  id: string
  imageUrl: string
  mealType: 'breakfast' | 'snack' | 'lunch' | 'dinner' | 'other'
  foods: Food[]
  totalCalories: number
  analyzedAt: string
}

export interface MealsResponse {
  meals: Meal[]
  totalCalories: number
  count: number
}

export const mealsService = {
  async getMeals(startDate?: string, endDate?: string): Promise<MealsResponse> {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiClient.get(`/meals${query}`)
  },

  async analyzeImage(imageUri: string, mealType: string): Promise<Meal> {
    const formData = new FormData()
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'meal.jpg',
    } as any)
    formData.append('mealType', mealType)

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/analyze`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },
}