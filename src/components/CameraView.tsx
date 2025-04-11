import { ActivityIndicator, Alert, Linking, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, PhotoFile, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import Close from "../assets/icons/close-light.svg"
import FlashOff from "../assets/icons/flash-off.svg"
import FlashOn from "../assets/icons/flash-on.svg"


interface CameraViewProps {
    setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
  }
  

export default function CameraView({setShowCamera} : CameraViewProps) {

    const camera = useRef<Camera>(null)
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice('back')
    const [flash, setFlash] = useState(false)
    const [cameraReady, setCameraReady] = useState(false);
    const [photo, setPhoto] = useState<PhotoFile | null>(null);



    useEffect(() => {
        (async () => {
          if (!hasPermission) {
            const permissionGranted = await requestPermission();
            if (!permissionGranted) {
                setShowCamera(false)
                Alert.alert("Permission denied", "Camera access is required to continue.",
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Open Settings',
                        onPress: () => {
                          if (Platform.OS === 'android') {
                            Linking.openSettings();
                          } else {
                            Linking.openURL('app-settings:');
                          }
                        },
                      },
                    ]
                  )
            }
          }
        })();
      }, [hasPermission]);



      const capturePhoto = async () => {
        if (!cameraReady) return;

        try {
          const capturedPhoto = await camera.current?.takePhoto({ flash: flash ? "on" : "off" })
          if(capturedPhoto) {
            setPhoto(capturedPhoto)
          } else {
            console.log("No photo captured.");
          }

          console.log("Photo taken:", photo)
        } catch (err) {
          console.error("Error taking photo:", err)
        }
      }
      

      if (device == null) return 


  return (
    <View style={{flex: 1}}>
        <Camera
          ref={camera} 
          style={styles.absoluteFill}
          device={device}
          isActive={true}
          onInitialized={() => setCameraReady(true)}
          photo={true}
        /> 
        
        <View style={styles.cameraButtonsContainer}>
            <CustomButton onPress={() => setShowCamera(false)} icon={<Close width={35} height={35} />} />
            <View style={styles.captureButtonContainer}>
                {cameraReady ? <CustomButton buttonStyle={styles.captureButton} onPress={capturePhoto} /> : <ActivityIndicator color={"white"} size={"small"} />}
            </View> 
 
            {flash ? (
                <CustomButton
                onPress={() => setFlash(false)}
                icon={<FlashOn fill="white" width={30} height={30} />}
                />
            ) : (
                <CustomButton
                onPress={() => setFlash(true)}
                icon={<FlashOff fill="white" width={30} height={30} />}
                />
            )}
        </View>

    </View>
  )
}

const styles = StyleSheet.create({
    absoluteFill : {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    cameraButtonsContainer: {
 /*        borderWidth :2,
        borderColor: "red", */
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderRadius: 50,
        position: 'absolute',
        bottom: "5%",
        left: "50%",
        transform: [{ translateX: "-50%" }],
    },
    captureButtonContainer: {
        padding: 8,
        backgroundColor: colors.ACTIVE_ORANGE,
        borderRadius : 50
    },
    captureButton: {
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: "white"
    }
})