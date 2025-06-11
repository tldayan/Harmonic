import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity } from "react-native";
import CustomSelectInput from "../../components/CustomSelectInput";
import { EventInformation } from "../../types/event.types";
import { colors } from "../../styles/colors";
import CustomKeyboardAvoidingView from "../../components/CustomKeyboardAvoidingView";
import Calender from "../../assets/icons/calendar.svg";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { defaultInputLabelStyles } from "../../styles/global-styles";
import { CustomTextInput } from "../../components/CustomTextInput";
import CustomTextAreaInput from "../../components/CustomTextAreaInput";

interface EventInformationProps {
  setEventInformation: React.Dispatch<React.SetStateAction<EventInformation>>;
  eventInformation: EventInformation;
}

const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const Timings = ({ eventInformation, setEventInformation }: EventInformationProps) => {
  const [isEventStartDatePickerVisible, setEventStartDatePickerVisibility] = useState(false);
  const [isEventStartTimePickerVisible, setEventStartTimePickerVisibility] = useState(false);
  const [isEventEndDatePickerVisible, setEventEndDatePickerVisibility] = useState(false);
  const [isEventEndTimePickerVisible, setEventEndTimePickerVisibility] = useState(false);

  const [showRegistration, setShowRegistration] = useState(false)
  const [isRegStartDatePickerVisible, setRegStartDatePickerVisibility] = useState(false);
  const [isRegStartTimePickerVisible, setRegStartTimePickerVisibility] = useState(false);
  const [isRegEndDatePickerVisible, setRegEndDatePickerVisibility] = useState(false);
  const [isRegEndTimePickerVisible, setRegEndTimePickerVisibility] = useState(false);

  const [isPublishDatePickerVisible, setPublishDatePickerVisibility] = useState(false);
  const [isPublishTimePickerVisible, setPublishTimePickerVisibility] = useState(false);

  const [eventStartDate, setEventStartDate] = useState<Date | null>(
    isValidDate(eventInformation.eventStartDateTime) ? new Date(eventInformation.eventStartDateTime) : null
  );
  
  const [eventStartTime, setEventStartTime] = useState<Date | null>(
    isValidDate(eventInformation.eventStartDateTime) ? new Date(eventInformation.eventStartDateTime) : null
  );
  
  const [eventEndDate, setEventEndDate] = useState<Date | null>(
    isValidDate(eventInformation.eventEndDateTime) ? new Date(eventInformation.eventEndDateTime) : null
  );
  
  const [eventEndTime, setEventEndTime] = useState<Date | null>(
    isValidDate(eventInformation.eventEndDateTime) ? new Date(eventInformation.eventEndDateTime) : null
  );
  
  const [regStartDate, setRegStartDate] = useState<Date | null>(
    isValidDate(eventInformation.registrationStartDateTime) ? new Date(eventInformation.registrationStartDateTime) : null
  );
  
  const [regStartTime, setRegStartTime] = useState<Date | null>(
    isValidDate(eventInformation.registrationStartDateTime) ? new Date(eventInformation.registrationStartDateTime) : null
  );
  
  const [regEndDate, setRegEndDate] = useState<Date | null>(
    isValidDate(eventInformation.registrationEndDateTime) ? new Date(eventInformation.registrationEndDateTime) : null
  );
  
  const [regEndTime, setRegEndTime] = useState<Date | null>(
    isValidDate(eventInformation.registrationEndDateTime) ? new Date(eventInformation.registrationEndDateTime) : null
  );
  
  const [publishDate, setPublishDate] = useState<Date | null>(
    isValidDate(eventInformation.scheduledPublishDateTime) ? new Date(eventInformation.scheduledPublishDateTime) : null
  );
  
  const [publishTime, setPublishTime] = useState<Date | null>(
    isValidDate(eventInformation.scheduledPublishDateTime) ? new Date(eventInformation.scheduledPublishDateTime) : null
  );
  
  const [isSchedulingPublish, setIsSchedulingPublish] = useState<boolean>(false);

  const createEventDateTimeString = (date: Date, time: Date) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined.toISOString();
  };

  useEffect(() => {
    if (eventStartDate && eventStartTime && !isNaN(eventStartDate.getTime()) && !isNaN(eventStartTime.getTime())) {
      setEventInformation((prev) => ({
        ...prev,
        eventStartDateTime: createEventDateTimeString(eventStartDate, eventStartTime),
      }));
    }
  }, [eventStartDate, eventStartTime]);
  
  useEffect(() => {
    if (eventEndDate && eventEndTime && !isNaN(eventEndDate.getTime()) && !isNaN(eventEndTime.getTime())) {
      setEventInformation((prev) => ({
        ...prev,
        eventEndDateTime: createEventDateTimeString(eventEndDate, eventEndTime),
      }));
    }
  }, [eventEndDate, eventEndTime]);
  
  useEffect(() => {
    if (regStartDate && regStartTime && !isNaN(regStartDate.getTime()) && !isNaN(regStartTime.getTime())) {
      setEventInformation((prev) => ({
        ...prev,
        registrationStartDateTime: createEventDateTimeString(regStartDate, regStartTime),
      }));
    }
  }, [regStartDate, regStartTime]);
  
  useEffect(() => {
    if (regEndDate && regEndTime && !isNaN(regEndDate.getTime()) && !isNaN(regEndTime.getTime())) {
      setEventInformation((prev) => ({
        ...prev,
        registrationEndDateTime: createEventDateTimeString(regEndDate, regEndTime),
      }));
    }
  }, [regEndDate, regEndTime]);
  

  useEffect(() => {
    if (isSchedulingPublish && publishDate && publishTime) {
      setEventInformation((prev) => ({
        ...prev,
        scheduledPublishDateTime: createEventDateTimeString(publishDate, publishTime),
      }));
    }
  }, [publishDate, publishTime]);

  return (
    <CustomKeyboardAvoidingView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 30 }} style={{ paddingBottom: 30}}>

        <View style={styles.checkboxContainer}>
          <CustomSelectInput flex label="Event Start" labelStyle={defaultInputLabelStyles} onSelect={() => setEventStartDatePickerVisibility(true)} placeholder={eventStartDate ? eventStartDate.toLocaleDateString() : "Select Date"} />
          <CustomSelectInput flex label="." labelStyle={{  marginVertical: 10,fontWeight: 500, opacity: 0}} onSelect={() => setEventStartTimePickerVisibility(true)} placeholder={eventStartTime ? eventStartTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"} />
        </View>
        

        <View style={styles.checkboxContainer}>
          <CustomSelectInput flex label="Event End" labelStyle={defaultInputLabelStyles} onSelect={() => setEventEndDatePickerVisibility(true)} placeholder={eventEndDate ? eventEndDate.toLocaleDateString() : "Select Date"} />
        <CustomSelectInput flex label="." labelStyle={{  marginVertical: 10,fontWeight: 500, opacity: 0}} onSelect={() => setEventEndTimePickerVisibility(true)} placeholder={eventEndTime ? eventEndTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"} />
        </View>
        

        <View style={{ flexDirection: "column", gap: 10, marginTop: 20, marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setShowRegistration((prev) => !prev)} style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {showRegistration && <View style={styles.innerCheckbox} />}
            </View>
            <Text>Set Registration Time</Text>
          </TouchableOpacity>
        </View>

        {showRegistration && <View >
          <View style={styles.checkboxContainer}>
            <CustomSelectInput flex label="Registration Start" labelStyle={defaultInputLabelStyles} onSelect={() => setRegStartDatePickerVisibility(true)} placeholder={regStartDate ? regStartDate.toLocaleDateString() : "Select Date"} />
            <CustomSelectInput flex label="." labelStyle={{  marginVertical: 10,fontWeight: 500, opacity: 0}} onSelect={() => setRegStartTimePickerVisibility(true)} placeholder={regStartTime ? regStartTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"} />
          </View>

          <View style={styles.checkboxContainer}>
            <CustomSelectInput flex label="Registration End" labelStyle={defaultInputLabelStyles} onSelect={() => setRegEndDatePickerVisibility(true)} placeholder={regEndDate ? regEndDate.toLocaleDateString() : "Select Date"} />
            <CustomSelectInput flex label="." labelStyle={{  marginVertical: 10,fontWeight: 500, opacity: 0}} onSelect={() => setRegEndTimePickerVisibility(true)} placeholder={regEndTime ? regEndTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"} />
          </View>
        </View>}

        {/* Publish Section */}
        <Text style={{ marginTop: 25, fontWeight: 500 }}>Publish Options</Text>
        <View style={{ flexDirection: "column", gap: 10, marginTop: 10 }}>
          <TouchableOpacity onPress={() => setIsSchedulingPublish(false)} style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {!isSchedulingPublish && <View style={styles.innerCheckbox} />}
            </View>
            <Text>Publish Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsSchedulingPublish(true)} style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              {isSchedulingPublish && <View style={styles.innerCheckbox} />}
            </View>
            <Text>Schedule Publish</Text>
          </TouchableOpacity>
        </View>

        {isSchedulingPublish && (
          <View style={{flexDirection: "row", gap: 10, marginTop: 10}}>
            <CustomSelectInput flex onSelect={() => setPublishDatePickerVisibility(true)} placeholder={publishDate ? publishDate.toLocaleDateString() : "Select Date"} />
            <CustomSelectInput flex onSelect={() => setPublishTimePickerVisibility(true)} placeholder={publishTime ? publishTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Select Time"} />
          </View>
        )}

        {/* Pickers */}
        <DateTimePickerModal isVisible={isEventStartDatePickerVisible} mode="date" onConfirm={(d) => { setEventStartDate(d); setEventStartDatePickerVisibility(false); }} onCancel={() => setEventStartDatePickerVisibility(false)} minimumDate={new Date()} />
        <DateTimePickerModal isVisible={isEventStartTimePickerVisible} mode="time" onConfirm={(t) => { setEventStartTime(t); setEventStartTimePickerVisibility(false); }} onCancel={() => setEventStartTimePickerVisibility(false)} />
        <DateTimePickerModal isVisible={isEventEndDatePickerVisible} mode="date" onConfirm={(d) => { setEventEndDate(d); setEventEndDatePickerVisibility(false); }} onCancel={() => setEventEndDatePickerVisibility(false)} minimumDate={new Date()} />
        <DateTimePickerModal isVisible={isEventEndTimePickerVisible} mode="time" onConfirm={(t) => { setEventEndTime(t); setEventEndTimePickerVisibility(false); }} onCancel={() => setEventEndTimePickerVisibility(false)} />

        <DateTimePickerModal isVisible={isRegStartDatePickerVisible} mode="date" onConfirm={(d) => { setRegStartDate(d); setRegStartDatePickerVisibility(false); }} onCancel={() => setRegStartDatePickerVisibility(false)} minimumDate={new Date()} />
        <DateTimePickerModal isVisible={isRegStartTimePickerVisible} mode="time" onConfirm={(t) => { setRegStartTime(t); setRegStartTimePickerVisibility(false); }} onCancel={() => setRegStartTimePickerVisibility(false)} />
        <DateTimePickerModal isVisible={isRegEndDatePickerVisible} mode="date" onConfirm={(d) => { setRegEndDate(d); setRegEndDatePickerVisibility(false); }} onCancel={() => setRegEndDatePickerVisibility(false)} minimumDate={new Date()} />
        <DateTimePickerModal isVisible={isRegEndTimePickerVisible} mode="time" onConfirm={(t) => { setRegEndTime(t); setRegEndTimePickerVisibility(false); }} onCancel={() => setRegEndTimePickerVisibility(false)} />

        <DateTimePickerModal isVisible={isPublishDatePickerVisible} mode="date" onConfirm={(d) => { setPublishDate(d); setPublishDatePickerVisibility(false); }} onCancel={() => setPublishDatePickerVisibility(false)} minimumDate={new Date()} />
        <DateTimePickerModal isVisible={isPublishTimePickerVisible} mode="time" onConfirm={(t) => { setPublishTime(t); setPublishTimePickerVisibility(false); }} onCancel={() => setPublishTimePickerVisibility(false)} />
      
        <CustomTextAreaInput labelStyle={defaultInputLabelStyles} multiline value={eventInformation.InformationForRegisteredUsers} onChangeText={(e) => setEventInformation((prev) => ({...prev, InformationForRegisteredUsers: e}))}  label="Information for registered users" placeholder="Note" />
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


  checkboxContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  innerCheckbox: {
    height: 20,
    width: 20,
    borderRadius: 30,
    backgroundColor: colors.ACTIVE_ORANGE,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    justifyContent: "center",
    alignItems: "center",
  }
});

