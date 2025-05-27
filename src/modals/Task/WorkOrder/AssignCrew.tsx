import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomSelectInput from '../../../components/CustomSelectInput'
import { WorkOrderInformationState } from '../../../types/work-order.types'
import { CustomModal } from '../../../components/CustomModal'
import CrewSelection from './CrewSelection'


interface AssignCrewProps {
    setWorkOrderInformation: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>
    workOrderInformation: WorkOrderInformationState
}


export default function AssignCrew({setWorkOrderInformation, workOrderInformation}: AssignCrewProps) {

    const [selectingCrew, setSelectingCrew] = useState(false)


  return (
    <View style={{flex: 1, marginTop: 10}}>
      <CustomSelectInput label='Select Crew' onSelect={() => setSelectingCrew(true)} placeholder={workOrderInformation.crew.length ? workOrderInformation.crew.map((eachCrew) => eachCrew.fullName).join(",") : "Select crew"} />
        
        <CustomModal isOpen={selectingCrew} onClose={() => setSelectingCrew(false)} >
            <CrewSelection setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} onClose={() => setSelectingCrew(false)}  />
        </CustomModal>


    </View>
  )
}

const styles = StyleSheet.create({})