import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthBootstrap } from "@/src/components/auth/AuthBootstrap";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </AuthBootstrap>
    </QueryClientProvider>
  );
}
