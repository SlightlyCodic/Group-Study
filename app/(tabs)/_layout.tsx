import { Tabs } from "expo-router";
import { Home, Users, Bell, User } from "lucide-react-native";
import colors from "@/constants/colors";
import { useAppState } from "@/hooks/useAppState";

export default function TabLayout() {
  const { unreadNotificationsCount } = useAppState();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray600,
        tabBarStyle: {
          borderTopColor: colors.gray200,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color }) => <Users size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications-tab"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
          tabBarBadge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}