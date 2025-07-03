import { StyleSheet, View } from 'react-native'
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

      const fetchWorkOrderPersonnelSchedule = async () => {
        const WorkOrderPersonnelScheduleResponse = await getWorkOrderPersonnelSchedule(workOrderInformation.workOrderUUID);
        console.log("WRFDS", WorkOrderPersonnelScheduleResponse);
      

        const seenUUIDs = new Set<string>();
        const filteredCrew: CrewMember[] = [];
      
        for (const person of WorkOrderPersonnelScheduleResponse.Payload) {
          if (!seenUUIDs.has(person.OrganizationPersonnelUUID)) {
            seenUUIDs.add(person.OrganizationPersonnelUUID);
            filteredCrew.push({
              FullName: person.FullName,
              OrganizationPersonnelUUID: person.OrganizationPersonnelUUID,
              WorkOrderSchedulePersonnelUUID: person?.WorkOrderSchedulePersonnelUUID,
              timings: [],
              isDeleting: false,
            });
          }
        }
      
        const workOrderDate = localToUTCDateOnly(WorkOrderPersonnelScheduleResponse.Payload[0].ScheduleDateTimeFrom);
      
        const filterWorkOrderPersonnelSchedule = WorkOrderPersonnelScheduleResponse.Payload.map((person: any) => ({
          PersonnelUUID: person.OrganizationPersonnelUUID,
          ScheduledDateTimeFrom: person.ScheduleDateTimeFrom,
          ScheduledDateTimeTo: person.ScheduleDateTimeTo,
        }));
      
        const { booked } = groupByDate(filterWorkOrderPersonnelSchedule);
      
        setWorkOrderInformation((prev) => ({
          ...prev,
          crew: filteredCrew,
          bookedCrewTimings: booked,
          workOrderStartDate: workOrderDate,
        }));
      };
      
      console.log("WORK ORDER UUID",workOrderInformation.workOrderUUID)
      if(workOrderInformation.workOrderUUID) {
        fetchWorkOrderPersonnelSchedule()
      }


    }, [])


  return (
    <View style={{flex: 1, marginTop: 10}}>
      <CustomSelectInput label='Select Crew' onSelect={() => setSelectingCrew(true)} placeholder={workOrderInformation.crew.length ? workOrderInformation.crew.map((eachCrew) => eachCrew.FullName).join(",") : "Select crew"} />
        
        {selectingCrew && <CustomModal onClose={() => setSelectingCrew(false)} >
            <CrewSelection setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} onClose={() => setSelectingCrew(false)}  />
        </CustomModal>}

        <CrewScheduler setWorkOrderInformation={setWorkOrderInformation} workOrderInformation={workOrderInformation} />
    </View>
  )
}

const styles = StyleSheet.create({})