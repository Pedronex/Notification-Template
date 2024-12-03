import { useState, useEffect, useRef } from "react";
import { Text, View, Button } from "react-native";
import type { EventSubscription, Notification } from "expo-notifications";
import * as Notifications from "expo-notifications";
import { SendNotifications } from "@/functions/sendNotifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export default function App() {
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<EventSubscription>();
  const responseListener = useRef<EventSubscription>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification)
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Title: {notification?.request.content.title} </Text>
        <Text>Body: {notification?.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          const notifications = new SendNotifications()
          notifications.sendNotification(
            'Notificação',
            'Corpo da notificação',
            { key: 'value' }
          )
        }}
      />
    </View>
  );
}
