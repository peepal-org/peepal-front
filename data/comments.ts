import type { Comment } from "@/types/Comment";

let comments: Comment[] = [
  {
    id: "1",
    toiletId: "1",
    userId: "user_1",
    rating: 5,
    content:
      "Toilettes très propres et bien entretenues. Accès facile, je me suis sentie en sécurité.",
    createdAt: "2025-12-01T10:00:00.000Z",
    dateLabel: "Il y a 2 semaines",
  },
  {
    id: "2",
    toiletId: "1",
    userId: "user_2",
    rating: 4,
    content:
      "Globalement propre et accessible, mais l’éclairage pourrait être amélioré.",
    createdAt: "2025-11-20T09:00:00.000Z",
    dateLabel: "Il y a 1 mois",
  },
  {
    id: "3",
    toiletId: "2",
    userId: "user_3",
    rating: 3,
    content: "Correct, mais un peu sale en fin de journée.",
    createdAt: "2025-12-08T18:30:00.000Z",
    dateLabel: "Il y a 3 jours",
  },
];

export function getCommentsForToilet(toiletId: string): Comment[] {
  return comments.filter((c) => c.toiletId === toiletId);
}

export function addCommentForToilet(params: {
  toiletId: string;
  userId: string;
  rating: number;
  content: string;
}): Comment {
  const now = new Date();
  const newComment: Comment = {
    id: String(comments.length + 1),
    toiletId: params.toiletId,
    userId: params.userId,
    rating: params.rating,
    content: params.content,
    createdAt: now.toISOString(),
    dateLabel: "À l’instant",
  };

  comments = [newComment, ...comments];
  return newComment;
}
