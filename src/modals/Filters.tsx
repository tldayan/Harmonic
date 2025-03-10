import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

interface FiltersProps {
    onClose: () => void
    setFiltering?: React.Dispatch<React.SetStateAction<{state: boolean, categories: string[]}>>
    filtering?: { state: boolean; categories: string[] };
    postCategories?: CategoryProps[]
    setPostCategories?: React.Dispatch<React.SetStateAction<{state: boolean, categories: CategoryProps[]}>>
}


export default function Filters({onClose, setFiltering, filtering, setPostCategories, postCategories} : FiltersProps) {
    const { organizationUUID } = useSelector((state: RootState) => state.auth);

    const [categories, setCategories] = useState<Category[]>([])


      const fetchCategories = async () => {
        try {
    
          if (!organizationUUID) return;
    
          const mainCategories: Category[] = await getAllCategories(organizationUUID);
    
          const categoriesWithNested = await Promise.all(
            mainCategories.map(async (eachCategory: Category) => {
              const nestedCategories = await getCategoryItemsForACategory(
                organizationUUID,
                eachCategory.CategoryUUID
              );
              return { ...eachCategory, nestedCategories };
            })
          );

          setCategories(categoriesWithNested);
        } catch (err) {
          console.error('Error fetching categories:', err);
        }
      };

      useEffect(() => {
        fetchCategories()
      }, [])

      const handleFilter = (categoryUUID: string, categoryName: string) => {

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
                        ?? postCategories?.some(category => category.CategoryItemUUID === eachChildCategory.CategoryItemUUID);
              
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