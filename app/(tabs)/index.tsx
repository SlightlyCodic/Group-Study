import React, { useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import StatusCard from '@/components/StatusCard';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Users, RefreshCw } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

export default function HomeScreen() {
  const { userGroups, user, isLoading, isOnboarded } = useAppState();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  // Handle onboarding redirect
  useEffect(() => {
    if (!isOnboarded && !isLoading) {
      router.replace('/onboarding');
    }
  }, [isOnboarded, isLoading, router]);

  // Get all members from all groups the user is in
  const allMembers = userGroups.flatMap(group => group.members);
  
  // Remove duplicates based on user ID
  const uniqueMembers = allMembers.filter((member, index, self) => 
    index === self.findIndex(m => m.id === member.id)
  );
  
  // Sort by last updated time (most recent first)
  const sortedMembers = [...uniqueMembers].sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['groups'] });
    await queryClient.invalidateQueries({ queryKey: ['user'] });
    setRefreshing(false);
  }, [queryClient]);

  const navigateToUpdateStatus = () => {
    router.push('/profile/edit');
  };

  const navigateToGroups = () => {
    router.push('/groups');
  };

  // Don't render anything while checking onboarding status
  if (isLoading) {
    return null;
  }

  // Don't render if not onboarded (will redirect)
  if (!isOnboarded) {
    return null;
  }

  if (userGroups.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon={<Users size={40} color={colors.primary} />}
          title="No Groups Yet"
          message="Join or create a group to see status updates from your friends."
          buttonTitle="Find Groups"
          onButtonPress={navigateToGroups}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StatusCard 
            user={item} 
            isCurrentUser={item.id === user?.id}
            onPress={item.id === user?.id ? navigateToUpdateStatus : undefined}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Status Updates</Text>
            <Text style={styles.subtitle}>
              See what's happening with your friends
            </Text>
          </View>
        }
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
            icon={<RefreshCw size={40} color={colors.primary} />}
            title="Loading Updates"
            message="Pull down to refresh and check for new updates."
            style={{ marginTop: 40 }}
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
});