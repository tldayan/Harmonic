import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/store'
import { getOrganizationPersonnel, getWorkOrderTypes } from '../../../api/network-utils'
import { colors } from '../../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { Crew, CrewMember, WorkOrderInformationState } from '../../../types/work-order.types'
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
    const [selectedCrew, setSelectedCrew] = useState<CrewMember[]>([]);

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

    useEffect(() => {
      const crewWithIsDeleting: CrewMember[] = workOrderInformation.crew.map((member) => ({
        ...member,
        isDeleting: false, 
      }));
      setSelectedCrew(crewWithIsDeleting);
    }, []);
    
    

    const handleFilter = (selectedUser: Crew) => {
      const isAlreadySelected = selectedCrew.some(
        (person) => person.OrganizationPersonnelUUID === selectedUser.OrganizationPersonnelUUID
      );
    
      if (isAlreadySelected) {
        const filtered = selectedCrew.filter(
          (person) => person.OrganizationPersonnelUUID !== selectedUser.OrganizationPersonnelUUID
        );
        setSelectedCrew(filtered);
      } else {
        const newCrewMember: CrewMember = {
          FullName: selectedUser.FullName,
          OrganizationPersonnelUUID: selectedUser.OrganizationPersonnelUUID,
          timings: [],
          isDeleting: false,
        };
        setSelectedCrew((prev) => [...prev, newCrewMember]);
      }
    };
    
      
      
      useEffect(() => {
        console.log(workOrderInformation.crew)
      }, [workOrderInformation])

    const crewItem = ({ item }: { item: Crew }) => {
      
      const isSelected = selectedCrew.some(
        (eachPersonnel) => eachPersonnel.OrganizationPersonnelUUID === item.OrganizationPersonnelUUID
      );
      
        return (
          <TouchableOpacity
            key={item.OrganizationPersonnelUUID}
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
      
      const handleDone = () => {
        setWorkOrderInformation((prev) => ({
          ...prev,
          crew: selectedCrew,
        }));
        onClose();
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
            
            <CustomButton onPress={handleDone} buttonStyle={[PRIMARY_BUTTON_STYLES, {marginHorizontal: "10%", marginBottom: 10, marginTop: 10}]} textStyle={PRIMARY_BUTTON_TEXT_STYLES} title={"Done"} />

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
