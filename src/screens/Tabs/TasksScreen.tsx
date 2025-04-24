import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { CustomTextInput } from '../../components/CustomTextInput'
import SearchIcon from "../../assets/icons/search.svg"
import { defaultInputStyles } from '../../styles/global-styles'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import CirclePlus from "../../assets/icons/circle-plus.svg"
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { FlatList } from 'react-native-gesture-handler'

export default function TasksScreen() {

  const [searchTask, setSearchTask] = useState("")


  return (
    <View>
      <View style={styles.searchTaskContainer}>
        <View style={{flexDirection: "row", alignItems: "center", gap: 10}}>
          <CustomTextInput placeholder='Search Task ID' placeholderTextColor={colors.LIGHT_TEXT} inputStyle={[defaultInputStyles, styles.searchField]} onChangeText={(e) => setSearchTask(e)} value={searchTask} leftIcon={<SearchIcon color={colors.LIGHT_TEXT} width={18} height={18} />} />
          <CustomButton textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, styles.createTask]} icon={<CirclePlus width={15} height={15} />} iconPosition="right" onPress={() => {}} title={"Create Task"} />
        </View>
        
        
        <ScrollView horizontal contentContainerStyle={styles.taskStageButtonsContainer}>
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"All orders"} />
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"Processed task"} />
          <CustomButton buttonStyle={styles.taskStageButtons} textStyle={{color: colors.INDIGO}} onPress={() => {}} title={"Completed tasks"} />
        </ScrollView>

        {/* <FlatList  /> */}


      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  searchTaskContainer: {
/*     borderWidth: 1, */
    backgroundColor: "white",
    padding: 15,
    width: "95%",
    alignItems: "center",
    gap: 5,
    alignSelf: "center",
    marginTop: 25,
    borderRadius: 15
  },
  searchField : {
    paddingLeft: 40,
    borderColor: colors.BORDER_COLOR,
		borderWidth: 1,
  },
  createTask: {
    paddingHorizontal: 15,
    backgroundColor: colors.BRIGHT_ORANGE,
  },

    taskStageButtonsContainer: {
    backgroundColor: "white",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  taskStageButtons: {
    /*     borderWidth: 1, */
        paddingHorizontal: 15,
        paddingVertical:5,
        borderRadius: 50,
        backgroundColor: colors.LIGHT_COLOR,
        marginVertical: 10
      }

})