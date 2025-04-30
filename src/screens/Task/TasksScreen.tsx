import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import SearchIcon from "../../assets/icons/search.svg"
import { defaultInputStyles, shadowStyles } from '../../styles/global-styles'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import CirclePlus from "../../assets/icons/circle-plus.svg"
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import WorkOrderItem from '../../components/FlatlistItems/WorkOrderItem'
import { getPendingWorkRequestCount, getWorkOrderList } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import Alert from "../../assets/icons/circle-alert.svg"
import { CustomModal } from '../../components/CustomModal'
import TaskCreation from '../../modals/Task/TaskCreation'

export default function TasksScreen() {

  const [searchTask, setSearchTask] = useState("")
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [pendingWorkRequests, setPendingWorkRequests] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [creatingTask, setCreatingTask] = useState(false)
  const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth)
  const [hasMoreWorkOrders, setHasMoreWordOrders] = useState(true)
  const [loading, setLoading] = useState(false)

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const fetchWorkOrderList = async() => {
    if(!hasMoreWorkOrders || loading) return

    setLoading(true)
    try {
      const workOrdersResponse = await getWorkOrderList(userUUID, organizationUUID, startIndex)
      if(workOrdersResponse.Payload.length < 30) {
        setHasMoreWordOrders(false)
      }
      setWorkOrders((prev) => [...prev, ...workOrdersResponse.Payload])
      setStartIndex((prev) => prev + 30)

    } catch(err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

    const fetchPendingWorkRequestCount = async() => {
      const pendingWorkRequestResponse = await getPendingWorkRequestCount(organizationUUID)
      setPendingWorkRequests(pendingWorkRequestResponse.Payload.count)
    }

    fetchPendingWorkRequestCount()

  }, [])


  return (
    <View style={{flex: 1}}>
      
      <View style={[styles.searchTaskContainer, shadowStyles]}>
        
        <View style={styles.createTaskContainer}>
          <CustomTextInput placeholder='Search Task ID' placeholderTextColor={colors.LIGHT_TEXT} inputStyle={[defaultInputStyles, styles.searchField]} onChangeText={(e) => setSearchTask(e)} value={searchTask} leftIcon={<SearchIcon color={colors.LIGHT_TEXT} width={18} height={18} />} />
          <CustomButton onPress={() => setCreatingTask(true)}  textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.createTask, {marginTop: 10, marginBottom: 10}]} icon={<CirclePlus width={15} height={15} />} iconPosition="right" title={"Create Task"} />
        </View>
        
        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.taskStageButtonsContainer}>
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"All orders"} />
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"Processed task"} />
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"Completed tasks"} />
        </ScrollView>
      </View>
      {pendingWorkRequests ? <View style={[styles.pendingRequestsContainer, shadowStyles ]}>
          <Alert fill='red' color='white' width={22} height={22}/>
          <Text style={styles.pending}>You have {pendingWorkRequests} request pending to approve</Text>
          <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, styles.seeAll]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} onPress={() => {}} title={"See all"} />
        </View>: null}
      {(workOrders?.length === 0 && loading) && <ActivityIndicator style={{marginTop: "50%"}} size={"small"} color={"black"} />}
      <FlatList
        contentContainerStyle={styles.workOrderContainer} 
        style={{ marginTop: 15}} 
        renderItem={({item}) => <WorkOrderItem workOrderItem={item} />} 
        data={workOrders} 
        keyExtractor={(item) => item.WorkOrderUUID}
        onEndReached={fetchWorkOrderList}
        onEndReachedThreshold={0.8}
        ListFooterComponent={(loading && workOrders?.length > 0) ? <ActivityIndicator style={{marginBottom: "5%"}} size={"small"} color={"black"} /> : null}  
      />


      <CustomModal presentationStyle="formSheet" fullScreen isOpen={creatingTask} onClose={() => setCreatingTask(false)}>
        <TaskCreation onClose={() => setCreatingTask(false)} />
      </CustomModal>


    </View>
  )
}

const styles = StyleSheet.create({
  searchTaskContainer: {
/*     borderWidth: 1, */
    backgroundColor: "white",
    paddingHorizontal: 15,
    width: "95%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 25,
    borderRadius: 15
  },
  searchField : {
    paddingLeft: 40,
    borderColor: colors.BORDER_COLOR,
		borderWidth: 1,
  },
  createTask: {
    paddingHorizontal: 15,
    backgroundColor: colors.BRIGHT_ORANGE,
  },
  createTaskContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10, 
    paddingVertical: 10}
  ,
  taskStageButtonsContainer: {
    backgroundColor: "white",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  taskStageButtons: {
    /*     borderWidth: 1, */
    paddingHorizontal: 15,
    paddingVertical:5,
    borderRadius: 50,
    backgroundColor: colors.LIGHT_COLOR,
    marginVertical: 10
  },
  workOrderContainer: {
    gap: 20,
    paddingBottom: 100  
  },
  pendingRequestsContainer: {
    width: "95%",
    alignSelf: "center",
    gap: 10,
    backgroundColor: colors.RED_SHADE,
    borderRadius: 10,
    padding: 8,
    marginTop: 10,
    flexDirection : "row",
    alignItems: "center"
  },
  pending: {
    flexShrink: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
    color: colors.LIGHT_TEXT
  },
  seeAll: {
    height: 30,
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 20,
    marginLeft: "auto"
  }

})