import * as Notifications from "expo-notifications";

export const requestNotificationPermissions = async () => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
};

export const fireCleaningReminder = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Session logged!",
      body: "Don't forget to clean your rubbers with a sponge and cleaner to extend their lifespan.",
    },
    trigger: null,
  });
};
