import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { colors } from '../../styles/colors';
import {
  WORK_PRIORITY_COLOR_CODES,
  WORK_PRIORITY_TEXT_COLOR_CODES,
  WORK_STATUS__NOTIFICATION_COLOR_CODES,
  WORK_STATUS_COLOR_CODES
} from '../../utils/constants';
import { CardShadowStyles, shadowStyles } from '../../styles/global-styles';
import { formatProperDate, responsiveFontSize } from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation-types';

interface WorkRequestItemProps {
  workRequestItem: WorkRequest;
}

export default function WorkRequestItem({ workRequestItem }: WorkRequestItemProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const displayedKeys: Record<string, string> = {
    WorkRequestNumber: workRequestItem.WorkRequestNumber ?? "N/A",
    ProblemDescription: workRequestItem.ProblemDescription ?? "N/A",
    WorkRequestTypeName: workRequestItem.WorkRequestTypeName ?? "N/A",
    AssetName: workRequestItem.AssetName ?? "N/A",
    WorkOrderNumber: workRequestItem.WorkOrderNumber ?? "N/A",
    PrimaryRequestor: workRequestItem.PrimaryRequestor ?? "N/A",
  };
  
    
  const goToDetails = () => {
    if (workRequestItem.WorkRequestUUID) {
      navigation.navigate("TaskInfo", { workRequestUUID: workRequestItem?.WorkRequestUUID, workRequestNumber: workRequestItem.WorkRequestNumber });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={goToDetails}
      style={[
        styles.mainWorkRequestContainer,
        { backgroundColor: WORK_STATUS_COLOR_CODES[workRequestItem.StatusItemName] || 'white' }
      ]}
    >
      <View style={[styles.workRequestContainer, CardShadowStyles]}>
        <View style={styles.workRequestStatsContainer}>
          <Text style={{color: "#111827", fontWeight: "500", fontSize: responsiveFontSize(15) }}>
            {workRequestItem.WorkRequestNumber || "N/A"}
          </Text>
          <Text style={[
            styles.workRequestPriorityName,
            {
              backgroundColor: WORK_PRIORITY_COLOR_CODES[workRequestItem.WorkPriorityName] || "#ccc",
              color: WORK_PRIORITY_TEXT_COLOR_CODES[workRequestItem.WorkPriorityName] || "#000"
            }
          ]}>
            {workRequestItem.WorkPriorityName || "N/A"}
          </Text>
          <View style={[
            styles.workRequestStatusItemNameContainer,
            { backgroundColor: WORK_STATUS_COLOR_CODES[workRequestItem.StatusItemName] || "#eee" }
          ]}>
            <View style={[
              styles.workRequestNotificationDot,
              { backgroundColor: WORK_STATUS__NOTIFICATION_COLOR_CODES[workRequestItem.StatusItemName] || "#999" }
            ]} />
            <Text style={styles.workRequestStatusItemName}>
              {workRequestItem.StatusItemName || "N/A"}
            </Text>
          </View>
        </View>

       {/*  {workRequestItem.CreatedDateTime && (
          <Text style={{ color: colors.LIGHT_TEXT }}>
            Created on <Text style={{ color: "black" }}>{formatProperDate(workRequestItem.CreatedDateTime)}</Text>
          </Text>
        )} */}

        <View style={{ marginTop: 10 }}>
          {Object.entries(displayedKeys).map(([key, value]) => (
            <Text key={key} style={{ fontSize: responsiveFontSize(14), marginBottom: 4 }}>
              <Text style={{ fontWeight: "bold" }}>{key}: </Text>
              {value !== null && value !== undefined && value !== "" ? String(value) : "N/A"}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  mainWorkRequestContainer: {
    width: "95%",
    borderRadius: 24,
    alignSelf: "center"
  },
  workRequestContainer: {
    borderRadius: 24,
    width: "99%",
    gap: 10,
    marginLeft: "auto",
    backgroundColor: "white",
    padding: 16
  },
  workRequestStatsContainer: {
/*     borderWidth: 1, */
    flexDirection: "row",
    alignItems: "center",
  },
  workRequestPriorityName: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: responsiveFontSize(10),
    fontWeight: '500',
    borderRadius: 24
  },
  workRequestStatusItemNameContainer: {
    flexDirection: "row",
    marginLeft: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 8,
    borderRadius: 24,
  },
  workRequestStatusItemName: {
    color: "#1A202C",
    fontSize: responsiveFontSize(10),
  },
  workRequestNotificationDot: {
    height: 10,
    width: 10,
    borderRadius: 50,
  }
});
