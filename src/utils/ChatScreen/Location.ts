import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';


export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
  mocked?: boolean;
} | null> => {

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const mocked = (position.coords as any)?.mocked;
        console.log('User location:', latitude, longitude, 'Mocked:', mocked);
        resolve({ latitude, longitude, mocked });
      },
      error => {
        console.warn('Location error:', error);

        switch (error.code) {
          case 1:
            Alert.alert(
              'Permission Denied',
              'Please enable location permission for this app in settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
            break;

            case 2:
            Alert.alert(
              'Location Unavailable',
              'Your GPS seems to be off. Please enable it in device settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: () => {
                    if (Platform.OS === 'android') {
                      Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
                    } else {
                      Linking.openSettings();
                    }
                  },
                },
              ]
            );
            break;

          case 3: 
            Alert.alert(
              'Location Timeout',
              'We could not get your location. Try again or move to a place with better signal.',
              [{ text: 'OK' }]
            );
            break;

          default:
            Alert.alert('Location Error', error.message || 'Unknown error');
        }

        reject(error);
      },
      Platform.OS === "ios" ? {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      } : {}
    );
  });
};

export const getLocation = async(setLocationLoading : (value: boolean) => void) => {
    setLocationLoading(true)
    try {
      const location  = await getCurrentLocation()
      console.log(location)
      if(location) {
        Alert.alert("Send location?", "Are you sure you want to send your location?",[
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Send',
            onPress: () => {
              console.log('Sending location:', location);
            },
          },
        ],
        { cancelable: true })
      }
    } catch(err) {
      console.log(err)
    } finally {
      setLocationLoading(false)
    }

  }