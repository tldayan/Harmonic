import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
    setFiltering: React.Dispatch<React.SetStateAction<{state: boolean, filters: string[]}>>
    filtering: { state: boolean; filters: string[] };
}


export default function Filters({onClose, setFiltering, filtering} : FiltersProps) {

    const [categories, setCategories] = useState<Category[]>([
        {
            "CategoryUUID": "e4d741b1-c12b-11ef-b36c-42010a400004",
            "CategoryName": "Industry",
            "CategoryDescription": null,
            "CategoryIcon": null,
            "CategoryBanner": null,
            "CategoryURL": "industry",
            "ModuleCoreUUID": null,
            "IsSystemCategory": true,
            "IsEditable": false,
            "ShowInFilter": true,
            "ShowInFavorite": true,
            "NoOfChildren": 1,
            "HasChildren": 1,
            "nestedCategories": [
                {
                    "CategoryItemUUID": "e4d86c81-c12b-11ef-b36c-42010a400004",
                    "CategoryUUID": "e4d741b1-c12b-11ef-b36c-42010a400004",
                    "CategoryItemName": "Property Management",
                    "CategoryItemDescription": null,
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": "property-management"
                }
            ]
        },
        {
            "CategoryUUID": "4dcaccfa-05a5-4387-9f17-f4fdba6788ef",
            "CategoryName": "PR-test ss",
            "CategoryDescription": "Test1",
            "CategoryIcon": "https://firebasestorage.googleapis.com/v0/b/harmonicdevapp.appspot.com/o/uploads%2Fcategory%2F1735040091248_pexels-sincegameon-28396375.jpg?alt=media&token=116e6752-6f15-4d23-80ad-d4d28e7dc4b4",
            "CategoryBanner": "https://firebasestorage.googleapis.com/v0/b/harmonicdevapp.appspot.com/o/uploads%2Fcategory%2F1735040078203_download%20(1).jpg?alt=media&token=6829db5c-b800-41ef-bd6b-6a8c1154d946",
            "CategoryURL": "",
            "ModuleCoreUUID": "f0b6ca3e-c12b-11ef-b36c-42010a400004",
            "IsSystemCategory": null,
            "IsEditable": true,
            "ShowInFilter": true,
            "ShowInFavorite": true,
            "NoOfChildren": 0,
            "HasChildren": 0,
            "nestedCategories": [
                {
                    "CategoryItemUUID": "5df86b8d-08ff-455c-a406-ec3c08ec0fca",
                    "CategoryUUID": "4dcaccfa-05a5-4387-9f17-f4fdba6788ef",
                    "CategoryItemName": "Dummy",
                    "CategoryItemDescription": "Dummy daa",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "c58f6630-1857-4400-8711-6369c25b4bd7",
                    "CategoryUUID": "4dcaccfa-05a5-4387-9f17-f4fdba6788ef",
                    "CategoryItemName": "Test item",
                    "CategoryItemDescription": "Test item",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "398def10-0ed7-4bfc-bc65-224e33275c0e",
                    "CategoryUUID": "4dcaccfa-05a5-4387-9f17-f4fdba6788ef",
                    "CategoryItemName": "Test Category Item 1 ",
                    "CategoryItemDescription": "test",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                }
            ]
        },
        {
            "CategoryUUID": "0623ea72-fb97-45e1-81c4-7fa4e6e83a19",
            "CategoryName": "Asset Category #1 - PR",
            "CategoryDescription": "Asset Category #1 Description",
            "CategoryIcon": null,
            "CategoryBanner": null,
            "CategoryURL": "",
            "ModuleCoreUUID": "f0bceab7-c12b-11ef-b36c-42010a400004",
            "IsSystemCategory": null,
            "IsEditable": true,
            "ShowInFilter": true,
            "ShowInFavorite": true,
            "NoOfChildren": 0,
            "HasChildren": 0,
            "nestedCategories": [
                {
                    "CategoryItemUUID": "241d6f19-c446-433e-82ee-87e72111723e",
                    "CategoryUUID": "0623ea72-fb97-45e1-81c4-7fa4e6e83a19",
                    "CategoryItemName": "Asset Category #1 Item #1",
                    "CategoryItemDescription": "Asset Category #1 Item #1 Desc",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "21ccaa7f-cb8a-4127-b487-d1f222d56d2e",
                    "CategoryUUID": "0623ea72-fb97-45e1-81c4-7fa4e6e83a19",
                    "CategoryItemName": "Asset Category Item #2",
                    "CategoryItemDescription": "Asset Category Item #2 Desc",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                }
            ]
        },
        {
            "CategoryUUID": "36a502bf-d4cd-11ef-bdd1-42010a400005",
            "CategoryName": "Location Level 1",
            "CategoryDescription": "Location Level 1 desc - 2",
            "CategoryIcon": null,
            "CategoryBanner": null,
            "CategoryURL": "",
            "ModuleCoreUUID": "f0bceab7-c12b-11ef-b36c-42010a400004",
            "IsSystemCategory": false,
            "IsEditable": true,
            "ShowInFilter": true,
            "ShowInFavorite": true,
            "NoOfChildren": 1,
            "HasChildren": 1,
            "nestedCategories": [
                {
                    "CategoryItemUUID": "948164ea-d707-11ef-bdd1-42010a400005",
                    "CategoryUUID": "36a502bf-d4cd-11ef-bdd1-42010a400005",
                    "CategoryItemName": "Al Barsha",
                    "CategoryItemDescription": null,
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": "al-barsha"
                },
                {
                    "CategoryItemUUID": "147fa952-d97e-11ef-bdd1-42010a400005",
                    "CategoryUUID": "36a502bf-d4cd-11ef-bdd1-42010a400005",
                    "CategoryItemName": "Asia",
                    "CategoryItemDescription": null,
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": "asia"
                },
                {
                    "CategoryItemUUID": "14b895f3-d97e-11ef-bdd1-42010a400005",
                    "CategoryUUID": "36a502bf-d4cd-11ef-bdd1-42010a400005",
                    "CategoryItemName": "America",
                    "CategoryItemDescription": " ",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "14ea8872-d97e-11ef-bdd1-42010a400005",
                    "CategoryUUID": "36a502bf-d4cd-11ef-bdd1-42010a400005",
                    "CategoryItemName": "Europe",
                    "CategoryItemDescription": null,
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": "europe"
                }
            ]
        },
        {
            "CategoryUUID": "f4559104-09ef-4b42-92bb-20a620066a17",
            "CategoryName": "Asset Category",
            "CategoryDescription": "Category for assets",
            "CategoryIcon": null,
            "CategoryBanner": null,
            "CategoryURL": "",
            "ModuleCoreUUID": "f0b6c819-c12b-11ef-b36c-42010a400004",
            "IsSystemCategory": null,
            "IsEditable": true,
            "ShowInFilter": true,
            "ShowInFavorite": false,
            "NoOfChildren": 0,
            "HasChildren": 0,
            "nestedCategories": [
                {
                    "CategoryItemUUID": "ab106d7c-ffc0-4b38-b86f-3df6fc7b53b6",
                    "CategoryUUID": "f4559104-09ef-4b42-92bb-20a620066a17",
                    "CategoryItemName": "Category #1",
                    "CategoryItemDescription": "Category #1 Desc",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "25b51e4c-ee66-4b14-b9d7-fff9ac6bee33",
                    "CategoryUUID": "f4559104-09ef-4b42-92bb-20a620066a17",
                    "CategoryItemName": "Category #2",
                    "CategoryItemDescription": "Category #2 Desc",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "c5dfedf5-bc78-4364-a090-f6e6764e8163",
                    "CategoryUUID": "f4559104-09ef-4b42-92bb-20a620066a17",
                    "CategoryItemName": "Category #3",
                    "CategoryItemDescription": "Category #3",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                }
            ]
        },
        {
            "CategoryUUID": "b67cd0a1-9153-4122-85e9-601ebe16b1f4",
            "CategoryName": "Work Request Priority",
            "CategoryDescription": "Select priority level for Work Request",
            "CategoryIcon": null,
            "CategoryBanner": null,
            "CategoryURL": "",
            "ModuleCoreUUID": "f0b6c819-c12b-11ef-b36c-42010a400004",
            "IsSystemCategory": null,
            "IsEditable": true,
            "ShowInFilter": true,
            "ShowInFavorite": false,
            "NoOfChildren": 0,
            "HasChildren": 0,
            "nestedCategories": [
                {
                    "CategoryItemUUID": "1d0abef2-ed8f-4bdd-9a82-381029b4e18e",
                    "CategoryUUID": "b67cd0a1-9153-4122-85e9-601ebe16b1f4",
                    "CategoryItemName": "High",
                    "CategoryItemDescription": "High",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "983a938c-c804-4525-9498-3db8fd1acb0d",
                    "CategoryUUID": "b67cd0a1-9153-4122-85e9-601ebe16b1f4",
                    "CategoryItemName": "Medium",
                    "CategoryItemDescription": "Medium",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "bd5637e9-b90f-45a7-80c4-b8885a9e3f50",
                    "CategoryUUID": "b67cd0a1-9153-4122-85e9-601ebe16b1f4",
                    "CategoryItemName": "Low",
                    "CategoryItemDescription": "Low",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                },
                {
                    "CategoryItemUUID": "2233824d-9ba4-4a73-9783-d88211b1cae6",
                    "CategoryUUID": "b67cd0a1-9153-4122-85e9-601ebe16b1f4",
                    "CategoryItemName": "Emergency",
                    "CategoryItemDescription": "Emergency",
                    "CategoryItemIcon": null,
                    "CategoryItemBanner": null,
                    "CategoryItemURL": ""
                }
            ]
        }
    ])

    const organizationUUID = useSelector((state: RootState) => state.auth.organizationUUID);

    /* useEffect(() => {
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
            console.log(categoriesWithNested)
            setCategories(categoriesWithNested);
          } catch (err) {
            console.error('Error fetching categories:', err);
          }
        };
    
        if (organizationUUID) {
          fetchCategories();
        }
    
        return () => {
          setCategories([]); 
        };
      }, [organizationUUID]);  */

      const handleFilter = (categoryUUID: string) => {

        const categoryApplied = filtering.filters.includes(categoryUUID);

        if(categoryApplied) {
            setFiltering((prev) => ({
            ...prev,
            filters: prev.filters.filter((eachCategory) => eachCategory !== categoryUUID),
            }));
        } else {
            setFiltering((prev) => ({...prev,  filters: [...prev.filters, categoryUUID]}))
        }
      }

  return (
    <SafeAreaView style={styles.container}>
      <ModalsHeader onClose={onClose} title='Apply Filters' />
      <ScrollView contentContainerStyle={styles.categoryContainer} style={styles.innerContainer}>
        {categories.map((eachCategory) => {
            return (
                <View key={eachCategory.CategoryUUID} /* style={styles.categoryContainer} */>
                    <Text style={styles.mainCategory}>{eachCategory.CategoryName}</Text>
                    <View style={styles.mainChildCategoryContainer}>
                        {eachCategory.nestedCategories.map((eachChildCategory: NestedCategory) => {
                            const isSelected = filtering.filters.includes(eachChildCategory.CategoryItemUUID)
                        return (
                            <TouchableOpacity key={eachChildCategory.CategoryItemUUID} onPress={() => handleFilter(eachChildCategory.CategoryItemUUID)} style={[styles.childCategoryContainer, ]}>
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