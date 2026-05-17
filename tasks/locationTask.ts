import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import type { Toilet } from "@/types/ui/Toilet";

export const LOCATION_TASK_NAME = "background-location-task";
export const TOILETS_CACHE_KEY = "TOILETS_CACHE_KEY";
export const LAST_NOTIF_KEY = "LAST_NOTIF_KEY";

const PROXIMITY_THRESHOLD_METERS = 500;
const COOLDOWN_MS = 5 * 60 * 1000;

function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("[LocationTask] erreur:", error.message);
    return;
  }

  const { locations } = data as { locations: Location.LocationObject[] };
  const coords = locations[0]?.coords;
  if (!coords) return;

  const [toiletsRaw, lastNotifRaw] = await Promise.all([
    AsyncStorage.getItem(TOILETS_CACHE_KEY),
    AsyncStorage.getItem(LAST_NOTIF_KEY),
  ]);

  const toilets: Toilet[] = toiletsRaw ? JSON.parse(toiletsRaw) : [];
  const lastNotif = lastNotifRaw ? parseInt(lastNotifRaw, 10) : 0;

  if (Date.now() - lastNotif < COOLDOWN_MS) return;

  const count = toilets.filter(
    (t) =>
      t.statut === "accepted" &&
      getDistanceInMeters(
        coords.latitude,
        coords.longitude,
        t.latitude,
        t.longitude,
      ) <= PROXIMITY_THRESHOLD_METERS,
  ).length;

  if (count === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Peepal 🚻",
      body: `Il y a ${count} toilette(s) autour de toi`,
    },
    trigger: null,
  });

  await AsyncStorage.setItem(LAST_NOTIF_KEY, Date.now().toString());
});
