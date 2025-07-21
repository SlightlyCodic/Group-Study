import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import createContextHook from '@nkzw/create-context-hook';
import { Group, Notification, User } from '@/types';
import { generateUniqueId } from '@/utils/helpers';
import { trpcClient } from '@/lib/trpc';

// Mock user for initial state
const DEFAULT_USER: User = {
  id: '',
  name: '',
  status: '',
  lastUpdated: new Date().toISOString(),
};

export const [AppStateProvider, useAppState] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const queryClient = useQueryClient();

  // Load user data from storage
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userData = await AsyncStorage.getItem('user');
      const onboarded = await AsyncStorage.getItem('onboarded');
      
      if (onboarded === 'true') {
        setIsOnboarded(true);
      }
      
      if (userData) {
        const parsedUser = JSON.parse(userData) as User;
        setUser(parsedUser);
        return parsedUser;
      }
      return null;
    },
  });

  // Load groups from backend
  const groupsQuery = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const groups = await trpcClient.groups.getUserGroups.query({ userId: user.id });
        return groups;
      } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Load notifications from backend
  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const notifications = await trpcClient.notifications.getUserNotifications.query({ userId: user.id });
        return notifications;
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Save user data locally and to backend
  const saveUserMutation = useMutation({
    mutationFn: async (userData: User) => {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Create user on backend if new
      try {
        await trpcClient.users.create.mutate({
          id: userData.id,
          name: userData.name,
        });
      } catch (error) {
        console.error('Error creating user on backend:', error);
      }
      
      return userData;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Complete onboarding
  const completeOnboarding = async (name: string) => {
    const newUser: User = {
      ...DEFAULT_USER,
      id: generateUniqueId(),
      name,
      status: "I'm new here!",
    };
    
    await saveUserMutation.mutateAsync(newUser);
    await AsyncStorage.setItem('onboarded', 'true');
    setIsOnboarded(true);
  };

  // Create a new group
  const createGroup = async (groupName: string) => {
    if (!user) return null;
    
    try {
      const groupId = generateUniqueId();
      const newGroup = await trpcClient.groups.create.mutate({
        groupName,
        userId: user.id,
        groupId,
      });
      
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      return newGroup;
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
      return null;
    }
  };

  // Join a group with invite code
  const joinGroup = async (inviteCode: string) => {
    if (!user) return false;
    
    try {
      await trpcClient.groups.join.mutate({
        inviteCode,
        userId: user.id,
      });
      
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error joining group:', error);
      Alert.alert('Error', error.message || 'Failed to join group');
      return false;
    }
  };

  // Leave a group
  const leaveGroup = async (groupId: string) => {
    if (!user) return false;
    
    try {
      await trpcClient.groups.leave.mutate({
        groupId,
        userId: user.id,
      });
      
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      return false;
    }
  };

  // Update user status
  const updateStatus = async (newStatus: string) => {
    if (!user) return false;
    
    try {
      const updatedUser = await trpcClient.users.updateStatus.mutate({
        userId: user.id,
        status: newStatus,
      });
      
      // Update local user state
      const localUpdatedUser = { ...user, ...updatedUser };
      setUser(localUpdatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(localUpdatedUser));
      
      // Create notifications for group members
      const groups = groupsQuery.data || [];
      const userGroups = groups.filter((g: any) => g.members.some((m: any) => m.id === user.id));
      const notifications: any[] = [];
      
      userGroups.forEach((group: any) => {
        group.members.forEach((member: any) => {
          if (member.id !== user.id) {
            notifications.push({
              id: generateUniqueId(),
              userId: member.id,
              userName: member.name,
              groupId: group.id,
              groupName: group.name,
              message: `${user.name} updated their status: "${newStatus}"`,
              timestamp: new Date().toISOString(),
              read: false,
            });
          }
        });
      });
      
      if (notifications.length > 0) {
        await trpcClient.notifications.create.mutate({ notifications });
      }
      
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      return false;
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await trpcClient.notifications.markRead.mutate({ notificationId });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    const notifications = notificationsQuery.data || [];
    const unreadNotifications = notifications.filter((n: any) => !n.read);
    
    try {
      await Promise.all(
        unreadNotifications.map((notification: any) =>
          trpcClient.notifications.markRead.mutate({ notificationId: notification.id })
        )
      );
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Get user groups
  const getUserGroups = () => {
    return groupsQuery.data || [];
  };

  // Get unread notifications count
  const getUnreadNotificationsCount = () => {
    const notifications = notificationsQuery.data || [];
    return notifications.filter((n: any) => !n.read).length;
  };

  return {
    user,
    isOnboarded,
    notifications: notificationsQuery.data || [],
    groups: groupsQuery.data || [],
    userGroups: getUserGroups(),
    unreadNotificationsCount: getUnreadNotificationsCount(),
    isLoading: userQuery.isLoading || groupsQuery.isLoading || notificationsQuery.isLoading,
    completeOnboarding,
    createGroup,
    joinGroup,
    leaveGroup,
    updateStatus,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
});