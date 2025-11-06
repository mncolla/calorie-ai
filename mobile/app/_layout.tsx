import { Slot, Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { QueryProvider } from '../providers/QueryProvider'
import '../global.css'

export default function RootLayoutNav() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryProvider>
        <Slot />
      </QueryProvider>
    </ClerkProvider>
  )
}