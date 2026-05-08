// src/components/AppLayout.tsx
import { useHeaderUser } from "@/src/hooks/auth/useHeaderUser";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors_V2 } from "@/src/theme/colors";
import { TopBar } from "../TopBar";
import { KeyboardAwareScreenScrollView } from "./KeyboardAwareScreenScrollView";

type AppLayoutProps = {
  children: React.ReactNode;
  /** When false, children manage their own scroll (e.g. FlatList). */
  scrollable?: boolean;
  refreshControl?: React.ReactElement | null;
};

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  scrollable = true,
  refreshControl = null,
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
        <KeyboardAwareScreenScrollView style={contentStyle} refreshControl={refreshControl}>
          {children}
        </KeyboardAwareScreenScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
};
