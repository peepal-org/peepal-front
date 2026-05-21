export type BadgeRarity = "bronze" | "silver" | "gold";

export type Badge = {
  id: string;
  name: string;
  description: string;
  image?: string;
  rarity: BadgeRarity;
  minPoints: number;
  obtained: boolean;
};
