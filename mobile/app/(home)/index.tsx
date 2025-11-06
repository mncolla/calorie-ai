import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { useState } from 'react'
import { Link } from 'expo-router'
import { Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { CalendarProvider, WeekCalendar } from 'react-native-calendars'
import { useMeals } from '@/hooks/useMeals'
import { CameraModal } from '@/components/CameraModal'
import { useAnalyzeImage } from '@/hooks/useAnalyzeImage'
import { useQueryClient } from '@tanstack/react-query'

export default function Page() {
    const { user } = useUser()
    const today = new Date().toISOString().split('T')[0]
    const [selectedDate, setSelectedDate] = useState(today)
    const [showCamera, setShowCamera] = useState(false)
    
    const { data: mealsData, isLoading, error } = useMeals(selectedDate, selectedDate)
    const analyzeImage = useAnalyzeImage()
    const queryClient = useQueryClient()

    return (
        <>
            <CalendarProvider
                date={today}
                onDateChanged={setSelectedDate}
            >
                <WeekCalendar />
                <ScrollView className="flex-1 px-4">
                    <SignedIn>
                        <Text className="text-lg font-semibold mb-4">
                            Hello {user?.emailAddresses[0].emailAddress}
                        </Text>
                        
                        <View className="mb-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-2xl font-bold">
                                    Meals for {selectedDate}
                                </Text>
                                <TouchableOpacity 
                                    className="bg-blue-500 px-4 py-2 rounded-lg"
                                    onPress={() => setShowCamera(true)}
                                    disabled={analyzeImage.isPending}
                                >
                                    <Text className="text-white font-semibold">
                                        {analyzeImage.isPending ? 'Analyzing...' : '📸 Add Meal'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
                            {isLoading && (
                                <ActivityIndicator size="large" className="mt-4" />
                            )}
                            
                            {error && (
                                <Text className="text-red-500 mt-4">
                                    Error loading meals
                                </Text>
                            )}
                            
                            {mealsData && (
                                <>
                                    <Text className="text-lg font-semibold mb-3">
                                        Total Calories: {mealsData.totalCalories}
                                    </Text>
                                    <Text className="text-sm text-gray-600 mb-4">
                                        {mealsData.count} meal{mealsData.count !== 1 ? 's' : ''}
                                    </Text>
                                    
                                    {mealsData.meals.map((meal) => (
                                        <View key={meal.id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                                            <Text className="font-semibold capitalize mb-1">
                                                {meal.mealType}
                                            </Text>
                                            <Text className="text-sm text-gray-600 mb-2">
                                                {new Date(meal.analyzedAt).toLocaleTimeString()}
                                            </Text>
                                            <Text className="font-medium mb-2">
                                                {meal.totalCalories} calories
                                            </Text>
                                            <View className="space-y-1">
                                                {meal.foods.map((food, index) => (
                                                    <Text key={index} className="text-sm text-gray-700">
                                                        • {food.name}: {food.calories} cal
                                                    </Text>
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                </>
                            )}
                        </View>
                        
                        <CameraModal
                            visible={showCamera}
                            onClose={() => setShowCamera(false)}
                            onPhotoTaken={async (photo, mealType) => {
                                try {
                                    await analyzeImage.mutateAsync({ imageUri: photo.uri, mealType })
                                    queryClient.invalidateQueries({ queryKey: ['meals'] })
                                    Alert.alert('Success', 'Meal analyzed successfully!')
                                } catch (error) {
                                    Alert.alert('Error', 'Failed to analyze image')
                                }
                            }}
                        />
                        
                        <SignOutButton />
                    </SignedIn>
                    <SignedOut>
                        <Link href="/(auth)/sign-in" className="mb-2">
                            <Text className="text-blue-500">Sign in</Text>
                        </Link>
                        <Link href="/(auth)/sign-up">
                            <Text className="text-blue-500">Sign up</Text>
                        </Link>
                    </SignedOut>
                </ScrollView>
            </CalendarProvider>
        </>
    )
}