import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { getWorkOrderTypes } from '../../../api/network-utils'
import CustomButton from '../../../components/CustomButton'
import { colors } from '../../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { WorkOrderInformationState } from '../../../types/work-order.types'

interface WorkOrderType {
    WorkOrderTypeUUID: string;    
    WorkOrderTypeName: string;        
    WorkOrderTypeDescription: string | null; 
}

interface WorkOrderTypesProps {
    onClose: () => void
    setWorkOrderInformation: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>
}

export default function WorkOrderTypes({onClose, setWorkOrderInformation} : WorkOrderTypesProps) {
    
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
            onPress={() => {setWorkOrderInformation((prev) => ({
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
                    contentContainerStyle= {{gap: 15}}
                    keyExtractor={(item) => item.WorkOrderTypeUUID}
                    renderItem={workOrderTypeItem}
                    ListEmptyComponent={<Text>No Work Order Types Available</Text>}
                    ListFooterComponent={loading ? <ActivityIndicator size={"small"} /> : null}
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
