import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'

interface PollProps {
 onClose: () => void  
}

export default function CreatePoll({onClose} : PollProps) {

  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState([{optionId : 1, value: ""},{optionId : 2, value: ""}])


  const checkOptionFields = () => {
    let emptyFields = options.filter(option => option.value === "").length
    
    if(emptyFields >= 2) {
      setOptions((prevOptions) => prevOptions.slice(0, -1));
    }
  }

  const handleChangeText = (text: string, optionId: number) => {
  
    setOptions((prevOptions) => {

      let lastOption = prevOptions[prevOptions.length - 1]
      let lastOptionId = lastOption.optionId;

      let updatedOptions = prevOptions.map((eachOption) =>
        eachOption.optionId === optionId ? { ...eachOption, value: text } : eachOption
      );

      if(lastOptionId === optionId && text !== "") {
        let newOption = {optionId: lastOptionId + 1, value: ""}
        updatedOptions = [...updatedOptions, newOption]
      }
      
      return updatedOptions
    });

    checkOptionFields()

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>

      
      <ModalsHeader title='Create Poll' onClose={onClose} />
      <CustomTextInput placeholder='Ask Question' value={question} inputStyle={styles.questionField} onChangeText={(e) => setQuestion(e)} placeholderTextColor={colors.LIGHT_TEXT_COLOR} label='Question' />

      <Text>Options</Text>
      {options.map((eachOption) => {
        return (
          <CustomTextInput onChangeText={(text) => handleChangeText(text, eachOption.optionId)} placeholderTextColor={colors.LIGHT_TEXT_COLOR}  key={eachOption.optionId} value={eachOption.value} placeholder='+ Add' onPress={() => {}} />
        )
      })}
    
    </View>
   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
},
innerContainer: {
  paddingHorizontal: 16
},
questionField : {
  borderRadius: 5,
  borderColor: colors.BORDER_COLOR,
  borderWidth: 0,
  borderBottomWidth: 2,
  backgroundColor: "transparent",
  flex: 1,
  marginTop: 10,
  color: "black",
  height: "auto",
  paddingHorizontal: 0,
  textAlignVertical: "top",
}
})