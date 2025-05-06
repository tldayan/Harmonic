import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import CustomTextAreaInput from "../../components/CustomTextAreaInput";
import CustomSelectInput from "../../components/CustomSelectInput";
import { uploadLocalDocuments } from "../../utils/helpers";
import { EventInformation } from "../../types/event.types";
import UploadIcon from "../../assets/icons/upload.svg"
import { colors } from "../../styles/colors";
import { DocumentItem } from "../../components/FlatlistItems/DocumentItem";
import CustomKeyboardAvoidingView from "../../components/CustomKeyboardAvoidingView";
import { CustomTextInput } from "../../components/CustomTextInput";
import { defaultInputStyles } from "../../styles/global-styles";
import Calender from "../../assets/icons/calendar.svg"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Clock from "../../assets/icons/clock.svg"

interface EventInformationProps {
    priorityOptions?: WorkPriority[]
    setEventInformation: React.Dispatch<React.SetStateAction<EventInformation>>
    eventInformation: EventInformation
}


export const Timings = ({ eventInformation, setEventInformation }: EventInformationProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  
  const showDatePicker = () => setDatePickerVisibility(true);


  const hideDatePicker = () => setDatePickerVisibility(false);


  const showStartTimePicker = () => setStartTimePickerVisibility(true);


  const hideStartTimePicker = () => setStartTimePickerVisibility(false);


  const showEndTimePicker = () => setEndTimePickerVisibility(true);


  const hideEndTimePicker = () => setEndTimePickerVisibility(false);


  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setEventInformation((prev) => ({ ...prev, eventDate: date }));
    hideDatePicker();
  };


  const handleStartTimeConfirm = (time: Date) => {
    setStartTime(time);
    setEventInformation((prev) => ({ ...prev, startTime: time }));
    hideStartTimePicker();
  };


  const handleEndTimeConfirm = (time: Date) => {
    setEndTime(time);
    setEventInformation((prev) => ({ ...prev, endTime: time }));
    hideEndTimePicker();
  };

  return (
    <CustomKeyboardAvoidingView>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text>Date</Text>
        <CustomSelectInput
          onSelect={showDatePicker}
          leftIcon={<Calender fill={colors.LIGHT_TEXT_COLOR} width={20} height={20} />}
          placeholder={selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
        />

        <Text style={{marginTop: 25}}>Time</Text>
        <View style={{flexDirection : 'row', alignItems :"center" , width : "100%", gap: 10}}>

    
        <CustomSelectInput
          onSelect={showStartTimePicker}
          placeholder={startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Start Time"}
        />
    
        <CustomSelectInput
          onSelect={showEndTimePicker}
          placeholder={endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "End Time"}
        />




    </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />

        <DateTimePickerModal
          isVisible={isStartTimePickerVisible}
          mode="time"
          onConfirm={handleStartTimeConfirm}
          onCancel={hideStartTimePicker}
        />

        <DateTimePickerModal
          isVisible={isEndTimePickerVisible}
          mode="time"
          onConfirm={handleEndTimeConfirm}
          onCancel={hideEndTimePicker}
        />
    
      </ScrollView>
    </CustomKeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  description: {
    marginTop: 20
  },
  fileUploadContainer: {
    justifyContent: "space-between",
    borderRadius: 24,
    marginTop: 10,
    padding: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    display: "flex",
    minHeight: 228,
    width: "100%",
    borderColor: "#E5E7EB",
    flexDirection: "column",
    backgroundColor: "#F9FAFB",
  },
  dropFilesContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  imagesContainer: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    flexDirection: "row",
  },
  eventBanner : {
    width: "100%",
    height: "auto",
    resizeMode: "cover",
  },
  imageLeft: {
    aspectRatio: 1.5,
    width: 90,
    flexShrink: 0,
  },
  imageRight: {
    aspectRatio: 1.49,
    width: 94,
    flexShrink: 0,
  },
  uploadIcon: {
    aspectRatio: 1,
    width: 20,
    marginTop: 8,
    height: 20,
  },
  clickToUploadText: {
    color: "#6b7280",
    textAlign: "center",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "400",
    marginTop: 8,
  },
  boldText: {
    fontWeight: "600",
  },
  fileTypesText: {
    color: "#6b7280",
    textAlign: "center",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 12,
    fontWeight: "400",
    marginTop: 8,
  },






  tagsContainer: {
    borderRadius: 8,
    width: "100%",
    overflow: "hidden",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    gap: 12,
  },
  headingContainer: {
    alignSelf: "stretch",
    width: "100%",
    gap: 10,
    color: "#111928",
    fontWeight: "500",
    padding: 0,
  },
  headingText: {
    color: "#111928",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "500",
  },
  inputFieldContainer: {
    marginTop: 12,
    width: "100%",
    color: "#6b7280",
    fontWeight: "400",
    gap: 8,
  },
  inputContainer: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    display: "flex",
    width: "100%",
    gap: 10,
    paddingTop: 8,
    paddingRight: 0,
    paddingBottom: 16,
    paddingLeft: 0,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    alignItems: "center",
    alignSelf: "stretch",
    display: "flex",
    minWidth: 240,
    marginTop: "auto",
    marginBottom: "auto",
    width: "100%",
    gap: 10,
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  searchIcon: {
    aspectRatio: 1,
    width: 16,
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flexShrink: 0,
    height: 16,
  },
  inputTextContainer: {
    alignSelf: "stretch",
    marginTop: "auto",
    marginBottom: "auto",
    flex: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  inputText: {
    color: "#6b7280",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
    fontWeight: "400",
  },
  eventNameLabel: {
    paddingTop: 20,
    paddingBottom: 10
  },
});

