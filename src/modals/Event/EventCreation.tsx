import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
/* import ProgressBar from '../../../components/ProgressBar' */
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { RootState } from '../../store/store'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { PRIMARY_BUTTON_STYLES } from '../../styles/button-styles'
import { Details } from './Details'
import { EventInformation } from '../../types/event.types'
import { Timings } from './Timings'

interface EventCreationProps {
    onClose: () => void
}

const width = Dimensions.get("window").width

const steps = [
   {id: "1", title : "Details"},
   {id: "2", title : "Time & Location"},
   {id: "3", title : "Guests"},
   {id: "4", title : "Review and submit"},
]



export default function EventCreation({onClose} : EventCreationProps) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [step, setStep] = useState(0)
    const [eventInformation, setEventInformation] = React.useState<EventInformation>({
        eventUUID: "",
        eventName: "",
        createdBy: "",
        eventType: { eventTypeName: '', eventTypeUUID: '' },
        eventDescription: '',
        time: "",
        eventBanner: [],
        loading: false
      });
      
      

    const {organizationUUID, userUUID} = useSelector((state: RootState) => state.auth)

    const flatListRef = useRef<FlatList<any>>(null)


    function stepOne(index: number) {

        return (
            <View style={styles.innerContainer}>
                
                <Details eventInformation={eventInformation} setEventInformation={setEventInformation} />
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
                
                
            </View>
        )

    }

    
    const next = async() => {
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

       <View style={styles.progressContainer}>
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

        </View>



        <FlatList
            ref={flatListRef}
            style={styles.mainCreateEventForm} 
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            data={steps}
            horizontal
            pagingEnabled
            renderItem={({item, index}) => index === 0 ? stepOne(index) : index === 1 ? stepTwo(index) : stepThree(index)}
        />

        <View style={styles.formButtonsContainer}>
            {step >= 1 && <CustomButton onPress={back} textStyle={{color: "black"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.backButton]} title={"Back"} />}
          {eventInformation.loading ? <ActivityIndicator style={{marginLeft: "auto"}} size={"large"} /> : <CustomButton onPress={next} textStyle={{color: "white"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.nextButton]} title={step <= 2 ? "Next" : "Publish Event"} />}
        </View>


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
        marginTop: 15,
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
        padding: 5,
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