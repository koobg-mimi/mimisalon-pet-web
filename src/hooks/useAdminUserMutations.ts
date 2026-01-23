'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from './useAdminUsers';

type UserAction = 'activate' | 'deactivate' | 'delete' | 'promote' | 'demote';

interface UserActionParams {
  userId: string;
  action: UserAction;
}

interface UserActionResponse {
  success: boolean;
  message: string;
  user?: User;
}

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  // Generic mutation for user actions
  const userActionMutation = useMutation<UserActionResponse, Error, UserActionParams>({
    mutationFn: async ({ userId, action }) => {
      const response = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to ${action} user`;

        if (response.status === 401) {
          throw new Error('Unauthorized: Admin access required');
        }
        if (response.status === 403) {
          throw new Error('Forbidden: Cannot modify this user');
        }
        if (response.status === 404) {
          throw new Error('User not found');
        }

        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate users list to refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });

      // Also invalidate the specific user if we have it cached
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] });

      // Show success message (you could integrate with a toast library here)
      console.log(`User ${variables.action} successful:`, data.message);
    },
    onError: (error, variables) => {
      // Show error message (you could integrate with a toast library here)
      console.error(`Failed to ${variables.action} user:`, error.message);
    },
  });

  // Convenience methods for specific actions
  const activateUser = (userId: string) => {
    return userActionMutation.mutate({ userId, action: 'activate' });
  };

  const deactivateUser = (userId: string) => {
    return userActionMutation.mutate({ userId, action: 'deactivate' });
  };

  const deleteUser = (userId: string) => {
    return userActionMutation.mutate({ userId, action: 'delete' });
  };

  const promoteUser = (userId: string) => {
    return userActionMutation.mutate({ userId, action: 'promote' });
  };

  const demoteUser = (userId: string) => {
    return userActionMutation.mutate({ userId, action: 'demote' });
  };

  // Async versions that return promises
  const activateUserAsync = (userId: string) => {
    return userActionMutation.mutateAsync({ userId, action: 'activate' });
  };

  const deactivateUserAsync = (userId: string) => {
    return userActionMutation.mutateAsync({ userId, action: 'deactivate' });
  };

  const deleteUserAsync = (userId: string) => {
    return userActionMutation.mutateAsync({ userId, action: 'delete' });
  };

  const promoteUserAsync = (userId: string) => {
    return userActionMutation.mutateAsync({ userId, action: 'promote' });
  };

  const demoteUserAsync = (userId: string) => {
    return userActionMutation.mutateAsync({ userId, action: 'demote' });
  };

  return {
    // Main mutation object
    userActionMutation,

    // Convenience methods (fire and forget)
    activateUser,
    deactivateUser,
    deleteUser,
    promoteUser,
    demoteUser,

    // Async versions (returns promise)
    activateUserAsync,
    deactivateUserAsync,
    deleteUserAsync,
    promoteUserAsync,
    demoteUserAsync,

    // Loading state
    isLoading: userActionMutation.isPending,

    // Error state
    isError: userActionMutation.isError,
    error: userActionMutation.error,
  };
}

// Hook for batch user operations
export function useBatchUserActions() {
  const queryClient = useQueryClient();

  const batchActionMutation = useMutation<
    { success: boolean; results: Array<{ userId: string; success: boolean; error?: string }> },
    Error,
    { userIds: string[]; action: UserAction }
  >({
    mutationFn: async ({ userIds, action }) => {
      const response = await fetch(`/api/admin/users/batch/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${action} users`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all user queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });

  return {
    batchAction: batchActionMutation.mutate,
    batchActionAsync: batchActionMutation.mutateAsync,
    isLoading: batchActionMutation.isPending,
    isError: batchActionMutation.isError,
    error: batchActionMutation.error,
  };
}
