import type { User } from "@/types/User";

export function getUserById(userId: string) {
  return users.find((u) => u.id === userId);
}

export const users: User[] = [
  {
    id: "user_1",
    name: "Sophia Clark",
    email: "sophia@example.com",
    createdAt: "2025-01-10T10:00:00.000Z",
    role: "user",
    photoUrl:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    points: 120,
    level: 3,
  },
  {
    id: "user_2",
    name: "Ethan Miller",
    email: "ethan@example.com",
    createdAt: "2025-01-05T09:00:00.000Z",
    role: "user",
    photoUrl:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    points: 80,
    level: 2,
  },
  {
    id: "user_3",
    name: "Alex Dupont",
    email: "alex@example.com",
    createdAt: "2025-01-01T12:00:00.000Z",
    role: "user",
    // pas de photoUrl → fallback
    points: 30,
    level: 1,
  },
];
