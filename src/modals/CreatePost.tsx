import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ModalsHeader from './ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "../context/AuthContext"
import { CustomTextInput } from '../components/CustomTextInput'
import CustomButton from '../components/CustomButton'
import { colors } from '../styles/colors'
import { shadowStyles } from '../styles/global-styles'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../styles/button-styles'


interface CreatePostProps {
    onClose: () => void
}

export default function CreatePost({onClose}: CreatePostProps) {

    const {user} = useUser()
    const [postText, setPostText] = useState("")
    const inputRef = useRef<any>(null)

    useEffect(() => {
            const timer = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus(); 
                }
            }, 300); 

            return () => clearTimeout(timer)
        }, []);

  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title='Create Post' />
        <View style={styles.innerContainer}>

        
            <View style={styles.mainUserDetailsContainer}>
                <View style={styles.mainProfileDetialsContainer}>
                    <Image source={{ uri: user?.photoURL ?? "https://i.pravatar.cc/150" }}  style={styles.profilePicture} />
                    <Text style={styles.name}>{user?.displayName}</Text>
                </View>
            </View>

            <CustomTextInput ref={inputRef} multiline placeholderTextColor={colors.LIGHT_TEXT_COLOR} inputStyle={[styles.postField, shadowStyles]} value={postText} onChangeText={(e) => {setPostText(e)}} placeholder={`What's on your mind, ${user?.displayName}?`}/>
            <View style={styles.mainActionButtonsContainer}>
                <ScrollView scrollEnabled horizontal contentContainerStyle={styles.actionButtonsContainer} indicatorStyle='black' showsHorizontalScrollIndicator>
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Media"} icon={<Image width={5} height={5} source={require("../assets/images/frame.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Link"} icon={<Image width={5} height={5} source={require("../assets/images/link.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Poll"} icon={<Image width={5} height={5} source={require("../assets/images/ordored-list.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Event"} icon={<Image width={5} height={5} source={require("../assets/images/calendar.png")} />} />
                </ScrollView>
            </View>

            <View style={styles.mainCategoryButtonsContainer}>
                <ScrollView scrollEnabled horizontal contentContainerStyle={styles.categoryButtonsContainer} indicatorStyle='black' showsHorizontalScrollIndicator>
                    <CustomButton buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={"All"} onPress={() => {}} />
                    <CustomButton buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={"Event"} onPress={() => {}} />
                    <CustomButton buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={"Survery/Polls"} onPress={() => {}} />
                    <CustomButton buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={"News & update"} onPress={() => {}} />
                    <CustomButton buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={"Promotions"} onPress={() => {}} />
                    <CustomButton buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={"General"} onPress={() => {}} />
                </ScrollView>
            </View>

            <CustomButton onPress={() => {}} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, shadowStyles]} title={"Post"} />
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container : {
        flex: 1,
    },
    innerContainer : {
        padding: 16
    },
    mainUserDetailsContainer : {
/*         borderWidth : 2, */

    },
    mainProfileDetialsContainer: {
/*         borderWidth: 1, */
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10
      },
      profilePicture: {
        width: 34,
        height: 34,
        borderRadius: 50
      },
      name: {
        fontWeight: 500,
        color: "#000000",
      },
      postField: {
        borderRadius: 5,
		borderColor: colors.BORDER_COLOR,
		borderWidth: 0,
        backgroundColor: "#F3F4F6",
		flex: 1,
		color: "black",
        height: 100,
        textAlignVertical: "top",
      },

      

      mainCategoryButtonsContainer: {
          marginVertical: 5,
          flexDirection: "row",
        },
        categoryButtonsContainer: {
          gap: 10,
          paddingBottom: 10
        },
        categoryButton: {
          backgroundColor: colors.LIGHT_COLOR,
          paddingHorizontal: 20,
          paddingVertical: 4,
          borderRadius: 24,
        },
        categoryText: {
          fontWeight: 500,
          color: colors.BLACK_TEXT_COLOR
        },

        mainActionButtonsContainer :{
            width: "100%",
            marginTop: 5,
            flexDirection: "row",
            gap: 5,
        },
        actionButtonsContainer : {
            gap: 10,
            paddingBottom: 10
        },
        actionButtonText:  {
            fontSize: 12
        },
        actionButtons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        marginVertical: 5,
        gap: 8,
        backgroundColor: colors.LIGHT_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3
    },
        
        
})