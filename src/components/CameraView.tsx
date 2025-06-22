import { ActivityIndicator, Alert, FlatList, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, CameraPosition, PhotoFile, Point, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import Close from "../assets/icons/close-light.svg"
import CameraSwitch from "../assets/icons/switch-camera.svg"
import FlashOff from "../assets/icons/flash-off.svg"
import FlashOn from "../assets/icons/flash-on.svg"
import { SafeAreaView } from 'react-native-safe-area-context'
import Check from "../assets/icons/check-2.svg"
import ArrowRight from "../assets/icons/arrow-right.svg"
const Pinchable = require('react-native-pinchable').default;


interface CameraViewProps {
  capturedAttachments: (PhotoFile)[];
  setCapturedAttachments: React.Dispatch<React.SetStateAction<(PhotoFile)[]>>;
  setShowCamera: React.Dispatch<React.SetStateAction<boolean>>;
}
  

export default function CameraView({setShowCamera, capturedAttachments, setCapturedAttachments} : CameraViewProps) {

    const camera = useRef<Camera>(null)
    const { hasPermission, requestPermission } = useCameraPermission()
    const [cameraPosition, setCameraPosition] = useState<CameraPosition>("back")
    const device = useCameraDevice(cameraPosition)
    const [flash, setFlash] = useState(false)
    const [cameraReady, setCameraReady] = useState(false);
    const [hideCamera, setHideCamera] = useState(false)
    const [multipleAttachments, setMultipleAttachments] = useState(false)
    const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);


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



      const focus = useCallback((point: Point) => {
        console.log("fpcis")
        const c = camera.current
        if (c == null) return
        c.focus(point)
      }, [])
    
      const gesture = useMemo(() =>
        Gesture.Tap()
          .runOnJS(true)
          .onEnd(({ x, y }) => {
            focus({ x, y });   
            setFocusPoint({ x, y });
      
            setTimeout(() => {
              setFocusPoint(null);
            }, 1000);
          }),
        [focus]
      );
      
      
      const handleSaveAttachments = () => {
        setShowCamera(false)
      }


      const handleDeleteAttachment = () => {

        if(capturedAttachments.length === 1) {
          setCapturedAttachments([])
          setShowCamera(false)
          return
        } else if(capturedAttachments.length >= 2) {
          setShowCamera(false)
          return
        } else {
          setShowCamera(false)
          setCameraReady(true)
        }
      }

      const handleAddMultipleAttachments = () => {
        if(!multipleAttachments) {
          setMultipleAttachments(true)
          
        }
        setCameraReady(true)
        setHideCamera(false)
      }
      
      useEffect(() => {
        console.log(capturedAttachments)
      }, [capturedAttachments])

      const capturePhoto = async () => {
        if (!cameraReady) return;

        try {
          const capturedPhoto = await camera.current?.takePhoto({ flash: flash ? "on" : "off" })
          if(capturedPhoto) {
            setCapturedAttachments((prev) => [...prev, capturedPhoto]);
            setHideCamera(true)
          }
        } catch (err) {
          console.error("Error taking photo:", err)
        } finally {
          setCameraReady(false)
        }
      }
      

      if (device == null) return 


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "black"}}>
            <View style={styles.attachmentActionsContainer}>
              {capturedAttachments.length >= 1 && <CustomButton onPress={() => setShowCamera(false)} title={capturedAttachments.length} textStyle={styles.attachmentCount} />}
              {capturedAttachments.length > 0 && <CustomButton onPress={handleSaveAttachments} buttonStyle={styles.proceed} textStyle={{color: "white"}} icon={<ArrowRight color='white' width={15} height={15} />} />}
            </View>

          {!hideCamera && <GestureDetector gesture={gesture}>
            <View style={styles.cameraContainer}>
              <Camera
                ref={camera}
                resizeMode={"contain"}
                style={styles.absoluteFill}
                device={device}
                isActive={true}
                onInitialized={() => setCameraReady(true)}
                photo={true}
                photoQualityBalance="quality"
              />
              {focusPoint && (
                <View
                  style={[
                    styles.focusCircle,
                    {
                      left: focusPoint.x - 25,
                      top: focusPoint.y - 25,
                    },
                  ]}
                />
              )}
              {cameraReady && (
              flash ? (
                <CustomButton buttonStyle={[styles.buttonStyles, styles.flash, {padding: 10}]}
                  onPress={() => setFlash(false)}
                  icon={<FlashOn fill="white" width={20} height={20} />}
                />
              ) : (
                <CustomButton buttonStyle={[styles.buttonStyles, styles.flash,styles.flashoff, {padding: 10}]}
                  onPress={() => setFlash(true)}
                  icon={<FlashOff fill="white" width={20} height={20} />}
                />
              )
            )}
            </View>
          </GestureDetector>}

          {(!cameraReady && capturedAttachments.length > 0) && (<View style={styles.imageContainer}>
                <Pinchable>
                  <Image
                    resizeMode="contain"
                    style={styles.capturedPhoto}
                    source={{ uri: `file://${capturedAttachments[capturedAttachments.length - 1]?.path}` }}
                  />
                </Pinchable>
            </View>)}

          
        
        <View style={styles.cameraButtonsContainer}>
            <CustomButton buttonStyle={styles.buttonStyles} onPress={handleDeleteAttachment} icon={<Close width={20} height={20} />} />
            {cameraReady && <View style={styles.captureButtonContainer}>
                <CustomButton buttonStyle={styles.captureButton} onPress={capturePhoto} />
            </View>} 
            {!cameraReady && <CustomButton buttonStyle={styles.buttonStyles} onPress={handleAddMultipleAttachments} icon={<Check color='white' width={20} height={20} />} />}
            {cameraReady && <CustomButton buttonStyle={styles.buttonStyles} onPress={() => setCameraPosition((prev) => prev === "back" ? "front" : "back")} icon={<CameraSwitch color='white' width={20} height={20} />} />}

        </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cameraContainer: {
      flex: 1,
      margin: 10,
/*       borderWidth :2,
      borderColor: "red", */
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
  },
    absoluteFill : {
      flex: 1,
      resizeMode: "cover"
/*       position: "relative", */
    },
    cameraButtonsContainer: {
/*         borderWidth :2,
        borderColor: "red", */
        height: "15%",
        marginTop: "auto",
        marginBottom: "5%",
        justifyContent: "space-around",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
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
    },
    imageContainer: {
      flex : 1,
      borderWidth: 2,
      borderColor : "green"
    },
    capturedPhoto: {
/*       borderWidth: 11,
      borderColor : "green", */
      
      height: "100%",
      width: "100%"
    },
    attachmentActionsContainer: {
      
      flexDirection: "row",
      alignItems: "center",
/*       position: "absolute",
      top: 50, */
      borderWidth: 1,
      borderColor: "aqua",
      width : "100%",
      padding: 20,
      zIndex: 1
    },
    proceed: {
      backgroundColor: colors.ACTIVE_ORANGE,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 3,
      marginLeft: "auto"
    },
    attachmentCount: {
      borderWidth: 2,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      borderColor: colors.ACTIVE_ORANGE,
      color: colors.ACTIVE_ORANGE,
      fontWeight: "bold"
    },
    focusCircle: {
      position: 'absolute',
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: 'white',
      backgroundColor: 'transparent',
      zIndex: 1,
    },
    buttonStyles: {
      borderWidth: 1,
  /*     backgroundColor: colors.ACTIVE_ORANGE, */
      borderColor: colors.ACTIVE_ORANGE,
      borderRadius: 50,
      padding: 13
    },
    flash: {
      position: "absolute",
      bottom: 10,
      right: 10,
      zIndex: 2,
      borderColor: "transparent"
    },
    flashoff: {
      backgroundColor : "transparent",
      borderColor: colors.ACTIVE_ORANGE
    }
})