import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-gray-50">
        <View className="flex-1 min-h-screen justify-center px-6 py-8">
          {/* Logo and Title */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
              <MaterialIcons name="restaurant" size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">CalorieAI</Text>
            <Text className="text-gray-600 text-center">Track your meals with AI</Text>
          </View>

          {/* Sign In Form */}
          <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-6">Welcome Back</Text>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                keyboardType="email-address"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                value={password}
                placeholder="Enter your password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <TouchableOpacity 
              onPress={onSignInPress}
              disabled={!emailAddress || !password || !isLoaded}
              className="bg-green-500 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/sign-up">
              <Text className="text-green-500 font-semibold">Sign Up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}