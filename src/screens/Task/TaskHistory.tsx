import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ViewStyle } from "react-native";
import { CardShadowStyles } from "../../styles/global-styles";
import Check from "../../assets/icons/mini-check.svg"
import { formatLongDate, getTimeFromISO } from "../../utils/helpers";
import { colors } from "../../styles/colors";
import { getWorkRequestHistory } from "../../api/network-utils";

interface TimelineItemProps {
  heading: string;
  time: string;
  date: string;
  description: string;
  status: string;
  style?: ViewStyle;
}

interface TaskInfoHistoryProps {
  workRequestUUID: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  heading,
  time,
  date,
  description,
  status,
  style
}) => (
  <View style={[styles.timelineItem, style]}>
    <View style={styles.iconContainer}>
        <Check  width={15} height={15} />  
    </View>

    <Text style={styles.headingText}>{heading}</Text>
    <View style={styles.row}>
      <Text style={styles.timeDateText}>{time}</Text>
      <View style={styles.ellipse}></View>
      <Text style={styles.timeDateText}>{date}</Text>
    </View>
    <Text style={styles.descriptionText}>{description}</Text>
    <View style={styles.statusBadge}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  </View>
);


function TaskHistory({ workRequestUUID }: TaskInfoHistoryProps) {

    
    const [workRequestHistory, setWorkRequestHistory] = useState<WorkRequestHistory[]>([])

    useEffect(() => {

        const fetchWorkHistory = async() => {
            const workRequestHistoryResponse = await getWorkRequestHistory(workRequestUUID)
            console.log(workRequestHistoryResponse)
            setWorkRequestHistory(workRequestHistoryResponse.Payload)
        }

        fetchWorkHistory()

    }, [])

  return (
    <View style={[styles.container, CardShadowStyles]}>
      <Text style={styles.headerText}>Task Tracker</Text>
      <View style={styles.timeline}>
        {workRequestHistory.map((item, index) => {
          const date = formatLongDate(item.CreatedDateTime)
          const time = getTimeFromISO(item.CreatedDateTime);
          return (
            <TimelineItem
              key={item.WorkRequestStatusUUID}
              heading={item.StatusItemName}
              time={time}
              date={date}
              description={item.Note || `Created by ${item.CreatedByFullName}`}
              status={item.StatusItemCode}
              style={index > 0 ? { marginTop: 40 } : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    backgroundColor: "white",
    alignSelf: "stretch",
    padding: 24,
    maxWidth: 480,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111928",
    marginBottom: 24,
  },
  timeline: {
    borderLeftWidth: 1,
    borderColor: "rgba(229, 231, 235, 1)",
    paddingLeft: 20,
    position: "relative",
  },
  timelineItem: {
/*     borderWidth: 1, */
    width: "100%",
  },
  headingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111928",
    marginBottom: 4,
  },
  row: {
    marginTop: 4,
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
    alignItems:"center"
  },
  timeDateText: {
    fontSize: 12,
    color: "#6B7280",
  },
  descriptionText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "#DEF7EC",
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 10,
    color: "#03543f",
    fontWeight: "500",
  },
  iconContainer: {
    position: "absolute",
    left: -30,
    backgroundColor: "white",
    padding: 2,
    borderRadius: 50
  },
  ellipse: {
    width: 4,
    height:4,
    borderRadius: 10,
    backgroundColor: "#D1D5DB"
  }
});

export default TaskHistory;
