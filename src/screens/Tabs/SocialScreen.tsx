import { Button, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { categories } from '../../modals/Post/constants'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { TabParamList } from '../../types/navigation-types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getMBMessages } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
 
export default function SocialScreen() {

  const route = useRoute<RouteProp<TabParamList, 'Social'>>(); 

  const {user} = useUser()
  const [creatingPost, setCreatingPost] = useState<CreatingPostState>({state: false, action: ""})
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [viewingImageUrl, setViewingImageUrl] = useState("")
  const [socialMessages, setSocialMessages] = useState<PostItemProps[]>([]);
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
  useEffect(() => {
    fetchMBMessages()
  }, [userUUID, organizationUUID])

  return (
    <View style={{ flex: 1}}>
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

                    <View style={styles.mainCategoryButtonsContainer}>
                        <ScrollView 
                            scrollEnabled 
                            horizontal 
                            contentContainerStyle={styles.categoryButtonsContainer} 
                            indicatorStyle="black" 
                            showsHorizontalScrollIndicator={true}
                        >
                            {categories.map((eachCategory) => (
                                <CustomButton 
                                    key={eachCategory.value} 
                                    buttonStyle={styles.categoryButton} 
                                    textStyle={styles.categoryText} 
                                    title={eachCategory.title} 
                                    onPress={() => {}} 
                                />
                            ))}
                        </ScrollView>
                    </View>
                </View>
            }
            style={styles.mainPostsContainerList}
            contentContainerStyle={styles.postsContainerList}
            data={socialMessages}
            renderItem={({ item }) => (
                <PostItem showProfileHeader={true} setViewingImageUrl={setViewingImageUrl} post={item} />
            )}
            keyExtractor={(item) => item.MessageBoardUUID}
            onEndReached={fetchMBMessages}
            onEndReachedThreshold={0.5}
        />

        <CustomModal fullScreen onClose={() => setCreatingPost({ state: false, action: "" })} isOpen={creatingPost.state}>
            <CreatePost creatingPost={creatingPost} onClose={() => setCreatingPost({ state: false, action: "" })} />
        </CustomModal>

        <CustomModal onClose={() => setIsDeletingPost(false)} isOpen={isDeletingPost}>
            <DeletePost onClose={() => setIsDeletingPost(false)} />
        </CustomModal>

        <CustomModal onClose={() => setViewingImageUrl("")} isOpen={viewingImageUrl.length > 0}>
            <ImageView onClose={() => setViewingImageUrl("")} imageUrl={viewingImageUrl} />
        </CustomModal>

        <Text>
            HOME SCREEN {user ? user.email : 'No user signed in'}
        </Text>
        <Button title="Sign Out" onPress={handleSignOut} />
    </View>
)
}

const styles = StyleSheet.create({
  container: {
		width: "100%",
		backgroundColor: "white",
    alignItems:"center",
		flexGrow: 1
	},
  createPostContainer : {
/*     borderWidth: 1, */
/*     marginTop: 20, *0
/*     borderRadius: 24, */
    backgroundColor: "white",
    width: "100%",
    paddingTop: 16,
    paddingHorizontal: 12,
  },

  mainPostsContainerList: {
/*     borderWidth: 2, */
    flex: 1,
  },

  postsContainerList: {
/*     borderWidth: 2,
    borderColor: "aqua", */
    flexGrow: 1,
  },

  
  postInputContainer :  {
   /*  borderWidth: 1, */
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
/*     paddingHorizontal: 8, */
    marginVertical: 5,
    gap: 5,
    alignSelf: "stretch",
/*     backgroundColor: "red" */
  },
  postActionText: {
    color: colors.DARK_TEXT,
    fontWeight: 500
  },


  mainCategoryButtonsContainer: {
/*     borderWidth: 1, */
    width: "95%",
    marginTop: 16,
    flexDirection: "row",
    gap: 20,
  },
  categoryButtonsContainer: {
    gap: 10,
    paddingBottom: 10
  },
  categoryButton: {
    backgroundColor: colors.LIGHT_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 24,
  },
  categoryText: {
    fontWeight: 300,
    fontSize: 12,
    color: colors.BLACK_TEXT_COLOR
  }

})