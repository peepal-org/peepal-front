import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

export const LOCATION_TASK_NAME = "background-location-task";
const PROXIMITY_THRESHOLD_METERS = 500; // notif if toilet location < 500m

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

  // TODO: get toilet from cache
  // notif test
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Peepal 🚻",
      body: "Des toilettes sont disponibles près de vous !",
    },
    trigger: null,
  });
});
