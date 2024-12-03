import type { MessageNotification } from "@/types";
import { isDevice } from "expo-device";
import Constants from "expo-constants";
import {
  setNotificationChannelAsync,
  AndroidImportance,
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
} from "expo-notifications";
import { Alert, Platform } from "react-native";

export class SendNotifications {

  private async RegistrationNotification() {
    if (Platform.OS === "android") {
      setNotificationChannelAsync("default", {
        name: "default",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (isDevice) {
      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        this.handleError("Notificações não permitidas!");
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        this.handleError("Projeto não está publicado.");
      }
      try {
        const pushTokenString = (
          await getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        this.handleError(`${e}`);
      }
    } else {
      this.handleError("Must use physical device for push notifications");
    }
  }

  private handleError(errorMessage: string) {
    Alert.alert(errorMessage);
    throw new Error(errorMessage);
  }

  public async sendNotification(title: string, body: string, data: unknown) {
    const token = await this.RegistrationNotification()

    const message: MessageNotification = {
      to: token,
      sound: "default",
      title: title,
      body: body,
      data: data,
    };

    console.log(message);

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const content = await response.json();

    console.log(content);

    return content;
  }
}
