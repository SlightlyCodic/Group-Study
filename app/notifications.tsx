import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import NotificationItem from '@/components/NotificationItem';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import { useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCircle } from 'lucide-react-native';
import { Stack } from 'expo-router';

export default function NotificationsScreen() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppState();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  // Sort notifications by timestamp (newest first)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    setRefreshing(false);
  }, [queryClient]);

  const handleNotificationPress = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const hasUnreadNotifications = notifications.some(n => !n.read);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerRight: hasUnreadNotifications ? () => (
            <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Mark all read</Text>
            </TouchableOpacity>
          ) : undefined,
        }}
      />
      
      <FlatList
        data={sortedNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem 
            notification={item} 
            onPress={() => handleNotificationPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={40} color={colors.primary} />}
            title="No Notifications"
            message="When your friends update their status or join your groups, you'll see notifications here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  headerButton: {
    marginRight: 8,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
});