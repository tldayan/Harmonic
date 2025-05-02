import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../../ModalsHeader'
import CustomButton from '../../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../../../styles/button-styles'
import { colors } from '../../../styles/colors'
import TaskInformation from './TaskInformation'
import { getWorkPriorities, saveWorkOrder, saveWorkOrderAttachments, saveWorkRequestNote } from '../../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import ProgressBar from '../../../components/ProgressBar'
import { TaskInformationState } from '../../../types/work-order.types'
import TaskUserInfo from '../TaskUserInfo'
import ReviewTask from '../ReviewTask'
import { firebaseStoragelocations, STATUS_CODE } from '../../../utils/constants'
import { uploadDocuments } from '../../../utils/helpers'
import TaskDocumentUpload from '../TaskDocumentUpload'

interface WorkOrderCreationProps {
    onClose: () => void
}

const width = Dimensions.get("window").width

const steps = [
   {id: "1", title : "Task Information"},
   {id: "2", title : "Additional Information"},
   {id: "3", title : "Task requested by"},
   {id: "4", title : "Review and submit"},
]



export default function WorkOrderCreation({onClose} : WorkOrderCreationProps) {

    const [step, setStep] = useState(0)
    const [workPriorities, setWorkPriorities] = useState<WorkPriority[]>()
    const [taskInformation, setTaskInformation] = React.useState<TaskInformationState>({
        workOrderUUID: "",
        asset: { assetName: '', assetUUID: '' },
        workOrderType: { workOrderTypeName: '', workOrderTypeUUID: '' },
        problemDescription: '',
        taskDescription: '',
        workPriority: {workPriorityUUID: "", workPriorityName: ""},
        images: [],
        attachments: [],
        attachmentCount: 0,
        attachmentDescription: '',
        creatorName: '',
        creatorEmail: '',
        creatorNumber: '',
        creatorLocation: '',
        loading: false
      });
      

    const {organizationUUID, userUUID} = useSelector((state: RootState) => state.auth)

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


    function stepOne(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskInformation taskInformation={taskInformation} setTaskInformation={setTaskInformation} priorityOptions={workPriorities}/>            
            </View>
        )

    }
    
    function stepTwo(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskDocumentUpload setTaskInformation={setTaskInformation} taskInformation={taskInformation} />
            </View>
        )

    }

    function stepThree(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskUserInfo setTaskInformation={setTaskInformation} taskInformation={taskInformation} />
            </View>
        )

    }

    function stepFour(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <ReviewTask setStep={setStep} taskInformation={taskInformation} />
            </View>
        )

    }
    
    const next = async() => {
            setTaskInformation((prev) => ({...prev, loading : true}))

        try {

        if(step === 0) {
            const saveWorkOrderRequest = await saveWorkOrder(userUUID, organizationUUID, taskInformation)
            if(saveWorkOrderRequest.Status === STATUS_CODE.SUCCESS) {
                const workOrderUUID = saveWorkOrderRequest.Payload.WorkOrderUUID
                setTaskInformation((prev) => ({...prev, workOrderUUID: workOrderUUID, loading: false}))
            } /* else {
                return
            } */
        } else if(step === 1) {
            const prevAttachmentCount = taskInformation.attachmentCount
            
            if(taskInformation.attachments.length !== prevAttachmentCount) {

                const firebaseAttachmentUrls = await uploadDocuments(taskInformation.attachments,firebaseStoragelocations.workOrder)
                /* await saveWorkRequestNote(userUUID, taskInformation.workOrderUUID , taskInformation.attachmentDescription) */
                console.log(firebaseAttachmentUrls)
                const saveWorkOrderRequest = await saveWorkOrderAttachments(userUUID, taskInformation.workOrderUUID, firebaseAttachmentUrls)
            }

            setTaskInformation((prev) => ({...prev, attachmentCount: prev.attachments.length}))

        } else if(step === 2) {

            if(!taskInformation.creatorEmail || !taskInformation.creatorName || !taskInformation.creatorNumber) {
                return
            }

        }

        } catch(err) {
            console.log(err)
        } finally {
            setTaskInformation((prev) => ({...prev, loading : false}))
        }

        

        setStep((prev) => prev + 1)
    }

    useEffect(() => {
        flatListRef.current?.scrollToIndex({index: step})
    }, [step])

    const back = () => {
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
            renderItem={({item, index}) => index === 0 ? stepOne(index) : index === 1 ? stepTwo(index) : index === 2 ? stepThree(index) : stepFour(index) }
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
/*         borderWidth: 1, */
        alignItems: "center",
        width: "90%",
        alignSelf: "center",
        paddingVertical: 20
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
    }
})