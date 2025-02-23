import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getAllCategories, getCategoryItemsForACategory } from '../api/network-utils'
import ModalsHeader from './ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { colors } from '../styles/colors'
import CheckIcon from "../assets/icons/check.svg"
import CustomButton from '../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../styles/button-styles'

interface FiltersProps {
    onClose: () => void
    setFiltering?: React.Dispatch<React.SetStateAction<{state: boolean, categories: string[]}>>
    filtering?: { state: boolean; categories: string[] };
    categories: Category[]
    postCategories?: string[]
    setPostCategories?: React.Dispatch<React.SetStateAction<{state: boolean, categories: string[]}>>
}


export default function Filters({onClose, setFiltering, filtering, categories, setPostCategories, postCategories} : FiltersProps) {
        
      const handleFilter = (categoryUUID: string) => {

        if(setPostCategories) {

            let isCategoryExisiting = postCategories?.some(eachCategory => eachCategory === categoryUUID)
            if(isCategoryExisiting) {
                setPostCategories((prev) => ({...prev, categories: prev.categories.filter(eachCategory => eachCategory !== categoryUUID)}))
            } else {
                  setPostCategories((prev) => ({...prev, categories: [...prev.categories, categoryUUID]}))
            }
          
            return
        }


        const categoryApplied = filtering?.categories.includes(categoryUUID);

        if(setFiltering) {
            if(categoryApplied) {
            setFiltering((prev) => ({
            ...prev,
            categories: prev.categories.filter((eachCategory) => eachCategory !== categoryUUID),
            }));
            } else {
                setFiltering((prev) => ({...prev,  categories: [...prev.categories, categoryUUID]}))
            }
        }
        
      }

  return (
    <SafeAreaView style={styles.container}>
      <ModalsHeader onClose={onClose} title={setPostCategories ? "Apply Categories" : 'Apply Filters'} />
      <ScrollView contentContainerStyle={styles.categoryContainer} style={styles.innerContainer}>
        {categories.map((eachCategory) => {
            return (
                <View key={eachCategory.CategoryUUID} /* style={styles.categoryContainer} */>
                    <Text style={styles.mainCategory}>{eachCategory.CategoryName}</Text>
                    <View style={styles.mainChildCategoryContainer}>
                        {eachCategory.nestedCategories.map((eachChildCategory: NestedCategory) => {
                        const isSelected = filtering?.categories.includes(eachChildCategory.CategoryItemUUID) 
                        ?? postCategories?.some(category => category === eachChildCategory.CategoryItemUUID);
              
                        return (
                            <TouchableOpacity key={eachChildCategory.CategoryItemUUID} onPress={() => handleFilter(eachChildCategory.CategoryItemUUID)} style={[styles.childCategoryContainer]}>
                                <View style={[styles.checkbox, isSelected && {backgroundColor : colors.PRIMARY_COLOR, borderWidth: 0}]}>
                                  {isSelected && <CheckIcon />}
                                </View>
                                <Text>{eachChildCategory.CategoryItemName}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    </View>
                </View>
            )
        })}
      </ScrollView>
      <CustomButton onPress={onClose} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, {width: "70%", marginHorizontal: "15%" }]} title={"Done"} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    },
    innerContainer : {
/*         borderWidth: 2, */
        padding: 16,
    },
    mainCategory: {
        borderTopWidth: 2,
        borderColor: colors.LIGHT_COLOR,
        fontSize: 16,
        fontWeight: 500,
        paddingTop: 20,
        paddingBottom: 10
    },
    mainChildCategoryContainer: {
        gap: 10,
        paddingLeft: 20
    },
    childCategoryContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    categoryContainer: {
/*         borderWidth: 1, */
        gap: 10
    },
    checkbox: {
        alignItems: "center",
        justifyContent: "center",
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: colors.BORDER_COLOR
    }
})