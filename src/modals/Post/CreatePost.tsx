import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import Poll from './CreatePoll'
import { uploadImages } from './postUtils'
import { saveMBMessage } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Filters from '../Filters'


interface CreatePostProps {
    onClose: () => void
    creatingPost: CreatingPostState
    categories: Category[]
}

export default function CreatePost({onClose, creatingPost, categories}: CreatePostProps) {

    const {user} = useUser()
    const [postText, setPostText] = useState("")
    const inputRef = useRef<any>(null)
    const [selectedImages, setSelectedImages] = useState<Asset[]>([])
    const [viewingImageUrl, setViewingImageUrl] = useState("")
    const [postCategories, setPostCategories] = useState<{state: boolean, categories: string[]}>({state: false, categories:[]})
    const [creatingPoll, setCreatingPoll] = useState(false)
    const [loading, setLoading] = useState(false)
    const [link, setLink] = useState("")
    const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth);


    const handlePostClose = () => {
        setTimeout(() => {
            onClose()
        }, 0)
    }

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

        setLoading(true)

        try {

        const imageUrls = await uploadImages(selectedImages)


        const response = await saveMBMessage(postText,imageUrls, organizationUUID, userUUID, postCategories.categories)

            if(response === "Message created successfully") {
                onClose()
            }

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
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
            


            {/* <CustomTextInput onChangeText={(e) => setLink(e)} value={link} inputStyle={styles.linkField} onPress={() => {}} label='Link' /> */}
       {/*      <View>
                <Text>Link Metadata</Text>
            </View> */}

            <ScrollView>
                {postCategories.categories.map((eachCategory) => {
                    return ( <Text key={eachCategory}>{eachCategory}</Text>)
                })}
            </ScrollView>
            

            <View style={styles.mainActionButtonsContainer}>
                <ScrollView scrollEnabled horizontal contentContainerStyle={styles.actionButtonsContainer} indicatorStyle='black' showsHorizontalScrollIndicator>
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => handleAddMedia()} title={"Add Media"} icon={<Image width={5} height={5} source={require("../../assets/images/frame.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Link"} icon={<Image width={5} height={5} source={require("../../assets/images/link.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => setCreatingPoll(true)} title={"Add Poll"} icon={<Image width={5} height={5} source={require("../../assets/images/ordored-list.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Event"} icon={<Image width={5} height={5} source={require("../../assets/images/calendar.png")} />} />
                </ScrollView>
            </View>
            <CustomButton onPress={() => setPostCategories((prev) => ({...prev, state: true}))} textStyle={{color: colors.PRIMARY_COLOR}} title={postCategories.categories.length ? "Edit Categories" : "Add Categories"} />
            
            <CustomModal isOpen={postCategories.state} fullScreen onClose={() => setPostCategories((prev) => ({...prev, state: false}))}>
                <Filters setPostCategories={setPostCategories} postCategories={postCategories.categories} categories={categories} onClose={() => setPostCategories((prev) => ({...prev, state: false}))} />
            </CustomModal>

            <CustomButton onPress={handlePost} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, shadowStyles]} title={!loading ? "Post" : null} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null} />
        </View>

        <CustomModal isOpen={viewingImageUrl !== ""} onClose={() => setViewingImageUrl("")} >
            <ImageView imageUrl={viewingImageUrl} onClose={() => setViewingImageUrl("")} />
        </CustomModal>
        
        <CustomModal fullScreen isOpen={creatingPoll} >
            <Poll onClose={() => {setCreatingPoll(false)}} closeAllModals={() => {setCreatingPoll(false); handlePostClose()}} />
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
      linkField: {
        borderColor: colors.ACCENT_COLOR,
        flex: 1,
        height: "auto",
        padding: 3,
        color: colors.ACTIVE_ACCENT_COLOR
      },

        mainActionButtonsContainer :{
            width: "100%",
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