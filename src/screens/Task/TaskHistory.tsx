import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, ViewStyle, ActivityIndicator, TouchableOpacity } from "react-native";
import { CardShadowStyles } from "../../styles/global-styles";
import Check from "../../assets/icons/mini-check.svg"
import { formatLongDate, getTimeFromISO } from "../../utils/helpers";
import { getWorkOrderHistory, getWorkRequestHistory } from "../../api/network-utils";
import ChevronDown from "../../assets/icons/chevron-down.svg"

interface TimelineItemProps {
  heading: string;
  time: string;
  date: string; 
  description: string;
  status: string;
  style?: ViewStyle;
}

interface TaskInfoHistoryProps {
  workOrderUUID?: string;
  workRequestUUID?: string
  taskDetails: any
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
        <View style={styles.iconBackground}>
        <Check  width={10} height={10} />  
        </View>
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


function TaskHistory({ workOrderUUID, workRequestUUID, taskDetails}: TaskInfoHistoryProps) {
  const [loading, setLoading] = useState(true);
  const [taskHistory, setTaskHistory] = useState<(WorkRequestHistory | WorkOrderHistory)[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchTaskHistory = async () => {
      try {
        const taskHistory = await (workRequestUUID ? getWorkRequestHistory(workRequestUUID) : getWorkOrderHistory(workOrderUUID!)); 
        console.log(taskHistory.Payload)
        setTaskHistory(taskHistory.Payload);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskHistory();
  }, [taskDetails]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded((prev) => !prev)}  style={[styles.container, CardShadowStyles]}>
      {loading ? (
        <ActivityIndicator size={"small"} />
      ) : (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.headerText}>Task Tracker</Text>
                <View style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
                  <ChevronDown strokeWidth={3} width={15} height={15} />
                </View>
          </View>

          {expanded && (
            <View style={styles.timeline}>
              {taskHistory.map((item, index) => {
                const date = formatLongDate(item.CreatedDateTime);
                const time = getTimeFromISO(item.CreatedDateTime);

                        const key =
              'WorkRequestStatusUUID' in item
                ? item.WorkRequestStatusUUID
                : item.WorkOrderStatusUUID;

                return (
                  <TimelineItem
                    key={key}
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
          )}
        </>
      )}
    </TouchableOpacity>
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
  },
  timeline: {
    borderLeftWidth: 1,
    borderColor: "rgba(229, 231, 235, 1)",
    paddingLeft: 20,
    position: "relative",
    marginTop: 24 
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
  iconBackground: {
    backgroundColor: "#FEECDC",
    borderRadius: 50,
    padding: 3
  },
  iconContainer: {
    position: "absolute",
    left: -32,
    top: -1,
    backgroundColor: "white",
    padding: 3,
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
