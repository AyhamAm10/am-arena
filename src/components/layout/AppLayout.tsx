// src/components/AppLayout.tsx
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TopBar } from "../TopBar";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#191021" }}>
            <TopBar type="auth" avatarSource={require("../../assets/pubg.jpg")} level={24} levelProgress={0.75} coins={1450} />
            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>{children}</ScrollView>
            {/* <BottomNavigation /> */}
        </SafeAreaView>
    );
};