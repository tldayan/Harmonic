import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getNextMonthDates } from '../../../utils/TaskScreen/getDates';
import { colors } from '../../../styles/colors';
import { Crew, WorkOrderInformationState } from '../../../types/work-order.types';

const HOUR_WIDTH = 60;
const HOURS = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 9; // 9AM to 4PM
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    return `${formattedHour}${ampm}`;
  });
  
  

const PERSONNEL = [
  { id: '1', name: 'John Doe', isOff: true },
  { id: '2', name: 'Jane Smith', isOff: false },
  { id: '3', name: 'Luke Dave', isOff: false },
];

interface CrewSchedulerProps {
    setWorkOrderInformation: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>
    workOrderInformation: WorkOrderInformationState
}

export default function CrewScheduler({setWorkOrderInformation, workOrderInformation}: CrewSchedulerProps) {

    
  const [crew, setCrew] = useState(workOrderInformation.crew || []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRanges, setSelectedRanges] = useState({});
  const scrollViewRef = useRef(null);
  const timelineScrollRef = useRef(null);

  const DATES = getNextMonthDates();

  useEffect(() => {
    setCrew(workOrderInformation.crew || []);
  }, [workOrderInformation.crew]);
  

  const handleSlotPress = (personId: string, slot: string) => {
    setWorkOrderInformation(prev => {

      const updatedCrew = prev.crew.map(eachCrew => {
        if (eachCrew.userUUID === personId) {

          const timings = eachCrew.timings || [];
  
          if (timings.includes(slot)) {
            return {
              ...eachCrew,
              timings: timings.filter(s => s !== slot),
            };
          } else {
            return {
              ...eachCrew,
              timings: [...timings, slot],
            };
          }
        }
        return eachCrew;
      });
  
      return {
        ...prev,
        crew: updatedCrew,
      };
    });
  };
  

  useEffect(() => {
    console.log(selectedDate)
    console.log(workOrderInformation)
    console.log(workOrderInformation.crew)
  }, [workOrderInformation])

  const generateSlots = (hourStart = 9, hourEnd = 17) => {
    const slots = [];
    for (let i = hourStart; i < hourEnd; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hourIn12 = i > 12 ? i - 12 : i;
        const ampm = i >= 12 ? 'PM' : 'AM';
        const formatted = `${hourIn12}:${j === 0 ? '00' : j}${ampm}`;
        slots.push(formatted);
      }
    }
    return slots;
  };

  const timeSlots = generateSlots();

  const syncScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollTo({ x, animated: false });
    }
  };

  return (
    <View style={styles.container}>
      {/* Date Picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20, gap: 10 }}
      >
        {DATES.map((item) => (
          <TouchableOpacity
            key={item.fullDate}
            style={[styles.dateBox, selectedDate === item.fullDate && styles.selectedDateBox]}
            onPress={() => setSelectedDate(item.fullDate)}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.date}>{item.date.getDate()}</Text>
            <Text style={styles.month}>
              {item.date.toLocaleString('default', { month: 'short' })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Header */}
      <ScrollView
        horizontal
        ref={timelineScrollRef}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.timelineHeader}>
          <View style={styles.nameColumn} />
          {HOURS.map((hour, i) => (
            <View key={i} style={styles.hourBlock}>
              <Text style={styles.hourText}>{hour}</Text>
              <View style={styles.miniGridRow}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <View key={j} style={styles.miniGridCell} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Main Timeline Body */}
      <ScrollView bounces={false} horizontal onScroll={syncScroll} scrollEventThrottle={16} ref={scrollViewRef}>
        <FlatList
          scrollEnabled={false}
          data={crew}
          keyExtractor={(item) => item.userUUID}
          renderItem={({ item }) => (
            <View style={styles.personnelRow}>
              <View style={styles.nameColumn}>
                <Text style={styles.nameText}>{item.fullName}</Text>
     {/*            {item.isOff && <Text style={styles.offBadge}>OFF</Text>} */}
              </View>
              <View style={styles.timeSlotRow}>
                {timeSlots.map((slot, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => handleSlotPress(item.userUUID, slot)}
                    style={[
                      styles.timeSlot,
                  /*     item.isOff && styles.offOverlay, */
                      item.timings.includes(slot) && styles.selectedSlot,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}
        />
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'blue' }]} />
          <Text style={styles.legendText}>Current Selection</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'red' }]} />
          <Text style={styles.legendText}>Off Day</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8f9fa' },
  timelineHeader: { flexDirection: 'row' },
  hourText: { fontSize: 10, color: '#555' },
  nameColumn: {
    width: 100,
    backgroundColor: '#fff',
    padding: 5,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  personnelRow: { flexDirection: 'row', minHeight: 50 },
  nameText: { fontSize: 12 },
  offBadge: {
    fontSize: 10,
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: 2,
  },
  timeSlotRow: { flexDirection: 'row' },
  timeSlot: {
    width: HOUR_WIDTH / 4,
    height: 36,
    backgroundColor: '#e2e8f0',
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  offOverlay: { backgroundColor: '#fecaca' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#e5e7eb',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  legendText: { fontSize: 10 },
  hourBlock: {
    width: HOUR_WIDTH,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  miniGridRow: {
    flexDirection: 'row',
    width: HOUR_WIDTH,
    flexWrap: 'wrap',
  },
  miniGridCell: {
    width: HOUR_WIDTH / 4,
    height: 8,
    borderRightWidth: 0.5,
    borderColor: '#ccc',
  },
  selectedSlot: {
    backgroundColor: '#93c5fd',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  dateBox: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  selectedDateBox: {
    backgroundColor: colors.ACTIVE_ORANGE,
  },
  label: {
    fontSize: 12,
    color: '#555',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  month: {
    fontSize: 12,
    color: '#555',
  },
});
