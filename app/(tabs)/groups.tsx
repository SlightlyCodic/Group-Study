import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useAppState } from '@/hooks/useAppState';
import GroupCard from '@/components/GroupCard';
import EmptyState from '@/components/EmptyState';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Users, Plus, UserPlus } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

export default function GroupsScreen() {
  const { userGroups } = useAppState();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['groups'] });
    setRefreshing(false);
  }, [queryClient]);

  const navigateToGroupDetails = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const navigateToCreateGroup = () => {
    router.push('/group/create');
  };

  const navigateToJoinGroup = () => {
    router.push('/group/join');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard 
            group={item} 
            onPress={() => navigateToGroupDetails(item.id)}
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
            icon={<Users size={40} color={colors.primary} />}
            title="No Groups Yet"
            message="Create a new group or join an existing one with an invite code."
            buttonTitle="Create Group"
            onButtonPress={navigateToCreateGroup}
          />
        }
      />

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.joinButton]}
          onPress={navigateToJoinGroup}
        >
          <UserPlus size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.createButton]}
          onPress={navigateToCreateGroup}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100, // Extra space for action buttons
  },
  actionButtons: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'column',
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 16,
  },
  joinButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  createButton: {
    backgroundColor: colors.primary,
  },
});