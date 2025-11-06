import { useMutation } from '@tanstack/react-query'
import { mealsService } from '../services/meals'

export const useAnalyzeImage = () => {
  return useMutation({
    mutationFn: ({ imageUri, mealType }: { imageUri: string; mealType: string }) =>
      mealsService.analyzeImage(imageUri, mealType),
    onSuccess: (data) => {
      console.log('Image analyzed successfully:', data)
    },
    onError: (error) => {
      console.error('Error analyzing image:', error)
    },
  })
}