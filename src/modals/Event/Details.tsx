import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import CustomTextAreaInput from "../../components/CustomTextAreaInput";
import CustomSelectInput from "../../components/CustomSelectInput";
import { CustomModal } from "../../components/CustomModal";
import EventTypes from "./EventTypes";
import { uploadLocalDocuments } from "../../utils/helpers";
import { EventInformation } from "../../types/event.types";
import UploadIcon from "../../assets/icons/upload.svg"
import { colors } from "../../styles/colors";
import { DocumentItem } from "../../components/FlatlistItems/DocumentItem";
import CustomKeyboardAvoidingView from "../../components/CustomKeyboardAvoidingView";
import { CustomTextInput } from "../../components/CustomTextInput";
import { defaultInputStyles } from "../../styles/global-styles";

interface EventInformationProps {
    priorityOptions?: WorkPriority[]
    setEventInformation: React.Dispatch<React.SetStateAction<EventInformation>>
    eventInformation: EventInformation
}


export const Details = ({eventInformation, setEventInformation} : EventInformationProps) => {


    const [selectingEventType, setSelectingEventType] = useState(false)
    const scrollViewRef = useRef<ScrollView>(null);

    const addDocument = async() => {
        if(eventInformation.eventBanner.length) return
        const documentsWithLocalUri = await uploadLocalDocuments(eventInformation.eventBanner)

        setEventInformation((prev) => ({...prev, eventBanner: [...documentsWithLocalUri]}))

    }

  return (
<CustomKeyboardAvoidingView>
  <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={{paddingBottom: 30}}>

      {/* FILE UPLOAD SECTION */}
      <TouchableOpacity onPress={addDocument} style={[styles.fileUploadContainer, eventInformation.eventBanner.length ? {borderColor: colors.GREEN} : null]}>
      {eventInformation.eventBanner.length ? <DocumentItem item={eventInformation.eventBanner[0]} deleteDocument={() => setEventInformation((prev) => ({...prev, eventBanner: []}))} /> : <View style={styles.dropFilesContainer}>
        <View style={styles.imagesContainer}>
            <Image
                source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/c4c8b2a09c4e12821e9083aeffc464914719af79?placeholderIfAbsent=true&apiKey=c91de5f0cb9b4186a3a7de3645b59a9d" }}
                style={styles.imageLeft}
            />
            <Image
                source={{ uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/8424ed83338ed26ab10660b9918b743e96eca806?placeholderIfAbsent=true&apiKey=c91de5f0cb9b4186a3a7de3645b59a9d" }}
                style={styles.imageRight}
            />
        </View>

        {!eventInformation.eventBanner.length && <UploadIcon color={colors.LIGHT_TEXT} width={20} height={20} />}

        <Text style={styles.clickToUploadText}>
          <Text style={styles.boldText}>Click to upload</Text> or drag and drop
        </Text>

        <Text style={styles.fileTypesText}>
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </Text>
      </View>}
    </TouchableOpacity>

    <CustomTextInput onChangeText={(e) => setEventInformation((prev) => ({...prev, eventName: e}))} labelStyle={styles.eventNameLabel} value={eventInformation.eventName} placeholder="Birthday Bash" inputStyle={defaultInputStyles} label="Event Name" />
    <Text style={styles.description}>Description</Text>
    <CustomTextAreaInput
        multiline={true}
        flex={true}
        onFocus={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
        onChangeText={(e) => {
            setEventInformation((prev) => ({ ...prev, eventDescription: e }));
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
        placeholder="Write issue description here"
    />


    <CustomSelectInput onSelect={() => setSelectingEventType(true)} placeholder={eventInformation.eventType.eventTypeName ? eventInformation.eventType.eventTypeName : "Event Type"} />
    

    <CustomModal isOpen={selectingEventType} onClose={() => setSelectingEventType(false)}>
        <EventTypes setEventInformation={setEventInformation} onClose={() => setSelectingEventType(false)} />
    </CustomModal>

    </ScrollView></CustomKeyboardAvoidingView>

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
/*   eventNameField: {
    backgroundColor: "#F9FAFB",
    borderWidth:0
  } */
});

