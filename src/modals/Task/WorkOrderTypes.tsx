import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { getWorkOrderTypes } from '../../api/network-utils'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'

interface WorkOrderType {
    WorkOrderTypeUUID: string;    
    WorkOrderTypeName: string;        
    WorkOrderTypeDescription: string | null; 
}

interface WorkOrderTypesProps {
    onClose: () => void
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
}

export default function WorkOrderTypes({onClose, setTaskInformation} : WorkOrderTypesProps) {
    
    const [workTypes, setWorkTypes] = useState<WorkOrderType[]>([])
    const [loading, setLoading] = useState(false)
    const {organizationUUID} = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const fetchWorkOrderTypes = async () => {
            setLoading(true)
            try {
                const WorkOrderTypes = await getWorkOrderTypes(organizationUUID)
                setWorkTypes(WorkOrderTypes.Payload)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchWorkOrderTypes()
    }, [organizationUUID])


    const workOrderTypeItem = ({ item }: { item: WorkOrderType }) => (
        <CustomButton
            buttonStyle={styles.workOrderType}
            onPress={() => {setTaskInformation((prev) => ({
                ...prev,
                workOrderType: {
                  workOrderTypeUUID: item.WorkOrderTypeUUID,
                  workOrderTypeName: item.WorkOrderTypeName,
                },
              })); onClose()}}
            title={item.WorkOrderTypeName}
        />
    )

  return (
    <View style={styles.container}>
        <ModalsHeader onClose={onClose} title='Task Type' />
        {loading ? <ActivityIndicator size="small" /> : (
            <ScrollView style={styles.mainWorkOrderTypesList} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
                <FlatList
                    style={styles.workOrderTypesList}
                    data={workTypes}
                    keyExtractor={(item) => item.WorkOrderTypeUUID}
                    renderItem={workOrderTypeItem}
                    ListEmptyComponent={<Text>No Work Order Types Available</Text>}
                />
            </ScrollView>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 20,
        width: 343,
        paddingBottom: 10
    },
    mainWorkOrderTypesList: {
        flexDirection: "column", 
        width: "90%", 
        alignSelf: "center",
        paddingBottom: 10
    },
    workOrderTypesList: {
        width: "90%",
        alignSelf: "center",
        paddingHorizontal: 10,
    },
    workOrderType: {
        backgroundColor: colors.LIGHT_COLOR,
        borderRadius: 25,
        paddingVertical: 5
    }
})
