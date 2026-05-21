import { LOCATION_TASK_NAME } from "@/tasks/locationTask";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useLocationNotifications(enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      stopLocationTask();
      return;
    }

    startLocationTask();

    return () => {
      stopLocationTask();
    };
  }, [enabled]);
}

async function startLocationTask() {
  console.log("[LocationNotifications] starting...");
  try {
    //  Permission notifications
    const { status: notifStatus } =
      await Notifications.requestPermissionsAsync();
    console.log("[LocationNotifications] notif permission:", notifStatus);
    if (notifStatus !== "granted") return;

    //  Permission foreground
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    console.log("[LocationNotifications] fg permission:", fgStatus);
    if (fgStatus !== "granted") return;

    //  Permission background
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    console.log("[LocationNotifications] bg permission:", bgStatus);
    if (bgStatus !== "granted") return;

    // Start tas
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME,
    ).catch(() => false);
    if (isRunning) return;

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      // distanceInterval: 100, // every 100m
      distanceInterval: 0, // when you move
      showsBackgroundLocationIndicator: true, // for iOS
      foregroundService: {
        // Android
        notificationTitle: "Peepal actif",
        notificationBody: "Recherche de toilettes à proximité...",
      },
    });
    console.log("[LocationNotifications] task started ✅");
  } catch (err) {
    console.error("[useLocationNotifications] erreur:", err);
  }
}

async function stopLocationTask() {
  try {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME,
    ).catch(() => false);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  } catch (err) {
    console.error("[useLocationNotifications] stop erreur:", err);
  }
}
