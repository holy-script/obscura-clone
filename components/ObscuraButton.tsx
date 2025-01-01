import { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";

interface ObscuraButtonProps {
  onPress: () => void;
  title?: string;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  containerStyle?: StyleProp<ViewStyle>;
  iconSize?: number;
  disabled?: boolean;
}
export default function ObscuraButton({
  onPress,
  iconName,
  title,
  containerStyle,
  iconSize,
  disabled
}: ObscuraButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? 'gray' : Colors.dark.background,
          borderRadius: title ? 6 : 40,
          alignSelf: "flex-start",
          opacity: disabled ? 0.5 : 1,
        },
        containerStyle,
      ]}
      disabled={disabled}
    >
      {iconName && (
        <Ionicons name={iconName} size={iconSize ?? 28} color={"white"} disabled={disabled} />
      )}
      {title ? (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "white",
          }}
          disabled={disabled}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
});