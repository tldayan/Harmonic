import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ModalsHeader from '../../ModalsHeader'
import CustomButton from '../../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../../../styles/button-styles'
import { colors } from '../../../styles/colors'
import { getWorkPriorities , getWorkRequestDetails, saveWorkRequest, saveWorkRequestAttachments, saveWorkRequestNote } from '../../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import ProgressBar from '../../../components/ProgressBar'
import { firebaseStoragelocations, STATUS_CODE } from '../../../utils/constants'
import { uploadDocuments } from '../../../utils/helpers'
import { WorkRequestInformationState } from '../../../types/work-request.types'
import WorkRequestInformation from './WorkRequestInformation'
import ReviewTask from '../ReviewTask'
import TaskUserInfo from '../TaskUserInfo'
import TaskDocumentUpload from '../TaskDocumentUpload'
import { statusCodes } from '@react-native-google-signin/google-signin'
import { createOptimisticWorkRequest } from './createOptimisticWorkRequest'

interface WorkRequestCreationProps {
    onClose: () => void
    setWorkRequests: React.Dispatch<React.SetStateAction<WorkRequest[]>>;
}

const width = Dimensions.get("window").width

const steps = [
   {id: "1", title : "Task Information"},
   {id: "2", title : "Additional Information"},
   {id: "3", title : "Task requested by"},
   {id: "4", title : "Review and submit"},
]



export default function WorkRequestCreation({onClose, setWorkRequests} : WorkRequestCreationProps) {

    const [step, setStep] = useState(0)
    const [workPriorities, setWorkPriorities] = useState<WorkPriority[]>()
    const [workRequestInformation, setWorkRequestInformation] = React.useState<WorkRequestInformationState>({
        workRequestUUID: "",
        asset: { assetName: '', assetUUID: '' },
        workRequestType: { workRequestTypeName: '', workRequestTypeUUID: '' },
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

        console.log(workRequestInformation)
    }, [workRequestInformation])


    function stepOne(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <WorkRequestInformation workRequestInformation={workRequestInformation} setWorkRequestInformation={setWorkRequestInformation} priorityOptions={workPriorities}/>            
            </View>
        )

    }
    
    function stepTwo(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskDocumentUpload setWorkRequestInformation={setWorkRequestInformation} workRequestInformation={workRequestInformation} />
            </View>
        )

    }

    function stepThree(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <TaskUserInfo setWorkRequestInformation={setWorkRequestInformation} workRequestInformation={workRequestInformation} />
            </View>
        )

    }

    function stepFour(index: number) {

        return (
            <View style={styles.innerContainer}>
                <Text>{steps[index].id}. {steps[index].title}</Text>
                <ReviewTask setStep={setStep} workRequestInformation={workRequestInformation} />
            </View>
        )

    }
    
    const next = async() => {
            setWorkRequestInformation((prev) => ({...prev, loading : true}))

        try {

        if(step === 0) {
            const saveWorkRequestResponse = await saveWorkRequest(userUUID, organizationUUID, workRequestInformation)
            if(saveWorkRequestResponse.Status === STATUS_CODE.SUCCESS) {
                const {ProblemDescription,WorkRequestNumber, WorkRequestUUID} = saveWorkRequestResponse.Payload
               
                setWorkRequestInformation((prev) => ({...prev, workRequestUUID: WorkRequestUUID, loading: false}))

                const optimisticWorkRequest = createOptimisticWorkRequest({
                    WorkRequestNumber,
                    ProblemDescription,
                    WorkPriorityName: workRequestInformation.workPriority.workPriorityName,
                    WorkRequestTypeName: workRequestInformation.workRequestType.workRequestTypeName,
                    AssetName: workRequestInformation.asset.assetName,
                    PrimaryRequestor: workRequestInformation.creatorName
                  });
                  setWorkRequests(prev => [optimisticWorkRequest, ...prev])

            } /* else {
                return
            } */
        } else if(step === 1) {
            const prevAttachmentCount = workRequestInformation.attachmentCount
            
            if(workRequestInformation.attachments.length !== prevAttachmentCount) {

                const firebaseAttachmentUrls = await uploadDocuments(workRequestInformation.attachments,firebaseStoragelocations.workRequest)
                await saveWorkRequestNote(userUUID, workRequestInformation.workRequestUUID , workRequestInformation.attachmentDescription)
                console.log(firebaseAttachmentUrls)
                await saveWorkRequestAttachments(userUUID, workRequestInformation.workRequestUUID, firebaseAttachmentUrls)
            }

            setWorkRequestInformation((prev) => ({...prev, attachmentCount: prev.attachments.length}))

        } else if(step === 2) {

            if(!workRequestInformation.creatorEmail || !workRequestInformation.creatorName || !workRequestInformation.creatorNumber) {
                return
            }

      
            const workRequestDetails = await getWorkRequestDetails(workRequestInformation?.workRequestUUID)
            const {AssetName,AssetUUID, WorkPriorityName,WorkPriorityUUID, ProblemDescription,WorkRequestTypeName,WorkRequestTypeUUID} = workRequestDetails.Payload
            console.log(workRequestDetails)
            setWorkRequestInformation((prev) => ({
                ...prev, 
                asset: {assetName: AssetName, assetUUID: AssetUUID,}, 
                problemDescription: ProblemDescription,
                workPriority: {workPriorityName: WorkPriorityName, workPriorityUUID: WorkPriorityUUID},
                workRequestType: {workRequestTypeName: WorkRequestTypeName, workRequestTypeUUID: WorkRequestTypeUUID }
            }))

        } else if (step === 3) {

            onClose()
           
        }

        } catch(err) {
            console.log(err)
        } finally {
            setWorkRequestInformation((prev) => ({...prev, loading : false}))
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
        <ModalsHeader onClose={onClose} title={"Create Work Request"} />

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
            {workRequestInformation.loading ? <ActivityIndicator style={{marginLeft: "auto"}} size={"large"} /> : <CustomButton onPress={next} textStyle={{color: "white"}} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.nextButton]} title={step <= 2 ? "Next" : "Request Task"} />}
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