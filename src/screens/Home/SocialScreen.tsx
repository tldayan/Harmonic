import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '../../context/AuthContext'
import { handleSignOut } from '../../services/auth-service'
import { CustomTextInput } from '../../components/CustomTextInput'
import { colors } from '../../styles/colors'
import CustomButton from '../../components/CustomButton'
import PostItem from '../../components/PostItem'
import { CustomModal } from '../../components/CustomModal'
import CreatePost from '../../modals/Post/CreatePost'
import DeletePost from '../../modals/Post/DeletePost'
import ImageView from '../../modals/ImageView'
import { CreatingPostState } from '../../types/post-types'
import { categories } from '../../modals/Post/constants'


export default function SocialScreen() {

  const {user} = useUser()
  const [creatingPost, setCreatingPost] = useState<CreatingPostState>({state: false, action: ""})
  const [isDeletingPost, setIsDeletingPost] = useState(true)
  const [viewingImageUrl, setViewingImageUrl] = useState("")
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.createPostContainer}>
          <View style={styles.postInputContainer}>
              {user?.photoURL && (
              <Image 
                source={{ uri: user.photoURL }} 
                style={styles.profilePicture} 
              />
            )}

            <CustomButton buttonStyle={styles.postInputButton} textStyle={styles.placeholderText} title={`What’s on your mind, ${user?.displayName}?`} onPress={() => setCreatingPost({state: true, action: ""})} />
            <CustomButton buttonStyle={styles.postActionsButton} textStyle={styles.postActionText} title={""} onPress={() => setCreatingPost({state: true, action: "media"})} icon={<Image source={require("../../assets/images/frame.png")} />} />
          </View>

         {/*  <View style={styles.seperator} /> */}

          {/* <ScrollView scrollEnabled contentContainerStyle={styles.postActionsContainer} horizontal showsHorizontalScrollIndicator={false}>
            <CustomButton buttonStyle={styles.postActionsButton} textStyle={styles.postActionText} title={"Photos/video"} onPress={() => setCreatingPost({state: true, action: "media"})} icon={<Image source={require("../../assets/images/frame.png")} />} />
            <CustomButton buttonStyle={styles.postActionsButton} textStyle={styles.postActionText} title={"Link"} onPress={() => {}} icon={<Image source={require("../../assets/images/link.png")} />} />
            <CustomButton buttonStyle={styles.postActionsButton} textStyle={styles.postActionText} title={"Survey/poll"} onPress={() => {}} icon={<Image source={require("../../assets/images/ordored-list.png")} />} />
            <CustomButton buttonStyle={styles.postActionsButton} textStyle={styles.postActionText} title={"Live event"} onPress={() => {}} icon={<Image source={require("../../assets/images/calendar.png")} />} />
          </ScrollView> */}
        </View>

        <View style={styles.mainCategoryButtonsContainer}>
          <ScrollView scrollEnabled horizontal contentContainerStyle={styles.categoryButtonsContainer} indicatorStyle='black' showsHorizontalScrollIndicator={true}>
          {categories.map((eachCategory) => {
                        return (
                            <CustomButton key={eachCategory.value} buttonStyle={styles.categoryButton} textStyle={styles.categoryText} title={eachCategory.title} onPress={() => {}} />
                        )
                    })}
          </ScrollView>
        </View>

          
        <PostItem setViewingImageUrl={setViewingImageUrl} user={user} />
        <PostItem setViewingImageUrl={setViewingImageUrl} user={user} />
        <PostItem setViewingImageUrl={setViewingImageUrl} user={user} />
        
        <CustomModal fullScreen onClose={() => setCreatingPost({state: false, action: ""})} isOpen={creatingPost.state}>
          <CreatePost creatingPost={creatingPost} onClose={() => setCreatingPost({state: false, action: ""})} />
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
      <Button title='Sign Out' onPress={handleSignOut} />
    </ScrollView>
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
    color: colors.LIGHT_TEXT,  // Placeholder color
    fontSize: 14, // Adjust font size to match TextInput
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