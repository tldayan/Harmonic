import { ActivityIndicator, Alert, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { RootState } from '../../store/store'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { PRIMARY_BUTTON_STYLES } from '../../styles/button-styles'
import { Details } from './Details'
import { EventInformation, FormErrors } from '../../types/event.types'
import { Timings } from './Timings'
import { Guests } from './Guests'
import { publishEvent, saveEventConfiguration, saveEventDetails, saveEventSchedule } from '../../api/network-utils'
import { uploadDocuments } from '../../utils/helpers'
import { firebaseStoragelocations, STATUS_CODE } from '../../utils/constants'
import { EventSummary } from './EventSummary'
import Toast from 'react-native-toast-message'


interface EventCreationProps {
    onClose: () => void
    fetchEventsList?: (value: boolean) => void
}

const width = Dimensions.get("window").width

const steps = [
   {id: "1", title : "Details"},
   {id: "2", title : "Time & Location"},
   {id: "3", title : "Guests"},
   {id: "4", title : "Review and submit"},
]



export default function EventCreation({onClose,fetchEventsList} : EventCreationProps) {
      const route = useRoute()
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [step, setStep] = useState(0)
    const [eventInformation, setEventInformation] = React.useState<EventInformation>({
        eventUUID: "",
        eventName: "",
        createdBy: "",
        eventType: { eventTypeName: '', eventTypeUUID: '' },
        participants: [],
        eventDescription: '',
        scheduledPublishDateTime: "",
        registrationStartDateTime: "",
        registrationEndDateTime: "",
        eventStartDateTime: "",
        eventEndDateTime: "",
        eventBanner: [],
        loading: false
      });

      const [formErrors, setFormErrors] = React.useState<FormErrors>({});

      
      

    const {organizationUUID, userUUID} = useSelector((state: RootState) => state.auth)

    const flatListRef = useRef<FlatList<any>>(null)


    function stepOne(index: number) {

        return (
            <View style={styles.innerContainer}>
                
                <Details setFormErrors={setFormErrors} formErrors={formErrors} eventInformation={eventInformation} setEventInformation={setEventInformation} />
            </View>
        )

    }
    
    function stepTwo(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Timings eventInformation={eventInformation} setEventInformation={setEventInformation}/>
            </View>
        )

    }

    function stepThree(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Guests eventInformation={eventInformation} setEventInformation={setEventInformation} />
            </View>
        )

    }

    function stepFour(index: number) {

        return (
            <View style={styles.innerContainer}>
                <EventSummary eventInformation={eventInformation} />
            </View>
        )

    }

    
    const next = async() => {

        if (step === 0) {
            let hasError = false;
            const newErrors: FormErrors = {};
          
            if (!eventInformation.eventName) {
              newErrors.eventName = { hasError: true };
              hasError = true;
            }
          
            if (!eventInformation.eventDescription) {
              newErrors.eventDescription = { hasError: true };
              hasError = true;
            }

            if (!eventInformation.eventBanner.length) {
              newErrors.eventBanner = { hasError: true };
              hasError = true;
            }
          
            if (!eventInformation.eventType.eventTypeUUID) {
              newErrors.eventType = { hasError: true };
              hasError = true;
            }
          
          
            if (hasError) {
              setFormErrors((prev) => ({ ...prev, ...newErrors }));
              return;
            }
          
          }


          if (step === 1) {
            if (!eventInformation.eventStartDateTime || !eventInformation.eventEndDateTime) {
              Toast.show({
                type: 'error',
                text1: 'Event timing missing',
                text2: 'Please fill in both start and end date/time fields.',
                position: "bottom"
              });
              return;
            }
        
          }
          

        if(step === 3 && eventInformation.eventName) {
            console.log("cam here")
            setEventInformation((prev) => ({...prev, loading: true}))
            try {
                
                const uploadedBanner = await uploadDocuments(eventInformation.eventBanner, firebaseStoragelocations.event)
                const eventBannerUrl = uploadedBanner[0].url
                console.log(eventBannerUrl)
                const saveEventDetailsResponse = await saveEventDetails(userUUID, organizationUUID,eventBannerUrl, eventInformation)
                const {EventUUID} = saveEventDetailsResponse.Payload
                console.log("eventUUID", EventUUID)
                const updatedEventInfo = {...eventInformation, eventUUID: EventUUID}
                setEventInformation(updatedEventInfo)
                const saveEventConfigResponse = await saveEventConfiguration(userUUID, updatedEventInfo)
                const saveEventScheduleResponse = await saveEventSchedule(userUUID, updatedEventInfo)
                const publishEventResponse = await publishEvent(userUUID, updatedEventInfo)
                console.log(publishEventResponse)
                if (publishEventResponse.Payload.Status === STATUS_CODE.ERROR) {
                    throw new Error("Failed to publish event");
                }                
              onClose()

              if(route.name !== "Events") {
                navigation.navigate("Tabs", {
                    screen: "Events",
                });
              } else {
                fetchEventsList?.(true)
              }
              
              
            } catch (err) {
                console.log(err)
            }

        }

        if(step <= 2) {
            setStep((prev) => prev + 1)
        }
    }

    useEffect(() => {
        flatListRef.current?.scrollToIndex({index: step})
    }, [step])

    const back = () => {
        setStep((prev) => prev - 1)
    }



  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title={"Create Event"} />

       {step < 3 && <View style={styles.progressContainer}>
        <View  style={{flexDirection: "row"}}> 
            {steps.map((eachStep, index) => {
                if (eachStep.id === "4") return null;

                const isLastStep = index === steps.length - 2;

                return (
                <React.Fragment key={eachStep.id}>
                    <View style={styles.eachProgress}>
                        <View style={styles.circle}>
                            <View style={[styles.innerCircle, eachStep.id <= (step + 1).toString() ? {backgroundColor : "#FF5A1F"} : null]}></View>
                        </View>
                        <Text style={styles.title}>{eachStep.title}</Text>
                    </View>

                    {!isLastStep && <View style={styles.line} />}
                    
                </React.Fragment>
                );
            })}
            </View>
        </View>}



        <FlatList
            ref={flatListRef}
            style={styles.mainCreateEventForm} 
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            data={steps}
            horizontal
            pagingEnabled
            renderItem={({item, index}) => index === 0 ? stepOne(index) : index === 1 ? stepTwo(index) : index === 2 ? stepThree(index) : stepFour(index)}
        />

        <View style={styles.formButtonsContainer}>
            {step >= 1 && <CustomButton onPress={back} textStyle={{color: "black"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.backButton]} title={"Back"} />}
          {eventInformation.loading ? <ActivityIndicator style={{marginLeft: "auto"}} size={"large"} /> : <CustomButton onPress={next} textStyle={{color: "white"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.nextButton]} title={step <= 2 ? "Next" : "Publish Event"} />}
        </View>
        <Toast />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: "white",
    },
    innerContainer : {
        paddingHorizontal: 16,
/*         borderWidth: 2, */
        width: width
    },
    mainCreateEventForm: {
 /*        borderWidth: 3, */
  /*       marginTop: 15, */
        height: 100
    },
    formButtonsContainer: {
        flexDirection: "row", 
        justifyContent:"space-between",
/*         borderWidth: 1, */
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        paddingVertical: 10
    },
    backButton: {
        paddingHorizontal: 20,
        borderColor: colors.BORDER_COLOR,
        borderWidth: 1,
        marginBottom: 0,
        marginTop: 0,
        backgroundColor: "white"
    },
    nextButton: {
        paddingHorizontal: 20,
        borderColor: colors.BORDER_ORANGE,
        borderWidth: 1,
        marginBottom: 0,
        marginTop: 0,
        marginLeft: "auto"
    },


    progressContainer: {
/*         borderWidth: 1, */
        paddingHorizontal: 5,
        paddingVertical: 20,
        width: "90%",
        marginHorizontal: "5%",
      /*   flexDirection: 'row', */
        justifyContent: "space-between"
    },
    eachProgress: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
      },
    circle: {
        height: 25,
        width: 25,
        backgroundColor: "#FCB9BD",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 50,
        backgroundColor: "white"
    },
    line: {
        height: 2,
        flex: 1,
        alignSelf: "center",
        backgroundColor: colors.LIGHT_COLOR, 
      },
    title: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 12, 
    fontWeight: 500,
    },

})