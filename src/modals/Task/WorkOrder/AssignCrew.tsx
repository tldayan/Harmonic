import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomSelectInput from '../../../components/CustomSelectInput'
import { CrewMember, WorkOrderInformationState } from '../../../types/work-order.types'
import { CustomModal } from '../../../components/CustomModal'
import CrewSelection from './CrewSelection'
import CrewScheduler from './CrewScheduler'
import { getWorkOrderPersonnelSchedule } from '../../../api/network-utils'
import { groupByDate } from '../../../utils/TaskScreen/groupDate'
import { localToUTCDateOnly } from '../../../utils/TaskScreen/localToUTCDate'


interface AssignCrewProps {
    setWorkOrderInformation: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>
    workOrderInformation: WorkOrderInformationState
}


export default function AssignCrew({setWorkOrderInformation, workOrderInformation}: AssignCrewProps) {

    const [selectingCrew, setSelectingCrew] = useState(false)

    useEffect(() => {

      const fetchWorkOrderPersonnelSchedule = async() => {
        const WorkOrderPersonnelScheduleResponse = await getWorkOrderPersonnelSchedule(workOrderInformation.workOrderUUID)
           console.log("WRFDS", WorkOrderPersonnelScheduleResponse)
           
           const filteredCrew: CrewMember[] = WorkOrderPersonnelScheduleResponse.Payload.map((person: any) => ({
            FullName: person.FullName,
            OrganizationPersonnelUUID: person.OrganizationPersonnelUUID,
            timings: [],
          }));
          const workOrderDate = localToUTCDateOnly(WorkOrderPersonnelScheduleResponse.Payload[0].ScheduleDateTimeFrom)
          
          const filterWorkOrderPersonnelSchedule = WorkOrderPersonnelScheduleResponse.Payload.map((person: any) => ({
            PersonnelUUID: person.UserUUID,
            ScheduledDateTimeFrom: person.ScheduleDateTimeFrom,
            ScheduledDateTimeTo: person.ScheduleDateTimeTo
          }));

          const {booked } = groupByDate(filterWorkOrderPersonnelSchedule);

        setWorkOrderInformation((prev) => ({
          ...prev,
          crew: filteredCrew,
          bookedCrewTimings: booked,
          workOrderStartDate: workOrderDate
      }));
      }
      console.log("WORK ORDER UUID",workOrderInformation.workOrderUUID)
      if(workOrderInformation.workOrderUUID) {
        console.log("dsadasdada")
        fetchWorkOrderPersonnelSchedule()
      }


    }, [])


  return (
    <View style={{flex: 1, marginTop: 10}}>
      <CustomSelectInput label='Select Crew' onSelect={() => setSelectingCrew(true)} placeholder={workOrderInformation.crew.length ? workOrderInformation.crew.map((eachCrew) => eachCrew.FullName).join(",") : "Select crew"} />
        
        <CustomModal isOpen={selectingCrew} onClose={() => setSelectingCrew(false)} >
            <CrewSelection setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} onClose={() => setSelectingCrew(false)}  />
        </CustomModal>

        <CrewScheduler setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} />


    </View>
  )
}

const styles = StyleSheet.create({})