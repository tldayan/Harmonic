import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { getOrganizationPersonnel, getWorkOrderTypes } from '../../../api/network-utils'
import { colors } from '../../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { Crew, WorkOrderInformationState } from '../../../types/work-order.types'
import CheckIcon from "../../../assets/icons/check.svg"
import CustomButton from '../../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../../styles/button-styles'

interface CrewSelectionProps {
    onClose: () => void
    setWorkOrderInformation: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>
    workOrderInformation: WorkOrderInformationState
}


export default function CrewSelection({setWorkOrderInformation, workOrderInformation, onClose}: CrewSelectionProps) {
    
    const [crew, setCrew] = useState<Crew[]>([])
    const [loading, setLoading] = useState(false)
    const {organizationUUID} = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const fetchCrews = async () => {
            setLoading(true)
            try {
                const crew = await getOrganizationPersonnel(organizationUUID)
                setCrew(crew.Payload)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchCrews()
    }, [organizationUUID])



    const handleFilter = (selectedUser: Crew) => {
        const isAlreadySelected = workOrderInformation.crew.some(
          (person) => person.userUUID === selectedUser.UserUUID
        );
      
        if (isAlreadySelected) {
          const filtered = workOrderInformation.crew.filter(
            (person) => person.userUUID !== selectedUser.UserUUID
          );
          setWorkOrderInformation((prev) => ({ ...prev, crew: filtered }));
        } else {
          const newCrewMember = {
            fullName: selectedUser.FullName,
            userUUID: selectedUser.UserUUID,
            timings: []
          };
          setWorkOrderInformation((prev) => ({
            ...prev,
            crew: [...prev.crew, newCrewMember],
          }));
        }
      };
      
      
      useEffect(() => {
        console.log(workOrderInformation.crew)
      }, [workOrderInformation])

    const crewItem = ({ item }: { item: Crew }) => {

        const isSelected = workOrderInformation.crew.some((eachPersonnel) => eachPersonnel.userUUID === item.UserUUID);
      
        return (
          <TouchableOpacity
            key={item.UserUUID}
            onPress={() => handleFilter(item)}
            style={[styles.childPersonnelContainer]}
          >
            <View style={[styles.checkbox, isSelected && { backgroundColor: colors.PRIMARY_COLOR, borderWidth: 0 }]}>
              {isSelected && <CheckIcon />}
            </View>
            <Text style={styles.personnelName}>{item.FullName}</Text>
          </TouchableOpacity>
        );
      };
      

/* onPress={() => setWorkOrderInformation((prev) => ({...prev, crew: [...workOrderInformation.crew, {fullName: item.FullName, userUUID: item.UserUUID}]}))} */
  return (
    <View style={styles.container}>
        <ModalsHeader onClose={onClose} title='Select Personnels' />
        {loading ? <ActivityIndicator style={{marginBottom: 10}} size="small" /> : (
            <>
            <ScrollView style={styles.mainWorkOrderTypesList} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
                <FlatList
                    style={styles.workOrderTypesList}
                    data={crew}
                    contentContainerStyle= {{gap: 15}}
                    keyExtractor={(item) => item.UserUUID}
                    renderItem={crewItem}
                    ListEmptyComponent={<Text>No Personnels Available</Text>}
                    ListFooterComponent={loading ? <ActivityIndicator size={"small"} /> : null}
                />
            </ScrollView>
            
            <CustomButton onPress={onClose} buttonStyle={[PRIMARY_BUTTON_STYLES, {marginHorizontal: "10%", marginBottom: 10, marginTop: 10}]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} title={"Done"} />

            </>
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
    },
    checkbox: {
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.BORDER_COLOR
    },
    childPersonnelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5 
    },
    personnelName: {
        fontWeight: "300"
    }
})
