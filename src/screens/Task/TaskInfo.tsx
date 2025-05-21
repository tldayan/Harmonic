import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { RootStackParamList } from '../../types/navigation-types'
import { getWorkRequestDetails } from '../../api/network-utils'
import TaskInfoDetails from './TaskInfoDetails'
import TaskHistory from './TaskHistory'
import TaskHeading from './TaskHeading'
import CustomButton from '../../components/CustomButton'
import Back from "../../assets/icons/chevron-left.svg"
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { CustomModal } from '../../components/CustomModal'
import ApproveWorkRequest from '../../modals/Task/WorkRequest/ApproveWorkRequest'
import TaskRequestorInfo from './TaskRequestorInfo'
import { WorkRequestActionDropdownComponent } from '../../dropdowns/WorkRequestActions'
import CancelWorkRequest from '../../modals/Task/WorkRequest/CancelWorkRequest'
import { TASK_STATUS_CODES } from '../../utils/constants'


export type TaskInfoScreenRouteProp = RouteProp<RootStackParamList, "TaskInfo">

export default function TaskInfo() {

    const route = useRoute<TaskInfoScreenRouteProp>()
    const [workRequestDetails, setWorkRequestDetails] = useState<WorkRequestDetails>({})
    const {workRequestUUID, workRequestNumber} = route.params || {}
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
    const [action, setAction] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWorkRequestDetails = async() => {
        
        try {
            const workRequestDetailsResponse = await getWorkRequestDetails(workRequestUUID)
            console.log(workRequestDetailsResponse)
            setWorkRequestDetails(workRequestDetailsResponse.Payload)

        } catch(err) {
            console.log(err)
        } finally {
          setLoading(false)
        }
    }

    useEffect(() => {
        fetchWorkRequestDetails()
    }, [])
    

    return (
      <ScrollView contentContainerStyle={{gap: 15, paddingBottom: 50}} style={styles.container}>
        <CustomButton buttonStyle={{marginTop: 15}} onPress={() => navigation.goBack()} icon={<Back width={20} height={20}  />} />
        <View style={styles.taskHeadingContainer}>
           {loading ? <ActivityIndicator style={{marginVertical: "10%", marginHorizontal: "50%"}} size={"small"} /> : 
           <>
            <TaskHeading workRequestDetails={workRequestDetails} />
           {(workRequestDetails.StatusItemCode === TASK_STATUS_CODES.PENDING) && <WorkRequestActionDropdownComponent horizontalDots action={action} setAction={setAction} />}
          </>}
          </View>

        <TaskInfoDetails workRequestDetails={workRequestDetails} workRequestUUID={workRequestUUID} />
        <TaskHistory workRequestDetails={workRequestDetails} workRequestUUID={workRequestUUID} />
        {workRequestDetails.PrimaryRequestorUserUUID && (
          <TaskRequestorInfo workRequestorUUID={workRequestDetails.PrimaryRequestorUserUUID} />
        )}

         
        <CustomModal onClose={() => setAction(null)} isOpen={action === "1"}>
          <ApproveWorkRequest fetchWorkRequestDetails={fetchWorkRequestDetails} workRequestNumber={workRequestNumber ?? ""} workRequestUUID={workRequestUUID} onClose={() => setAction(null)} />
        </CustomModal>

        <CustomModal onClose={() => setAction(null)} isOpen={action === "2"}>
          <CancelWorkRequest fetchWorkRequestDetails={fetchWorkRequestDetails} workRequestNumber={workRequestNumber ?? ""} workRequestUUID={workRequestUUID} onClose={() => setAction(null)} />
        </CustomModal>

      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
/*       borderWidth: 1, */
      flex: 1,
      paddingHorizontal: 10,
    },
    taskHeadingContainer: {
      flexDirection:"row",  
      backgroundColor: "white",
      padding: 16,
      borderRadius: 24,
      minHeight: 120
    }
  });