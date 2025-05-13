import { View, Text, StyleSheet, Image, Alert, TouchableWithoutFeedback } from "react-native";
import { colors } from "../styles/colors";
import { CardShadowStyles, shadowStyles } from "../styles/global-styles";
import CustomButton from "../components/CustomButton";
import ChevronDown from "../assets/icons/chevron-down.svg"
import { useNavigation } from "@react-navigation/native";
import ImageUpload from "../assets/icons/image-black.svg"
import ClipBoard from "../assets/icons/clipboard-list.svg"
import Calender from "../assets/icons/calendar-day.svg"
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation-types";
import { useState } from "react";
import { CustomModal } from "../components/CustomModal";
import CreatePost from "./Post/CreatePost";
import WorkRequestCreation from "./Task/WorkRequest/WorkRequestCreation";
import EventCreation from "./Event/EventCreation";






export default function AddModalScreen() {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

    const [creatingPost, setCreatingPost] = useState(false)
    const [creatingTask, setCreatingTask] = useState(false)
    const [creatingEvent, setCreatingEvent] = useState(false)

    const options = [
        {
        label: "Create Post",
        icon: <ImageUpload width={20} height={20} />,
        action: () => setCreatingPost(true)
        },
        {
        label: "Create Task",
        icon: <ClipBoard width={20} height={20} />,
        action: () => setCreatingTask(true)
        },
        {
        label: "Create Event",
        icon: <Calender width={20} height={20} />,
        action: () => setCreatingEvent(true),
        },
    ];
  
    const closeCreatePostModal = () => {
        setCreatingPost(false)

    }

    const closeCreateTaskModal = () => {
        setCreatingTask(false) 
         
    }
    const closeCreateEventModal = () => {
        setCreatingEvent(false) 
         
    }

    return (
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={{ flex: 1 }}>
          <View style={styles.overlay}>
            <View style={styles.sheet}>
              {options.map((item, idx) => (
                <CustomButton
                  key={idx}
                  onPress={item.action}
                  buttonStyle={[styles.actionButton, CardShadowStyles]}
                  title={item.label}
                  iconPosition="right"
                  icon={item.icon}
                />
              ))}
              <CustomButton
                buttonStyle={styles.chevronDown}
                onPress={() => navigation.goBack()}
                icon={<ChevronDown color="white" width={20} height={20} />}
              />
            </View>
          </View>
    
          <CustomModal fullScreen isOpen={creatingPost} onClose={closeCreatePostModal} presentationStyle="fullScreen">
            <CreatePost onClose={closeCreatePostModal} />
          </CustomModal>
    
          <CustomModal fullScreen isOpen={creatingTask} onClose={closeCreateTaskModal} presentationStyle="fullScreen">
            <WorkRequestCreation onClose={closeCreateTaskModal} />
          </CustomModal>
    
          <CustomModal fullScreen isOpen={creatingEvent} onClose={closeCreateEventModal} presentationStyle="fullScreen">
            <EventCreation onClose={closeCreateEventModal} />
          </CustomModal>
        </View>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    width: "90%",
    marginHorizontal: "5%",
  },
  sheet: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 20,
    borderRadius: 25,
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "white",
    padding: 24,
    marginTop: 12,
  },
  chevronDown: {
    backgroundColor: colors.ACTIVE_ORANGE,
    borderRadius: 50,
    flexDirection: "column", 
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    marginTop: 20,
    marginBottom: 20,
    alignSelf : "center"
  }
});
