// src/components/AppLayout.tsx
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors_V2 } from '@/src/theme/colors';
import { TopBar } from '../TopBar';

type AppLayoutProps = {
  children: React.ReactNode;
  /** When false, children manage their own scroll (e.g. FlatList). */
  scrollable?: boolean;
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  scrollable = true,
}) => {
  const header = useHeaderUser();
  const contentStyle = { flex: 1, paddingHorizontal: 16, paddingTop: 8 } as const;
  const avatarSource =
    header.avatarUri != null ? { uri: header.avatarUri } : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors_V2.background }}>
      <TopBar
        type={header.isLoggedIn ? "auth" : "unAuth"}
        avatarSource={avatarSource}
        level={header.level}
        levelProgress={header.levelProgress}
        coins={header.coins}
        achievementColor={header.achievementColor}
        achievementIconUrl={header.achievementIconUrl}
        achievementName={header.achievementName}
      />
      {scrollable ? (
        <ScrollView style={contentStyle}>{children}</ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
};
