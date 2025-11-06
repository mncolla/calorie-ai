import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mealsService, Meal } from '../services/meals'

export const useMealsByDate = (date: string) => {
  return useQuery({
    queryKey: ['meals', date],
    queryFn: () => mealsService.getMealsByDate(date),
    enabled: !!date,
  })
}

export const useCreateMeal = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (meal: Omit<Meal, 'id'>) => mealsService.createMeal(meal),
    onSuccess: (newMeal) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.setQueryData(['meals', newMeal.id], newMeal)
    },
  })
}

export const useUpdateMeal = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, meal }: { id: string; meal: Partial<Meal> }) => 
      mealsService.updateMeal(id, meal),
    onSuccess: (updatedMeal) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
      queryClient.setQueryData(['meals', updatedMeal.id], updatedMeal)
    },
  })
}

export const useDeleteMeal = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => mealsService.deleteMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] })
    },
  })
}

export const useAnalyzeImage = () => {
  return useMutation({
    mutationFn: (imageUri: string) => mealsService.analyzeImage(imageUri),
  })
}