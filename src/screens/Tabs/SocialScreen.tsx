import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { FlashList } from '@shopify/flash-list';
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import PostItem from '../../components/FlatlistItems/PostItem'
import { CustomModal } from '../../components/CustomModal'
import CreatePost from '../../modals/Post/CreatePost'
import DeletePost from '../../modals/Post/DeletePost'
import { CreatingPostState, PostItemProps } from '../../types/post-types'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TabParamList } from '../../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getMBMessageDetails, getMBMessages, getMBMessagesForUserProfile } from '../../api/network-utils'
import { useDispatch } from 'react-redux'
import Filters from '../../modals/Filters'
import { updateLikes } from '../../store/slices/postLikesSlice'
import { useCreds } from '../../hooks/useCreds';
 
interface SocialScreenProps {
  authUserUUID?: string
}

export default function SocialScreen({authUserUUID}: SocialScreenProps) {
  const route = useRoute<RouteProp<TabParamList, 'Social'>>(); 
  const navigation = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const [creatingPost, setCreatingPost] = useState<CreatingPostState>({state: false, action: ""})
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [socialMessages, setSocialMessages] = useState<PostItemProps[]>([]);
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [filtering, setFiltering] = useState<{state: boolean; categories: string[]}>({state: false, categories: []})
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [startIndex, setStartIndex] = useState(0)
  const {question, options} = route?.params ?? {}

  const { userUUID: stateUserUUID, organizationUUID } = useCreds();

  const userUUID = authUserUUID ?? stateUserUUID;
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(question) {
      console.log("Sending poll req to backend")
    }

      console.log("clear poll params")
      navigation.setParams({ question: null, options: null });

  }, [route?.params?.question]);
  


  const fetchMBMessages = async() => {
      if(loading || !hasMoreMessages) return

      setLoading(true)

      try {

        if(organizationUUID && userUUID) {
          const allMBMessages = route.name === "Social" ? 
          await getMBMessages(userUUID, organizationUUID, startIndex) : 
          await getMBMessagesForUserProfile(userUUID, organizationUUID, startIndex)
          
          if(allMBMessages.length < 10) {
            setHasMoreMessages(false)
          }

          const userLikedMessages: PostItemProps[] = allMBMessages.filter((eachMessage: PostItemProps) => eachMessage.HasLiked);
          dispatch(updateLikes(userLikedMessages))

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

  const filteredMessages = useMemo(() => {
    return socialMessages.filter((eachMessage) => {
      const matchesCategory =
        filtering.categories.length === 0 ||
        eachMessage.AllMBCategoryItems.some((categoryItem) =>
          filtering.categories.includes(categoryItem.CategoryItemUUID)
        );
  
      return matchesCategory
    });
  }, [socialMessages, filtering.categories, userUUID]);
  

  const fetchLatestMessages = async(messageBoardUUID?: string) => {

    if(messageBoardUUID) {

      const latestMessage = await getMBMessageDetails(messageBoardUUID, userUUID)

      setSocialMessages((prev) =>
        prev.map((eachMessage) => {
          return eachMessage.MessageBoardUUID === messageBoardUUID ? latestMessage : eachMessage
        })
      );
      return
    } 

    setHasMoreMessages(true)
    setStartIndex(0)
    const allMBMessages = route.name === "Social" ? 
    await getMBMessages(userUUID, organizationUUID, 0) : 
    await getMBMessagesForUserProfile(userUUID, organizationUUID, 0)

    setSocialMessages(allMBMessages)
  }

  const handleRefresh = async() => {
    setRefreshing(true)
    await fetchLatestMessages()
    setRefreshing(false)
  } 


  return (
    <View style={[styles.mainContainer]}>
        {(!filteredMessages.length && !loading && !filtering.state) ? <Text style={styles.noPosts}>No posts yet.</Text> : <FlashList 
            ListHeaderComponent={
                <View style={styles.container}>
                    <View style={styles.filterButtonsContainer}>
                      <CustomButton textStyle={styles.filter} onPress={() => setFiltering((prev) => ({...prev, state: true}))} title={`Filters${filtering.categories.length > 0 ? `(${filtering.categories.length})` : ""}`} />
                      {filtering.categories.length ? <CustomButton textStyle={styles.clearFilter} onPress={() => setFiltering({state: false, categories: []})} title={"Clear Filters"} /> : null}
                    </View>
                </View> 
            }
            contentContainerStyle={styles.postsContainerList}
            estimatedItemSize={170}
            data={filteredMessages}
            renderItem={({ item } : {item: PostItemProps}) => (
              <PostItem fetchLatestMessages={fetchLatestMessages} showProfileHeader={true} post={item} />
            )}
            keyExtractor={(item) => item.MessageBoardUUID}
            onEndReached={fetchMBMessages}
            onEndReachedThreshold={0.5} 
            onRefresh={handleRefresh}
            refreshing={refreshing}
            scrollEnabled={filteredMessages.length > 0}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={loading ? <ActivityIndicator size={"small"} style={{marginVertical: "50%"}} /> : null}
        />}

        {(filteredMessages.length === 0 && filtering.categories.length !== 0) && <View style={styles.noResultsContainer}>
          <Text style={styles.noResults}>No posts found for selected filters</Text>
        </View>}

        {creatingPost.state && <CustomModal fullScreen>
          <CreatePost fetchLatestMessages={fetchLatestMessages} creatingPost={creatingPost} onClose={() => setCreatingPost({ state: false, action: "" })} />
        </CustomModal>}

        {isDeletingPost && <CustomModal onClose={() => setIsDeletingPost(false)}>
          <DeletePost onClose={() => setIsDeletingPost(false)} />
        </CustomModal>}

        {filtering.state && <CustomModal presentationStyle="formSheet" fullScreen onClose={() => setFiltering((prev) => ({...prev, state: false}))}>
          <Filters filtering={filtering} setFiltering={setFiltering} onClose={() => setFiltering((prev) => ({...prev, state: false}))}  />
        </CustomModal>}

        

    </View>
)
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.LIGHT_COLOR,
  },
  container: {
		width: "100%",
    alignItems:"center",
		flexGrow: 1
	},

  postsContainerList: {
    paddingBottom: 100
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
    marginBottom: 10,
  },
  clearFilter: {
    color: colors.RED_TEXT
  },
  noResultsContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    padding: 20,
  },
  noResults : {
    color: colors.LIGHT_TEXT,
  },
  noPosts: {
    color: colors.LIGHT_TEXT,
    textAlign: "center",
    fontSize: 16,
    fontWeight: 500,
    marginVertical: "50%"
  }

})