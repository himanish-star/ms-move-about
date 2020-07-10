import React, { useState, useEffect } from 'react';
import {AsyncStorage, Image, Platform, Vibration} from 'react-native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';

import Screens from './navigation/Screens';
import { Images, articles, argonTheme } from './constants';
import * as Font from "expo-font";
import Constants from 'expo-constants';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';
import firebaseConfig from "./firebaseConfig.json";
import * as firebase from 'firebase';
import {EventRegister} from "react-native-event-listeners";

firebase.initializeApp(firebaseConfig);

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo
];

// TODO: make actual setup of uid and login :)
const currentUser = "soumyam";

// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    fontLoaded: false,
    expoPushToken: null,
    notification: {},
  }

  async componentDidMount() {
    this.registerForPushNotificationsAsync();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    await Font.loadAsync({
      'roboto-medium': require('./screens/fonts/Roboto/Roboto-Medium.ttf')
    });
    this.setState({fontLoaded: true});
  }

  _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
    if(notification.origin==="selected") {
      EventRegister.emit("push-notification-data", notification.data);
      AsyncStorage.setItem("push-notification-data", JSON.stringify(notification.data));
    }
    this.setState({ notification: notification });
  };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Push Notifications Disabled');
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
      let updates = {};
      updates['/expoToken'] = token
      firebase.database().ref('users').child(currentUser).update(updates);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  render() {
    if(!this.state.isLoadingComplete || !this.state.fontLoaded) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={argonTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}
