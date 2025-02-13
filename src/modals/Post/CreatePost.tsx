import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "../../context/AuthContext"
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { shadowStyles } from '../../styles/global-styles'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { Asset, launchImageLibrary } from 'react-native-image-picker'
import { CreatingPostState } from '../../types/post-types'
import { CustomModal } from '../../components/CustomModal'
import ImageView from '../ImageView'
import { categories } from './constants'
import { apiClient } from '../../api/api-client'
import Poll from './CreatePoll'


interface CreatePostProps {
    onClose: () => void
    creatingPost: CreatingPostState
}

export default function CreatePost({onClose, creatingPost}: CreatePostProps) {

    const {user} = useUser()
    const [postText, setPostText] = useState("")
    const inputRef = useRef<any>(null)
    const [selectedImages, setSelectedImages] = useState<Asset[]>([])
    const [viewingImageUrl, setViewingImageUrl] = useState("")
    const [postCategory, setPostCategory] = useState("all")
    const [creatingPoll, setCreatingPoll] = useState(false)

    useEffect(() => {
        

        const timer = setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus(); 
                }
            }, 300); 

            return () => clearTimeout(timer)

        }, []);

        useEffect(() => {
            if (creatingPost.action === "media") {
                setTimeout(() => {
                    handleAddMedia();
                }, 200);
            }
        }, [creatingPost.action]);
        
        

        
        const handleAddMedia = async() => {
            try {
                const result = await launchImageLibrary({
                    mediaType: "photo",
                    selectionLimit: 0,
                    quality: 1
                });
        
                if (result.didCancel) {
                    console.log("User Did not allow permissions");
                } else if (result.errorCode) {
                    console.log(`Image Pick Error: ${result.errorMessage}`);
                } else {
                    setSelectedImages((prev) => ([...prev, ...result.assets ?? []]));
                    console.log(result.assets)
                }
            } catch (error) {
                console.log("Unexpected error:", error);
            }
        };

        const deleteImage = (imageFilename: string) => {
            let updatedSelectedImages = selectedImages.filter((eachImage) => eachImage.fileName !== imageFilename)
            setSelectedImages(updatedSelectedImages)
        }
        

    const imageItem = ({item} : {item : Asset}) => {
        return (
            <View style={styles.imageContainer}>
                <CustomButton onPress={() => deleteImage(item.fileName || "")} buttonStyle={styles.deleteImage} icon={<Image width={10} height={10} source={require("../../assets/images/x.png")} />} />
                <CustomButton onPress={() => setViewingImageUrl(item.uri || "")} icon={<Image style={styles.image} source={{uri: item.uri ? item.uri : undefined}} />} />
            </View>
        )
    }

    const AddImageButton = () => {
        if(selectedImages.length > 0) {
            return (
          <CustomButton buttonStyle={styles.addImage} onPress={handleAddMedia} icon={<Image source={require("../../assets/images/plus.png")} />} /> 
        )
        }
    }

    const handlePost = async() => {

        const formData = new FormData()

        formData.append("postText", postText)

        selectedImages.forEach((image) => {
            formData.append("images", {
                uri: image.uri,
                type: image.type,
                name: image.fileName
            })
        })

        try {

            const response = await apiClient("/backendUrlForPostingUserPost", formData, {}, "POST") // may need to send queryParams here, Check!

            if(response.data.ok) {
                onClose() // create setLoading state heree
            }
            

        } catch (err: any) {
            console.log(err.message)
        }

    }


  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title='Create Post' />
        <View style={styles.innerContainer}>
            <View style={styles.mainUserDetailsContainer}>
                <View style={styles.mainProfileDetialsContainer}>
                    <Image source={{ uri: user?.photoURL ?? "https://i.pravatar.cc/150" }}  style={styles.profilePicture} />
                    <Text style={styles.name}>{user?.displayName}</Text>
                </View>
            </View>

            <CustomTextInput scrollEnabled={true} ref={inputRef} multiline placeholderTextColor={colors.LIGHT_TEXT_COLOR} inputStyle={[styles.postField, shadowStyles]} value={postText} onChangeText={(e) => {setPostText(e)}} placeholder={`What's on your mind, ${user?.displayName}?`}/>
            
            <FlatList indicatorStyle='black' horizontal style={styles.mainSelectedImagesList} contentContainerStyle={styles.selectedImagesList} data={selectedImages} renderItem={imageItem} keyExtractor={(item) => String(item.fileName)} ListFooterComponent={<AddImageButton />} />
            
            <View style={styles.mainActionButtonsContainer}>
                <ScrollView scrollEnabled horizontal contentContainerStyle={styles.actionButtonsContainer} indicatorStyle='black' showsHorizontalScrollIndicator>
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => handleAddMedia()} title={"Add Media"} icon={<Image width={5} height={5} source={require("../../assets/images/frame.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Link"} icon={<Image width={5} height={5} source={require("../../assets/images/link.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => setCreatingPoll(true)} title={"Add Poll"} icon={<Image width={5} height={5} source={require("../../assets/images/ordored-list.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Event"} icon={<Image width={5} height={5} source={require("../../assets/images/calendar.png")} />} />
                </ScrollView>
            </View>

            <View style={styles.mainCategoryButtonsContainer}>
                <ScrollView scrollEnabled horizontal contentContainerStyle={styles.categoryButtonsContainer} indicatorStyle='black' showsHorizontalScrollIndicator>
                    
                    {categories.map((eachCategory) => {
                        return (
                            <CustomButton key={eachCategory.value} buttonStyle={[styles.categoryButton, postCategory === eachCategory.value && styles.activeCategory]} textStyle={[styles.categoryText, postCategory === eachCategory.value && styles.activeCategoryText]} title={eachCategory.title} onPress={() => setPostCategory(eachCategory.value)} />
                        )
                    })}
                </ScrollView>
            </View>

            <CustomButton onPress={handlePost} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, shadowStyles]} title={"Post"} />
        </View>

        <CustomModal isOpen={viewingImageUrl !== ""} onClose={() => setViewingImageUrl("")} >
            <ImageView imageUrl={viewingImageUrl} onClose={() => setViewingImageUrl("")} />
        </CustomModal>
        
        <CustomModal fullScreen isOpen={creatingPoll} onClose={() => setCreatingPoll(false)} >
            <Poll onClose={() => setCreatingPoll(false)} />
        </CustomModal>

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
/*         flexGrow: 1, */
/*         borderWidth: 2, */
    },
    mainUserDetailsContainer : {
/*         borderWidth : 2, */

    },
    mainProfileDetialsContainer: {
/*         borderWidth: 1, */
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 10
      },
      profilePicture: {
        width: 34,
        height: 34,
        borderRadius: 50
      },
      name: {
        fontWeight: 500,
        color: "#000000",
      },
      postField: {
        borderRadius: 5,
		borderColor: colors.BORDER_COLOR,
		borderWidth: 0,
        backgroundColor: "transparent",
		flex: 1,
		color: "black",
        height: "auto",
        maxHeight : 200,
        paddingHorizontal: 0,
        /* height: "100%", */
        textAlignVertical: "top",
      },

      

      mainCategoryButtonsContainer: {
          marginVertical: 5,
          flexDirection: "row",
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
          fontWeight: 500,
          color: colors.BLACK_TEXT_COLOR
        },
        activeCategory: {
            backgroundColor: colors.ACTIVE_ORANGE,
        },
        activeCategoryText: {
            color: "white"
        },
        mainActionButtonsContainer :{
 /*            borderWidth: 1, */
            width: "100%",
     /*        marginTop: 100, */
            flexDirection: "row",
            gap: 5,
        },
        actionButtonsContainer : {
            gap: 10,
            paddingBottom: 10
        },
        actionButtonText:  {
            fontSize: 12
        },
        actionButtons: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"center",
        marginVertical: 5,
        gap: 8,
        backgroundColor: colors.LIGHT_COLOR,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3
    },
    mainSelectedImagesList : {
/*         borderWidth: 2, */
        borderColor: "aqua",
        flexGrow: 0, height: 'auto'
    },
    selectedImagesList : {
 /*        borderWidth: 1, */
        marginTop: 10,
        paddingBottom: 10,
        gap: 10,
        
    },
    imageContainer : {
/*         borderWidth: 1, */
        position:"relative"
    },
    image: {
        borderRadius: 5,
        width: 150,
        height: 150,
    },
    addImage: {
        borderColor: colors.BORDER_COLOR,
        flexDirection : "row",
        borderRadius: 5,
        backgroundColor: colors.LIGHT_COLOR,
        alignItems: "center",
        justifyContent: "center",
        width: 150,
        height: 150
    },
    deleteImage : {
        position: "absolute",
        right: 5,
        top: 5,
        zIndex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        backgroundColor : "white",
        height: 30,
        width: 30
    }
        
})