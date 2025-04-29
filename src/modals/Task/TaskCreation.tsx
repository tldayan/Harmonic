import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../ModalsHeader'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../../styles/button-styles'
import { colors } from '../../styles/colors'
import TaskInformation from './TaskInformation'
import { getWorkPriorities } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import UploadSection from './TaskImageUpload'
import ProgressBar from '../../components/ProgressBar'
import TaskImageUpload from './TaskImageUpload'
import { TaskInformationState } from '../../types/work-order.types'
import TaskUserInfo from './TaskUserInfo'
import ReviewTask from './ReviewTask'

interface TaskCreationProps {
    onClose: () => void
}

const width = Dimensions.get("window").width

const steps = [
   {id: "1", title : "Task Information"},
   {id: "2", title : "Additional Information"},
   {id: "3", title : "Task requested by"},
   {id: "4", title : "Review and submit"},
]

const priorityOptions = [
    { id: "high", label: "High", selected: true },
    { id: "medium", label: "Medium", selected: false },
    { id: "low", label: "Low", selected: false },
    { id: "lowest", label: "Lowest", selected: false },
  ];



export default function TaskCreation({onClose} : TaskCreationProps) {

    const [step, setStep] = useState(0)
    const [workPriorities, setWorkPriorities] = useState<WorkPriority[]>()
    const [taskInformation, setTaskInformation] = React.useState<TaskInformationState>({
        asset: { assetName: '', assetUUID: '' },
        workOrderType: { workOrderTypeName: '', workOrderTypeUUID: '' },
        taskDescription: '',
        workPriority: {workPriorityUUID: "", workPriorityName: ""},
        images: [],
        imageDescription: '',
        creatorName: '',
        creatorEmail: '',
        creatorNumber: '',
        creatorLocation: '',
        loading: false
      });
      

    const {organizationUUID} = useSelector((state: RootState) => state.auth)

    const flatListRef = useRef<FlatList<any>>(null)


    useEffect(() => {

        const fetchWorkPriorities = async() =>  {
            const workPriorities = await getWorkPriorities(organizationUUID)
            console.log(workPriorities)
            setWorkPriorities(workPriorities.Payload)
        }

        fetchWorkPriorities()

    }, [])

    useEffect(() => {

        console.log(taskInformation)
    }, [taskInformation])


    function stepOne() {

        return (
            <View style={styles.innerContainer}>
                <Text>1. Task Information</Text>
                <TaskInformation taskInformation={taskInformation} setTaskInformation={setTaskInformation} priorityOptions={workPriorities}/>            
            </View>
        )

    }
    
    function stepTwo() {

        return (
            <View style={styles.innerContainer}>
                <Text>2. Additional Information</Text>
                <TaskImageUpload setTaskInformation={setTaskInformation} taskInformation={taskInformation} />
            </View>
        )

    }

    function stepThree() {

        return (
            <View style={styles.innerContainer}>
                <Text>3. Task requested by</Text>
                <TaskUserInfo setTaskInformation={setTaskInformation} taskInformation={taskInformation} />
            </View>
        )

    }

    function stepFour() {

        return (
            <View style={styles.innerContainer}>
                <Text>4. Review</Text>
                <ReviewTask taskInformation={taskInformation} />
            </View>
        )

    }
    
    const next = () => {

        flatListRef.current?.scrollToIndex({index: step + 1})
        setStep((prev) => prev + 1)

    }
    const back = () => {

        flatListRef.current?.scrollToIndex({index: step - 1})
        setStep((prev) => prev - 1)

    }



  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title={"Create Task"} />

        <ProgressBar width={"90%"} max={steps.length} value={step + 1} />    
    
        <FlatList
            ref={flatListRef}
            style={styles.mainCreateTaskForm} 
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            data={steps}
            horizontal
            pagingEnabled
            renderItem={({item, index}) => index === 0 ? stepOne() : index === 1 ? stepTwo() : index === 2 ? stepThree() : stepFour() }
        />

        <View style={styles.formButtonsContainer}>
            {step >= 1 && <CustomButton onPress={back} textStyle={{color: "black"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.backButton]} title={"Back"} />}
            {taskInformation.loading ? <ActivityIndicator style={{marginLeft: "auto"}} size={"large"} /> : <CustomButton onPress={next} textStyle={{color: "white"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.nextButton]} title={step <= 2 ? "Next" : "Request Task"} />}
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
        padding: 16,
/*         borderWidth: 2, */
        width: width
    },
    mainCreateTaskForm: {
        marginTop: 15,
        height: 100
    },
    formButtonsContainer: {
        flexDirection: "row", 
        justifyContent:"space-between",
        borderWidth: 1,
        width: "90%",
        alignSelf: "center"
    },
    backButton: {
        paddingHorizontal: 20,
        borderColor: colors.BORDER_COLOR,
        borderWidth: 1,
        backgroundColor: "white"
    },
    nextButton: {
        paddingHorizontal: 20,
        borderColor: colors.BORDER_ORANGE,
        borderWidth: 1,
        marginLeft: "auto"
    }
})