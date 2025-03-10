import { Alert, Button, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/AuthContext'
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
import { getMBMessages } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Filters from '../../modals/Filters'
 
export default function SocialScreen() {

  const route = useRoute<RouteProp<TabParamList, 'Social'>>(); 

  const {user} = useUser()
  const [creatingPost, setCreatingPost] = useState<CreatingPostState>({state: false, action: ""})
  const [isDeletingPost, setIsDeletingPost] = useState(false)
/*   const [viewingImageUrl, setViewingImageUrl] = useState("") */
  const [socialMessages, setSocialMessages] = useState<PostItemProps[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<PostItemProps[]>(socialMessages)
  const [filtering, setFiltering] = useState<{state: boolean; categories: string[]}>({state: false, categories: []})
  const [refreshing, setRefreshing] = useState(false)
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
          setSocialMessages((prevMessages) => {

            const messageMap = new Map([...prevMessages, ...allMBMessages].map(msg => [msg.MessageBoardUUID, msg]));

            return Array.from(messageMap.values());
          });
          setStartIndex(prevIndex => prevIndex + 10)
        }
        
        
      } catch(err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
  }



  useEffect(() => {
    fetchMBMessages()
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

  const fetchLatestMessages = async() => {
    const allMBMessages = await getMBMessages(userUUID, organizationUUID, 0)

    setSocialMessages(allMBMessages)
  }

  const handleRefresh = async() => {
    setRefreshing(true)
    await fetchLatestMessages()
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
              <PostItem showProfileHeader={true} /* setViewingImageUrl={setViewingImageUrl} */ post={item} />
            )}
            keyExtractor={(item) => item.MessageBoardUUID}
            onEndReached={fetchMBMessages}
            onEndReachedThreshold={0.5}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
        />

        <CustomModal fullScreen isOpen={creatingPost.state}>
            <CreatePost creatingPost={creatingPost} onClose={() => setCreatingPost({ state: false, action: "" })} />
        </CustomModal>

        <CustomModal onClose={() => setIsDeletingPost(false)} isOpen={isDeletingPost}>
            <DeletePost onClose={() => setIsDeletingPost(false)} />
        </CustomModal>

{/*         <CustomModal onClose={() => setViewingImageUrl("")} isOpen={viewingImageUrl.length > 0}>
            <ImageView onClose={() => setViewingImageUrl("")} imageUrl={viewingImageUrl} />
        </CustomModal> */}

        <CustomModal presentationStyle="formSheet" fullScreen onClose={() => setFiltering((prev) => ({...prev, state: false}))} isOpen={filtering.state}>
          <Filters filtering={filtering} setFiltering={setFiltering} onClose={() => setFiltering((prev) => ({...prev, state: false}))}  />
        </CustomModal>

    </View>
)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.MAIN_BACKGROUND_COLOR
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
/*     gap: 10 */
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
    color: colors.ACCENT_COLOR,
  },
  clearFilter: {
    color: colors.RED_TEXT
  },
  filterButton : {
/*     marginLeft: "auto" */
  }

})