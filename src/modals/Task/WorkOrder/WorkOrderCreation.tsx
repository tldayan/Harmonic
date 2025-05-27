import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../../ModalsHeader'
import CustomButton from '../../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../../../styles/button-styles'
import { colors } from '../../../styles/colors'
import { getWorkPriorities, saveWorkOrder, saveWorkOrderAttachments, saveWorkOrderNote, saveWorkRequestNote } from '../../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import ProgressBar from '../../../components/ProgressBar'
import { WorkOrderInformationState } from '../../../types/work-order.types'
import TaskUserInfo from '../TaskUserInfo'
import ReviewTask from '../ReviewTask'
import { firebaseStoragelocations, STATUS_CODE } from '../../../utils/constants'
import { uploadDocuments } from '../../../utils/helpers'
import TaskDocumentUpload from '../TaskDocumentUpload'
import WorkOrderInformation from './WorkOrderInformation'
import AssignCrew from './AssignCrew'

interface WorkOrderCreationProps {
    onClose: () => void
    workOrder?: WorkOrderDetails | null
}

const width = Dimensions.get("window").width

const steps = [
   {id: "1", title : "Task Information"},
   {id: "2", title : "Additional Information"},
   {id: "3", title : "Task requested by"},
   {id: "4", title : "Assign Crew"},
   {id: "5", title : "Review and submit"},
]



export default function WorkOrderCreation({onClose, workOrder} : WorkOrderCreationProps) {

    const [step, setStep] = useState(0)
    const [workPriorities, setWorkPriorities] = useState<WorkPriority[]>()
    const [workOrderInformation, setWorkOrderInformation] = React.useState<WorkOrderInformationState>({
        workOrderUUID: workOrder?.WorkOrderUUID || "",
        asset: { assetName: workOrder?.AssetName || '', assetUUID: workOrder?.AssetUUID || '' },
        workOrderType: { workOrderTypeName: '', workOrderTypeUUID: '' },
        problemDescription: workOrder?.ProblemDescription || '',
        taskDescription: '',
        workPriority: {workPriorityUUID: workOrder?.WorkPriorityUUID || "", workPriorityName: workOrder?.WorkPriorityName || ""},
        images: [], 
        attachments: [],
        attachmentCount: 0,
        attachmentDescription: '',
        creatorName: '',
        creatorEmail: '',
        creatorNumber: '',
        creatorLocation: '',
        crew: [],
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
        console.log("here")
        console.log(workOrderInformation)
    }, [workOrderInformation])

    function stepOne(index: number) {
        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <WorkOrderInformation workOrderInformation={workOrderInformation} setWorkOrderInformation={setWorkOrderInformation} priorityOptions={workPriorities}/>            
            </View>
        )
    }
    
    function stepTwo(index: number) {
        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskDocumentUpload setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} />
            </View>
        )
    }

    function stepThree(index: number) {
        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskUserInfo setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} />
            </View>
        )
    }

    function stepFour(index: number) {
        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <AssignCrew setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation}/>
            </View>
        )
    }

    function stepFive(index: number) {
        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <ReviewTask setStep={setStep} workOrderInformation={workOrderInformation} />
            </View>
        )
    }
    
    const next = async() => {
        setWorkOrderInformation((prev) => ({...prev, loading : true}))

        try {
            if(step === 0) {
                const saveWorkOrderRequest = await saveWorkOrder(userUUID, organizationUUID, workOrderInformation)
                if(saveWorkOrderRequest.Status === STATUS_CODE.SUCCESS) {
                    const workOrderUUID = saveWorkOrderRequest.Payload.WorkOrderUUID
                    setWorkOrderInformation((prev) => ({...prev, workOrderUUID: workOrderUUID, loading: false}))
                }
            } else if(step === 1) {
                const prevAttachmentCount = workOrderInformation.attachmentCount
                
                if(workOrderInformation.attachments.length !== prevAttachmentCount) {
                    const firebaseAttachmentUrls = await uploadDocuments(workOrderInformation.attachments, firebaseStoragelocations.workOrder)
                    console.log(firebaseAttachmentUrls)
                    await saveWorkOrderAttachments(userUUID, workOrderInformation.workOrderUUID, firebaseAttachmentUrls)
                }

                await saveWorkOrderNote(userUUID, workOrderInformation?.workOrderUUID, workOrderInformation.attachmentDescription)

                setWorkOrderInformation((prev) => ({...prev, attachmentCount: prev.attachments.length}))
            } else if(step === 2) {
                if(!workOrderInformation.creatorEmail || !workOrderInformation.creatorName || !workOrderInformation.creatorNumber) {
                    return
                }
            }

        } catch(err) {
            console.log(err)
        } finally {
            setWorkOrderInformation((prev) => ({...prev, loading : false}))
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
                renderItem={({ item, index }) =>
                    index === 0 ? stepOne(index) :
                    index === 1 ? stepTwo(index) :
                    index === 2 ? stepThree(index) :
                    index === 3 ? stepFour(index) :
                    index === 4 ? stepFive(index) :
                    null
                }
            />

            <View style={styles.formButtonsContainer}>
                {step >= 1 && <CustomButton onPress={back} textStyle={{color: "black"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.backButton]} title={"Back"} />}
                {workOrderInformation.loading ? <ActivityIndicator style={{marginLeft: "auto"}} size={"large"} /> : <CustomButton onPress={next} textStyle={{color: "white"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.nextButton]} title={step <= 3 ? "Next" : "Request Task"} />}
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