import { useQuery } from '@tanstack/react-query'
import { mealsService } from '../services/meals'

export const useMeals = (startDate?: string, endDate?: string) => {
  // Si endDate es igual a startDate, agregar un día para incluir todo el día
  const adjustedEndDate = startDate && endDate && startDate === endDate 
    ? new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : endDate

  return useQuery({
    queryKey: ['meals', startDate, adjustedEndDate],
    queryFn: () => mealsService.getMeals(startDate, adjustedEndDate),
  })
}