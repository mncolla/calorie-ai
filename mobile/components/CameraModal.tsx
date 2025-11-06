import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { Picker } from '@react-native-picker/picker'

interface CameraModalProps {
  visible: boolean
  onClose: () => void
  onPhotoTaken: (photo: { uri: string }, mealType: string) => void
}

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'other']

export function CameraModal({ visible, onClose, onPhotoTaken }: CameraModalProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [type, setType] = useState<'front' | 'back'>('back')
  const [mealType, setMealType] = useState('lunch')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const camera = useRef<any>(null)

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View className="flex-1 bg-black">
          <Text className="text-center text-white pb-2.5 text-base">
            We need your permission to show the camera
          </Text>
          <TouchableOpacity 
            className="bg-blue-500 p-4 rounded-lg my-2.5" 
            onPress={requestPermission}
          >
            <Text className="text-white text-center text-base">Grant permission</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-red-500/80 p-4 rounded-lg my-2.5" 
            onPress={onClose}
          >
            <Text className="text-white text-center text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  function toggleCameraType() {
    setType((current: 'front' | 'back') => (current === 'back' ? 'front' : 'back'))
  }

  async function takePicture() {
    if (!camera.current) return

    setIsAnalyzing(true)
    try {
      const photo = await camera.current.takePictureAsync()
      onPhotoTaken(photo, mealType)
      onClose()
    } catch (error) {
      console.error('Error taking picture:', error)
      Alert.alert('Error', 'Failed to take picture')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-black">
        <CameraView 
          className="flex-1" 
          facing={type} 
          ref={camera}
        >
          <View className="flex-1 justify-between">
            <View className="flex-row justify-around items-center py-5">
              <TouchableOpacity 
                className="bg-white/20 p-4 rounded-full" 
                onPress={toggleCameraType}
              >
                <Text className="text-white text-base">Flip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className={`p-4 rounded-full min-w-[100px] items-center ${
                  isAnalyzing ? 'bg-gray-400' : 'bg-blue-500'
                }`} 
                onPress={takePicture}
                disabled={isAnalyzing}
              >
                <Text className="text-white text-base font-bold">
                  {isAnalyzing ? 'Analyzing...' : 'Capture'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-red-500/80 p-4 rounded-full" 
                onPress={onClose}
              >
                <Text className="text-white text-base">Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <View className="bg-black/70 p-5">
              <Text className="text-white text-base mb-2.5">Meal Type:</Text>
              <View className="bg-white/10 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={mealType}
                  onValueChange={setMealType}
                  className="text-white h-12"
                  dropdownIconColor="white"
                >
                  {MEAL_TYPES.map((type) => (
                    <Picker.Item 
                      key={type} 
                      label={type.charAt(0).toUpperCase() + type.slice(1)} 
                      value={type} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
}