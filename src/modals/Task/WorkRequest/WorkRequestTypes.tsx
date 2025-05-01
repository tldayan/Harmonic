import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { getWorkRequestTypes } from '../../../api/network-utils'
import CustomButton from '../../../components/CustomButton'
import { colors } from '../../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { WorkRequestInformationState } from '../../../types/work-request.types'

interface WorkRequestTypesProps {
    onClose: () => void
    setWorkRequestInformation: React.Dispatch<React.SetStateAction<WorkRequestInformationState>>
}

export default function WorkRequestTypes({ onClose, setWorkRequestInformation }: WorkRequestTypesProps) {
    const [workRequestTypes, setWorkRequestTypes] = useState<WorkRequestType[]>([])
    const [loading, setLoading] = useState(false)
    const { organizationUUID } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const fetchWorkRequestTypes = async () => {
            setLoading(true)
            try {
                const response = await getWorkRequestTypes(organizationUUID)
                setWorkRequestTypes(response.Payload)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchWorkRequestTypes()
    }, [organizationUUID])

    const renderWorkRequestTypeItem = ({ item }: { item: WorkRequestType }) => (
        <CustomButton
            buttonStyle={styles.workRequestType}
            onPress={() => {
                setWorkRequestInformation((prev) => ({
                    ...prev,
                    workRequestType: {
                        workRequestTypeUUID: item.WorkRequestTypeUUID,
                        workRequestTypeName: item.WorkRequestTypeName,
                    },
                }))
                onClose()
            }}
            title={item.WorkRequestTypeName}
        />
    )

    return (
        <View style={styles.container}>
            <ModalsHeader onClose={onClose} title="Task Type" />
            {loading ? (
                <ActivityIndicator size="small" />
            ) : (
                <ScrollView
                    style={styles.mainWorkRequestTypesList}
                    horizontal={true}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <FlatList
                        style={styles.workRequestTypesList}
                        data={workRequestTypes}
                        contentContainerStyle={{ gap: 15 }}
                        keyExtractor={(item) => item.WorkRequestTypeUUID}
                        renderItem={renderWorkRequestTypeItem}
                        ListEmptyComponent={<Text>No Work Request Types Available</Text>}
                        ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
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
    mainWorkRequestTypesList: {
        flexDirection: "column",
        width: "90%",
        alignSelf: "center",
        paddingBottom: 10
    },
    workRequestTypesList: {
        width: "90%",
        alignSelf: "center",
        paddingHorizontal: 10,
    },
    workRequestType: {
        backgroundColor: colors.LIGHT_COLOR,
        borderRadius: 25,
        paddingVertical: 5
    }
})
