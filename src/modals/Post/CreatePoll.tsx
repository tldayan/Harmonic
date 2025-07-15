import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import ModalsHeader from '../ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TabParamList } from '../../types/navigation-types'
import { filterOptions } from './postUtils'

interface PollProps {
 onClose: () => void  
 closeAllModals: () => void
}

let initialOptionsState = [
  { optionId: 1, value: "", errorMessage: "" },
  { optionId: 2, value: "", errorMessage: "" }
]

export default function CreatePoll({onClose,closeAllModals} : PollProps) {

  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(initialOptionsState);
  const [errorMessage, setErrorMessage] = useState("")

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [options]); 

  const checkOptionFields = () => {
    let emptyFields = options.filter(option => option.value === "").length;
    if (emptyFields > 2) {
      setOptions(prevOptions => prevOptions.slice(0, -1));
    }
  };

  const handleChangeText = (text: string, optionId: number) => {
    setOptions(prevOptions => {
      let updatedOptions = prevOptions.map(eachOption => {
        const isDuplicate = prevOptions.some(
          option => option.optionId !== optionId && option.value === text
        );

        return eachOption.optionId === optionId
          ? {
              ...eachOption,
              value: text,
              errorMessage: isDuplicate && text !== "" ? "This option already exists" : "",
            }
          : eachOption;
      });

      let lastOption = updatedOptions[updatedOptions.length - 1];

      if (lastOption.optionId === optionId && text !== "") {
        updatedOptions.push({ optionId: lastOption.optionId + 1, value: "", errorMessage: "" });
      }

      return updatedOptions;
    });

    checkOptionFields();
  };


  const handlePost = () => {

    setErrorMessage("")

    if(question === "") {
      setErrorMessage("Please add a question")
      return
    }


    let updatedOptions = filterOptions(options)
    if(updatedOptions.length < 2) {

      const optionsWithErrors = options.map((eachOption) => ({
        ...eachOption,
        errorMessage: eachOption.value === "" ? "Please enter an option" : eachOption.errorMessage
      }));
      
        setOptions(optionsWithErrors)

        return
    }

     
      navigation.navigate('Social', {
        question: question,
        options: updatedOptions,
      });
      setOptions(initialOptionsState)
       closeAllModals()
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <ModalsHeader title="Create Poll" onClose={onClose} />
        <CustomTextInput
          placeholder="Ask Question"
          value={question}
          noBackground
          inputStyle={styles.questionField}
          errorMessage={errorMessage}
          onChangeText={e => setQuestion(e)}
          placeholderTextColor={colors.LIGHT_TEXT_COLOR}
          label="Poll Question"
        />

        <Text style={styles.optionsTitle}>Options</Text>
        <ScrollView
          ref={scrollViewRef}
          style={styles.mainOptionsContainer}
          contentContainerStyle={styles.optionsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {options.map(eachOption => {
            return (
              <CustomTextInput
                key={eachOption.optionId}
                errorMessage={eachOption.errorMessage}
                inputStyle={[
                  styles.optionsField,
                  eachOption.value && { borderColor: colors.PRIMARY_COLOR },
                ]}
                onChangeText={text => handleChangeText(text, eachOption.optionId)}
                placeholderTextColor={colors.LIGHT_TEXT_COLOR}
                value={eachOption.value}
                placeholder="+ Add"
                onPress={() => {}}
              />
            );
          })}
        </ScrollView>
        <CustomButton  onPress={handlePost} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={PRIMARY_BUTTON_STYLES} title='Post' />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 16,
  },
  questionField: {
    borderRadius: 5,
    borderColor: colors.PRIMARY_COLOR,
    borderWidth: 0,
    borderBottomWidth: 2,
    backgroundColor: "transparent",
    marginTop: 10,
    padding: 10,
    color: "black",
    height: "auto",
    paddingHorizontal: 3,
    textAlignVertical: "top",
    flex: 1,
  },
  optionsTitle: {
    marginTop: 20,
    color: colors.LIGHT_TEXT
  },
  mainOptionsContainer: {
/*     borderWidth: 1, */
    maxHeight: 300,
  },
  optionsContainer: {
    marginTop: 10,
    gap: 10,
  },
  optionsField: {
/*     borderWidth: 1, */
    flex: 1,
  },
});
