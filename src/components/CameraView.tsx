import { ActivityIndicator, Alert, FlatList, Image, Linking, Platform, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Camera, PhotoFile, Point, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import CustomButton from './CustomButton'
import { colors } from '../styles/colors'
import Close from "../assets/icons/close-light.svg"
import FlashOff from "../assets/icons/flash-off.svg"
import FlashOn from "../assets/icons/flash-on.svg"
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Check from "../assets/icons/check.svg"
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
    const device = useCameraDevice('back')
    const [flash, setFlash] = useState(false)
    const [cameraReady, setCameraReady] = useState(false);
    const [hideCamera, setHideCamera] = useState(false)
    const [multipleAttachments, setMultipleAttachments] = useState(false)
    const insets = useSafeAreaInsets();
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
        if(capturedAttachments.length) {
          let updatedAttachments = capturedAttachments.slice(0, -1)
          setCapturedAttachments(updatedAttachments)
          if(updatedAttachments.length === 0) {
            setCameraReady(true)
          }
          
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
    <SafeAreaView style={{flex: 1, borderWidth: 2, backgroundColor: "black"}}>
          <View>
            <View style={styles.attachmentActionsContainer}>
              {capturedAttachments.length >= 1 && <Text style={styles.attachmentCount}>{capturedAttachments.length}</Text>}
              {capturedAttachments.length > 0 && <CustomButton onPress={handleSaveAttachments} buttonStyle={styles.proceed} textStyle={{color: "white"}} icon={<ArrowRight color='white' width={15} height={15} />} />}
            </View>
            {/* <FlatList renderItem={({item, index}) => (<CapturedItem item={item} index={index} />)} data={capturedAttachments} keyExtractor={(item) => item.path} /> */}
            
            
          </View>
          {!hideCamera && <GestureDetector gesture={gesture}>
            <View style={StyleSheet.absoluteFill}>
              <Camera
                ref={camera}
                resizeMode={"contain"}
                style={[styles.absoluteFill, { top: insets.top }]}
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
            </View>
          </GestureDetector>}

              
            {(!cameraReady && capturedAttachments.length > 0) && (
              <Pinchable>
                <Image
                  resizeMode="contain"
                  style={styles.capturedPhoto}
                  source={{ uri: `file://${capturedAttachments[capturedAttachments.length - 1]?.path}` }}
                />
              </Pinchable>
            )}

          

          
        
        <View style={styles.cameraButtonsContainer}>
            <CustomButton onPress={handleDeleteAttachment} icon={<Close width={35} height={35} />} />
            {cameraReady && <View style={styles.captureButtonContainer}>
                <CustomButton buttonStyle={styles.captureButton} onPress={capturePhoto} />
            </View>} 
            {!cameraReady && <CustomButton onPress={handleAddMultipleAttachments} icon={<Check width={26} height={26} />} />}
 
            {cameraReady && (
              flash ? (
                <CustomButton
                  onPress={() => setFlash(false)}
                  icon={<FlashOn fill="white" width={30} height={30} />}
                />
              ) : (
                <CustomButton
                  onPress={() => setFlash(true)}
                  icon={<FlashOff fill="white" width={30} height={30} />}
                />
              )
            )}

        </View>

    </SafeAreaView>
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
    },
    capturedPhoto: {
      height: "100%",
      width: "100%"
    },
    attachmentActionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      position: "absolute",
      top: 50,
      height: "auto",
      borderWidth: 1,
 /*      borderColor: "red", */
      width : "90%",
      marginHorizontal: "5%",
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
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
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
      zIndex: 10,
    },
    
})