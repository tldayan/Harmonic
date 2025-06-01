import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import SearchIcon from "../../assets/icons/search.svg"
import { CardShadowStyles, defaultInputStyles, shadowStyles } from '../../styles/global-styles'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import CirclePlus from "../../assets/icons/circle-plus.svg"
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import WorkOrderItem from '../../components/FlatlistItems/WorkOrderItem'
import { getPendingWorkRequestCount, getWorkOrderList, getWorkRequestList } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList, TabParamList } from '../../types/navigation-types'
import Alert from "../../assets/icons/circle-alert.svg"
import { CustomModal } from '../../components/CustomModal'
import TaskCreation from '../../modals/Task/WorkOrder/WorkOrderCreation'
import WorkOrderCreation from '../../modals/Task/WorkOrder/WorkOrderCreation'
import WorkRequestCreation from '../../modals/Task/WorkRequest/WorkRequestCreation'
import WorkRequestItem from '../../components/FlatlistItems/WorkRequestItem'
import { TASK_STATUS_CODES } from '../../utils/constants'

interface TasksScreenProps {
  filterUserTasks?: boolean
}

export default function TasksScreen({filterUserTasks}: TasksScreenProps) {

  const [userRole, setUserRole] = useState("admin")
  const [searchTask, setSearchTask] = useState("")
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>([])
  const [filteredWorkOrders, setFilteredWorkOrders] = useState<WorkOrder[]>([])
  const [filteredWorkRequests, setFilteredWorkRequests] = useState<WorkRequest[]>([])

  const [pendingWorkRequests, setPendingWorkRequests] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [creatingRequest, setCreatingRequest] = useState(false)
  const [taskDetails, setTaskDetails] = useState<WorkOrderDetails | null>(null)
  const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const isAdmin = userRole === "admin";

  const fetchTasksList = async (initial?: boolean) => {
  
    if (!initial && (!hasMore || loading)) return;
  
    console.log("Fetching tasks...");
    setLoading(true);
  
    try {
      const fetchFn = isAdmin ? getWorkOrderList : getWorkRequestList;
      const start = initial ? 0 : startIndex;
      const TaskListResponse = await fetchFn(userUUID, organizationUUID, start);
      const tasks = TaskListResponse?.Payload || [];
  
      if (initial) {
        if (isAdmin) setWorkOrders(tasks);
        else setWorkRequests(tasks);
  
        setStartIndex(tasks.length);
        setHasMore(tasks.length === 30); 
      } else {
        if (tasks.length < 30) {
          setHasMore(false);
        }
  
        if (isAdmin) {
          setWorkOrders((prev) => [...prev, ...tasks]);
        } else {
          setWorkRequests((prev) => [...prev, ...tasks]);
        }
  
        setStartIndex((prev) => prev + tasks.length);
      }
    } catch (err) {
      console.error("Failed to fetch task list:", err);
    } finally {
      setLoading(false);
    } 
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasksList(true);
    }, [])
  );


  useEffect(() => {

    const fetchPendingWorkRequestCount = async() => {
      const pendingWorkRequestResponse = await getPendingWorkRequestCount(organizationUUID)
      setPendingWorkRequests(pendingWorkRequestResponse.Payload.count)
    }

    fetchPendingWorkRequestCount()

  }, [])

  useEffect(() => {
    const task = searchTask.trim().toLowerCase();
  
    if (!task) {
      setFilteredWorkOrders([]);
      setFilteredWorkRequests([]);
      return;
    }
  
    if (isAdmin) {
      const filtered = workOrders.filter((order: WorkOrder) =>
        order.WorkOrderNumber?.toLowerCase().includes(task) ||
        order.WorkOrderTitle?.toLowerCase().includes(task) ||
        order.ProblemDescription?.toLowerCase().includes(task) ||
        order.AssetName?.toLowerCase().includes(task) ||
        order.StatusItemName?.toLowerCase().includes(task) ||
        order.CreatedByFullName?.toLowerCase().includes(task)
      );
      setFilteredWorkOrders(filtered);
    } else {
      const filtered = workRequests.filter((req: WorkRequest) =>
        req.WorkRequestNumber?.toLowerCase().includes(task) ||
        req.ProblemDescription?.toLowerCase().includes(task) ||
        req.AssetName?.toLowerCase().includes(task) ||
        req.StatusItemName?.toLowerCase().includes(task)
      );
      setFilteredWorkRequests(filtered);
    }
  }, [searchTask, workOrders, workRequests]);
  

  const sortPendingTasks = () => {

/*     if(isAdmin) {
      const filtered = workRequests.filter((eachTask) => eachTask.StatusItemCode === TASK_STATUS_CODES.PENDING)
      setFilteredWorkRequests(filtered)
    } */

  }


  const flatListData = userRole === "admin" ? workOrders : workRequests;

  const renderFlatListItem = ({ item }: { item: WorkOrder | WorkRequest }) => {
    return isAdmin
      ? <WorkOrderItem setTaskDetails={setTaskDetails} workOrderItem={item as WorkOrder} />
      : <WorkRequestItem workRequestItem={item as WorkRequest} />;
  };




  return (
    <View style={{flex: 1}}>
      
      {!filterUserTasks && <View style={[styles.searchTaskContainer, CardShadowStyles]}>
        <CustomTextInput placeholder='Search Task ID' placeholderTextColor={colors.LIGHT_TEXT} inputStyle={[defaultInputStyles, styles.searchField]} onChangeText={(e) => setSearchTask(e)} value={searchTask} leftIcon={<SearchIcon color={colors.LIGHT_TEXT} width={18} height={18} />} />
        
        <View style={styles.createTaskContainer}>
          <CustomButton onPress={() => setCreatingRequest(true)}  textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.createTask, {marginTop: 0, marginBottom: 0}]} icon={<CirclePlus width={15} height={15} />} iconPosition="right" title={"Create Request"} />
        </View>
        
        <ScrollView showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.taskStageButtonsContainer}>
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"All orders"} />
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"Processed task"} />
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"Completed tasks"} />
        </ScrollView>
      </View>}
      {pendingWorkRequests ? <View style={[styles.pendingRequestsContainer, CardShadowStyles ]}>
          <Alert fill='red' color='white' width={22} height={22}/>
          <Text style={styles.pending}>You have {pendingWorkRequests} request pending to approve</Text>
          <CustomButton buttonStyle={[PRIMARY_BUTTON_STYLES, styles.seeAll]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} onPress={sortPendingTasks} title={"See all"} />
        </View>: null}
      {(flatListData?.length === 0 && loading) && <ActivityIndicator style={{marginTop: "50%"}} size={"small"} color={"black"} />}
      
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.workOrderContainer} 
        style={{ marginTop: 15 }} 
        renderItem={renderFlatListItem}
        data={
          isAdmin
            ? (searchTask.trim() ? filteredWorkOrders : workOrders)
            : (searchTask.trim() ? filteredWorkRequests : workRequests)
        }
        keyExtractor={(item, index) => {
          const key = isAdmin ? item.WorkOrderUUID : item.WorkRequestUUID;
          return key ?? index.toString();
        }}
        onRefresh={() => fetchTasksList(true)}
        refreshing={loading}        
        onEndReached={() => fetchTasksList(false)}
        onEndReachedThreshold={0.8}
        ListFooterComponent={(loading && flatListData?.length > 0) ? (
          <ActivityIndicator style={{ marginBottom: "5%" }} size="small" color="black" />
        ) : null}
      />



      <CustomModal presentationStyle="formSheet" fullScreen isOpen={creatingRequest || !!taskDetails} onClose={() => {setTaskDetails(null);setCreatingRequest(false)}}>
        <WorkOrderCreation workOrder={taskDetails} onClose={() => {setTaskDetails(null);setCreatingRequest(false)}} />
      </CustomModal>

      <CustomModal presentationStyle="formSheet" fullScreen isOpen={creatingRequest} onClose={() => setCreatingRequest(false)}>
        <WorkRequestCreation setWorkRequests={setWorkRequests} onClose={() => setCreatingRequest(false)} />
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
    marginTop: 16,
    gap: 16,
    padding: 16,
    borderRadius: 15
  },
  searchField : {
    paddingLeft: 35,
    borderColor: colors.BORDER_COLOR,
		borderWidth: 1,
  },
  createTask: {
    paddingHorizontal: 15,
    backgroundColor: colors.BRIGHT_ORANGE,
  },
  createTaskContainer: {
    flexDirection: "row", 
    marginLeft: "auto",
    alignItems: "center", 
    gap: 10
  }
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
    paddingVertical: 5,
    borderRadius: 50,
    backgroundColor: colors.LIGHT_COLOR,
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