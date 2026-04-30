import { apiFetch } from '@/functions/api';
import type { ApiComment } from '@/types/api/ApiComment';
import type { ApiReport } from '@/types/api/ApiReport';
import type { ApiToilet } from '@/types/api/ApiToilet';
import type { ApiUser } from '@/types/api/ApiUser';

export type AdminOverview = {
  totals: {
    users: number;
    admins: number;
    toilets: number;
    pendingToilets: number;
    comments: number;
    reports: number;
  };
};

export function fetchAdminOverview() {
  return apiFetch<AdminOverview>('/admin/overview');
}

export function fetchAdminUsers() {
  return apiFetch<ApiUser[]>('/admin/users');
}

export function fetchAdminToilets() {
  return apiFetch<ApiToilet[]>('/admin/toilets');
}

export function fetchAdminComments() {
  return apiFetch<ApiComment[]>('/admin/comments');
}

export function fetchAdminReports() {
  return apiFetch<ApiReport[]>('/admin/reports');
}

export function updateAdminUserType(
  id: number,
  type: 'user' | 'admin',
) {
  return apiFetch<ApiUser>(`/admin/users/${id}/type`, {
    method: 'PATCH',
    body: JSON.stringify({ type }),
  });
}
