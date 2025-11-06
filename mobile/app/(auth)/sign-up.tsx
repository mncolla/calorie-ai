import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
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
                <MaterialIcons name="verified" size={40} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">Verify Email</Text>
              <Text className="text-gray-600 text-center">Check your inbox for the code</Text>
            </View>

            {/* Verification Form */}
            <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-6">Enter Verification Code</Text>
              
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Verification Code</Text>
                <TextInput
                  value={code}
                  placeholder="Enter 6-digit code"
                  onChangeText={(code) => setCode(code)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 text-center text-lg"
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity 
                onPress={onVerifyPress}
                disabled={!code || !isLoaded}
                className="bg-green-500 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Verify Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
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
            <Text className="text-2xl font-bold text-gray-800 mb-2">Join CalorieAI</Text>
            <Text className="text-gray-600 text-center">Start tracking your meals</Text>
          </View>

          {/* Sign Up Form */}
          <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-6">Create Account</Text>
            
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                onChangeText={(email) => setEmailAddress(email)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                keyboardType="email-address"
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                value={password}
                placeholder="Create a password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </View>

            <TouchableOpacity 
              onPress={onSignUpPress}
              disabled={!emailAddress || !password || !isLoaded}
              className="bg-green-500 rounded-lg py-3 items-center"
            >
              <Text className="text-white font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/sign-in">
              <Text className="text-green-500 font-semibold">Sign In</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}