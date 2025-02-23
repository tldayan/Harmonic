import { Alert, Button, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/AuthContext'
import { handleSignOut } from '../../services/auth-service'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import PostItem from '../../components/PostItem'
import { CustomModal } from '../../components/CustomModal'
import CreatePost from '../../modals/Post/CreatePost'
import DeletePost from '../../modals/Post/DeletePost'
import ImageView from '../../modals/ImageView'
import { CreatingPostState, PostItemProps } from '../../types/post-types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TabParamList } from '../../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getAllCategories, getCategoryItemsForACategory, getMBMessages } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Filters from '../../modals/Filters'
 
export default function SocialScreen() {

  const route = useRoute<RouteProp<TabParamList, 'Social'>>(); 

  const {user} = useUser()
  const [creatingPost, setCreatingPost] = useState<CreatingPostState>({state: false, action: ""})
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [viewingImageUrl, setViewingImageUrl] = useState("")
  const [socialMessages, setSocialMessages] = useState<PostItemProps[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<PostItemProps[]>(socialMessages)
  const [filtering, setFiltering] = useState<{state: boolean; categories: string[]}>({state: false, categories: []})
  const [refreshing, setRefreshing] = useState(false)
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
  const [loading, setLoading] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const {question, options} = route?.params ?? {}
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const { userUUID, organizationUUID } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if(question) {
      console.log("Sending poll req to backend")
    }

      console.log("clear poll params")
      navigation.setParams({ question: null, options: null });

  }, [route?.params?.question]);
  


  const fetchMBMessages = async() => {

      if(loading) return

      setLoading(true)

      try {

        if(organizationUUID && userUUID) {
          const allMBMessages = await getMBMessages(userUUID, organizationUUID, startIndex)
          setSocialMessages(prevMessages => [...prevMessages, ...allMBMessages])
          setStartIndex(prevIndex => prevIndex + 10)
        }
        
        
      } catch(err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
  }


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



  useEffect(() => {
    fetchMBMessages()
    fetchCategories()
  }, [userUUID, organizationUUID])

  useEffect(() => {
    if (filtering.categories.length > 0) {
      setFilteredMessages(
        socialMessages.filter((eachMessage) =>
          eachMessage.AllMBCategoryItems.some((categoryItem) =>
            filtering.categories.includes(categoryItem.CategoryItemUUID)
      )));

    } else {
      setFilteredMessages(socialMessages);
    }
  }, [filtering.categories, socialMessages]);

  const handleRefresh = async() => {
    setRefreshing(true)
    await fetchMBMessages()
    setRefreshing(false)
  } 

  return (
    <View style={styles.mainContainer}>
        <FlatList 
            ListHeaderComponent={
                <View style={styles.container}>
                    <View style={styles.createPostContainer}>
                        <View style={styles.postInputContainer}>
                            {user?.photoURL && (
                                <Image 
                                    source={{ uri: user.photoURL }} 
                                    style={styles.profilePicture} 
                                />
                            )}
                            <CustomButton 
                                buttonStyle={styles.postInputButton} 
                                textStyle={styles.placeholderText} 
                                title={`What’s on your mind, ${user?.displayName}?`} 
                                onPress={() => setCreatingPost({ state: true, action: "" })} 
                            />
                            <CustomButton 
                                buttonStyle={styles.postActionsButton} 
                                textStyle={styles.postActionText} 
                                onPress={() => setCreatingPost({ state: true, action: "media" })} 
                                icon={<Image source={require("../../assets/images/frame.png")} />} 
                            />
                        </View>
                    </View>

                    <View style={styles.filterButtonsContainer}>
                      <CustomButton buttonStyle={styles.filterButton} textStyle={styles.filter} onPress={() => setFiltering((prev) => ({...prev, state: true}))} title={`Filters${filtering.categories.length > 0 ? `(${filtering.categories.length})` : ""}`} />
                      {filtering.categories.length ? <CustomButton textStyle={styles.clearFilter} onPress={() => setFiltering({state: false, categories: []})} title={"Clear Filters"} /> : null}
                    </View>
                </View>
            }
            style={styles.mainPostsContainerList}
            contentContainerStyle={styles.postsContainerList}
            data={filteredMessages}
            renderItem={({ item }) => (
              <PostItem showProfileHeader={true} setViewingImageUrl={setViewingImageUrl} post={item} />
            )}
            keyExtractor={(item) => item.MessageBoardUUID}
            onEndReached={fetchMBMessages}
            onEndReachedThreshold={0.5}
            onRefresh={handleRefresh}
            refreshing={refreshing}
        />

        <CustomModal fullScreen isOpen={creatingPost.state}>
            <CreatePost categories={categories} creatingPost={creatingPost} onClose={() => setCreatingPost({ state: false, action: "" })} />
        </CustomModal>

        <CustomModal onClose={() => setIsDeletingPost(false)} isOpen={isDeletingPost}>
            <DeletePost onClose={() => setIsDeletingPost(false)} />
        </CustomModal>

        <CustomModal onClose={() => setViewingImageUrl("")} isOpen={viewingImageUrl.length > 0}>
            <ImageView onClose={() => setViewingImageUrl("")} imageUrl={viewingImageUrl} />
        </CustomModal>

        <CustomModal fullScreen onClose={() => setFiltering((prev) => ({...prev, state: false}))} isOpen={filtering.state}>
          <Filters categories={categories} filtering={filtering} setFiltering={setFiltering} onClose={() => setFiltering((prev) => ({...prev, state: false}))}  />
        </CustomModal>

        <Text>
            HOME SCREEN {user ? user.email : 'No user signed in'}
        </Text>
        <Button title="Sign Out" onPress={handleSignOut} />
    </View>
)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white"
  },
  container: {
		width: "100%",
		backgroundColor: "white",
    alignItems:"center",
		flexGrow: 1
	},
  createPostContainer : {
    backgroundColor: "white",
    width: "100%",
    paddingTop: 16,
    paddingHorizontal: 12,
  },

  mainPostsContainerList: {
    flex: 1,
  },

  postsContainerList: {
    flexGrow: 1,
  },

  
  postInputContainer :  {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  postInputButton: {
    flexDirection :"row",
    alignItems :"center",
    flex: 1,
    height: 42,
    justifyContent: "flex-start",
},
placeholderText: {
    color: colors.LIGHT_TEXT,  
    fontSize: 14,
},

  profilePicture: {
    width: 34,
    height: 34,
    borderRadius: 50
  },
  seperator: {
		height: 1, 
		backgroundColor: "#e5e7eb",
    marginVertical: 16
  },

  postActionsContainer: {
    flexDirection: "row",
    gap: 5,    
  },

  postActionsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    gap: 5,
    alignSelf: "stretch",
  },
  postActionText: {
    color: colors.DARK_TEXT,
    fontWeight: 500
  },


  filterButtonsContainer: {
    width: "95%",
    marginTop: 16,
    flexDirection: "row",
    gap: 5,
    justifyContent: "flex-end"
  },
  filter: {
    color: colors.PRIMARY_COLOR,
  },
  clearFilter: {
    color: "red"
  },
  filterButton : {
/*     marginLeft: "auto" */
  }

})