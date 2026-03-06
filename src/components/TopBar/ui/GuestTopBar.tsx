// src/components/TopBar/ui/GuestTopBar.tsx
import { colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


const GuestTopBar: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>AM Arena</Text>
            <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 60,
        backgroundColor: colors.darkBackground1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    logo: { color: colors.primaryPurple, fontWeight: "bold", fontSize: 18 },
    loginButton: {
        backgroundColor: colors.neonBlue,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    loginText: { color: colors.white, fontWeight: "bold" },
});

export default GuestTopBar;