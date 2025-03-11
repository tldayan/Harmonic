import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from './ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '../styles/colors'
import CheckIcon from "../assets/icons/check.svg"
import CustomButton from '../components/CustomButton'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../styles/button-styles'
import { CategoryProps } from '../types/post-types'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { getAllCategories, getCategoryItemsForACategory } from '../api/network-utils'
import { fetchWithErrorHandling } from '../utils/helpers'
import Toast from 'react-native-toast-message'

interface FiltersProps {
    onClose: () => void
    setFiltering?: React.Dispatch<React.SetStateAction<{state: boolean, categories: string[]}>>
    filtering?: { state: boolean; categories: string[] };
    postCategories?: CategoryProps[]
    setPostCategories?: React.Dispatch<React.SetStateAction<{state: boolean, categories: CategoryProps[]}>>
    editingCategories?: CategoryProps[]
    setEditingCategories?: React.Dispatch<React.SetStateAction<CategoryProps[]>>
}


export default function Filters({onClose, setFiltering, filtering, setPostCategories, postCategories,editingCategories,setEditingCategories} : FiltersProps) {

    const { organizationUUID } = useSelector((state: RootState) => state.auth);

    const [categories, setCategories] = useState<Category[]>([])


      const fetchCategories = async () => {
    
          if (!organizationUUID) return;
    
          const mainCategories: Category[] = await fetchWithErrorHandling(getAllCategories, organizationUUID);
    
          const categoriesWithNested = await Promise.all(
            mainCategories.map(async (eachCategory: Category) => {
              const nestedCategories = await fetchWithErrorHandling(getCategoryItemsForACategory,
                organizationUUID,
                eachCategory.CategoryUUID
              );
              return { ...eachCategory, nestedCategories };
            })
          );
          console.log(categoriesWithNested)
          setCategories(categoriesWithNested);

      };

      useEffect(() => {
        fetchCategories()
      }, [])

      const handleFilter = (categoryUUID: string, categoryName: string) => {

        if(editingCategories && editingCategories?.length > 0) {

          const isCategoryExisting = editingCategories.some((category) => category.CategoryItemUUID === categoryUUID && category.existing)

          if(isCategoryExisting) {

            setEditingCategories?.((prev) => prev.map((eachCategory) => 
            eachCategory.CategoryItemUUID === categoryUUID ? {...eachCategory, isDeleted : !eachCategory.isDeleted, existing: !eachCategory.existing} : eachCategory
          ))

          } else {

            let newCategory = {
              "MessageBoardCategoryUUID": null,
              "CategoryItemUUID": categoryUUID,
              "CategoryItemName": categoryName,
              "isDeleted": false,
              "existing": true
            }

            setEditingCategories?.((prev) => [...prev, newCategory])

          }
          
          return
        }

        if(setPostCategories) {

            const newCategory: CategoryProps = { CategoryItemUUID: categoryUUID, CategoryItemName: categoryName}

            let isCategoryExisiting = postCategories?.some((eachCategory) => eachCategory.CategoryItemUUID === categoryUUID)
            if(isCategoryExisiting) {
                setPostCategories((prev) => ({...prev, categories: prev.categories.filter((eachCategory) => eachCategory.CategoryItemUUID !== categoryUUID)}))
            } else {
                  setPostCategories((prev) => ({...prev, categories: [...prev.categories, newCategory]}))
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
      {categories.length === 0 &&  <ActivityIndicator style={{marginTop: "50%"}} size={"small"} color={"black"} />}
      <ScrollView contentContainerStyle={styles.categoryContainer} style={styles.innerContainer}>
        {categories?.map((eachCategory) => {
            return (
                <View key={eachCategory.CategoryUUID} /* style={styles.categoryContainer} */>
                    <Text style={styles.mainCategory}>{eachCategory.CategoryName}</Text>
                    <View style={styles.mainChildCategoryContainer}>
                        {eachCategory.nestedCategories.map((eachChildCategory: NestedCategory) => {
                        const isSelected = filtering?.categories.includes(eachChildCategory.CategoryItemUUID) 
                        || postCategories?.some(category => category.CategoryItemUUID === eachChildCategory.CategoryItemUUID) || editingCategories?.some(category => category.existing === true && category.CategoryItemUUID === eachChildCategory.CategoryItemUUID)
              
                        return (
                            <TouchableOpacity key={eachChildCategory.CategoryItemUUID} onPress={() => handleFilter(eachChildCategory.CategoryItemUUID, eachChildCategory.CategoryItemName)} style={[styles.childCategoryContainer]}>
                                <View style={[styles.checkbox, isSelected && {backgroundColor : colors.PRIMARY_COLOR, borderWidth: 0}]}>
                                  {isSelected && <CheckIcon />}
                                </View>
                                <Text style={styles.categoryText}>{eachChildCategory.CategoryItemName}</Text>
                            </TouchableOpacity>
                        )
                    })}
                    </View>
                </View>
            )
        })}
      </ScrollView>
      <CustomButton onPress={onClose} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, {width: "70%", marginHorizontal: "15%"}]} title={"Done"} />
      <Toast />
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
        fontSize: 16,
        fontWeight: 300,
        paddingTop: 20,
        paddingBottom: 5
    },
    mainChildCategoryContainer: {
/*         borderWidth: 1, */
        backgroundColor: colors.BACKGROUND_COLOR,
        borderRadius: 5,
        padding: 10,
        gap: 10,
      /*   paddingLeft: 20 */
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
    categoryText: {
        fontWeight: 300
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