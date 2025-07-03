import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useUser } from "../../context/AuthContext"
import { CustomTextInput } from '../../components/CustomTextInput'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { shadowStyles } from '../../styles/global-styles'
import { PRIMARY_BUTTON_STYLES, PRIMARY_BUTTON_TEXT_STYLES } from '../../styles/button-styles'
import { Asset } from 'react-native-image-picker'
import { AttachmentData, CategoryProps, CreatingPostState, PostItemProps } from '../../types/post-types'
import { CustomModal } from '../../components/CustomModal'
import Poll from './CreatePoll'
import { deleteMBMessageAttachment, saveMBMessage } from '../../api/network-utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Filters from '../Filters'
import { STATUS_CODE } from '../../utils/constants'
import AttachmentCarousel from '../AttachmentCarousel'
import { pickMedia, uploadMedia } from '../../utils/helpers'
import { Attachmentitem } from '../../components/FlatlistItems/AttachmentItem'
import { firebaseStoragelocations } from '../../utils/constants'
import { CommonActions, useNavigation, useRoute } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'

interface CreatePostProps {
    onClose: () => void
    creatingPost?: CreatingPostState
    categories?: Category[]
    navigation?: any;
    route?: any;
    post?: PostItemProps
    attachmentData?: AttachmentData[]
    fetchLatestMessages?: (messageBoardUUID?: string) => void
}

  

export default function CreatePost({onClose, route, navigation,creatingPost, post, attachmentData,fetchLatestMessages}: CreatePostProps) {

    const {user} = useUser()
    const [postText, setPostText] = useState(post?.Message ? post.Message : "")
    const inputRef = useRef<any>(null)
    const [selectedAttachments, setSelectedAttachments] = useState<Asset[]>([])
    const [editingAttachments, setEditingAttachments] = useState<AttachmentData[]>(attachmentData ? attachmentData : [])
    const [viewingAttachments, setViewingAttachments] = useState(false)
    const [initialAttachmentIndex, setInitialAttachmentIndex] = useState(0)
    const [postCategories, setPostCategories] = useState<{state: boolean, categories: CategoryProps[]}>({state: false, categories: []})
    const [editingCategories, setEditingCategories] = useState<CategoryProps[]>(post?.AllMBCategoryItems?.map(category => ({...category,isDeleted: false, existing: true})) || []);
    const [creatingPoll, setCreatingPoll] = useState(false)
    const [loading, setLoading] = useState(false)
    const {userUUID, organizationUUID} = useSelector((state: RootState) => state.auth);
  /*       const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); */
 /*    const route = useRoute() */


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
            if (creatingPost?.action === "media") {
                setTimeout(() => {
                    handleAddMedia();
                }, 200);
            }
        }, [creatingPost?.action]);
        
        

        
        const handleAddMedia = async () => {
            setLoading(true);
            try {
                const assets = await pickMedia();
                setSelectedAttachments((prev) => [...prev, ...assets ?? []]); 
            } catch (error) {
                console.error("Error selecting media:", error);
            } finally {
                setLoading(false); 
            }
        };
        

        const deleteAttachment = (imageFilename: string) => {
            let updatedSelectedImages = selectedAttachments.filter((eachImage) => eachImage.fileName !== imageFilename)
            setSelectedAttachments(updatedSelectedImages)
        }

        const deleteExistingAttachment = async(attachmentUUID: string) => {
            
            try {
                await deleteMBMessageAttachment(attachmentUUID, post?.MessageBoardUUID ?? "",userUUID)
                setEditingAttachments((prev) =>
                    prev.filter((eachAttachment) => eachAttachment.AttachmentUUID !== attachmentUUID)
                );
                
            } catch(err) {
                console.log(err)
            }
        }
        

    const editingAttachmentImage = ({item} : {item : AttachmentData}) => {

/*         if(item.isDeleted) return null */

        return (
            <View style={styles.imageContainer}>
                <CustomButton onPress={() => deleteExistingAttachment(item.AttachmentUUID || "")} buttonStyle={styles.deleteImage} icon={<Image width={10} height={10} source={require("../../assets/images/x.png")} />} />
                <CustomButton onPress={() => setViewingAttachments(true)} icon={<Image style={styles.content} source={{uri: item.Attachment ? item.Attachment : undefined}} />} />
            </View>
        )
    }

    const AddAdditionalMediaButton = () => {
        if(selectedAttachments.length || editingAttachments.length) {
            return (
          <CustomButton buttonStyle={styles.addImage} onPress={handleAddMedia} icon={<Image source={require("../../assets/images/plus.png")} />} /> 
        )
        }
    }

    const handlePost = async() => {

        if(!postText && selectedAttachments.length === 0) return

        setLoading(true)
        
        try {
        
            let attachmentUrls: any[] = [];

            if (selectedAttachments && selectedAttachments.length > 0) {
              attachmentUrls = (await uploadMedia(selectedAttachments, firebaseStoragelocations.attachmentMB)) || [];
            }
        
        const response = await saveMBMessage(postText,(editingAttachments.length ? editingAttachments : attachmentUrls), organizationUUID, userUUID, (editingCategories.length > 0 ? editingCategories : postCategories.categories), post?.MessageBoardUUID, editingAttachments.length ? "edit" : "post")

            if(response.Status === STATUS_CODE.SUCCESS) {
                if(post) {
                    fetchLatestMessages?.(post.MessageBoardUUID)
                }
                onClose()
                if (route?.name !== "Social") {
                    navigation?.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [
                          {
                            name: "Tabs",
                            state: {
                              index: 0,
                              routes: [{ name: "Social" }],
                            },
                          },
                        ],
                      })
                    );
                  }
            }

        } catch (err: any) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }

    }


  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title={post ? "Edit Post" : 'Create Post'} />
        <View style={styles.innerContainer}>
            <View style={styles.mainUserDetailsContainer}>
                <View style={styles.mainProfileDetialsContainer}>
                    <Image source={{ uri: user?.photoURL ?? "https://i.pravatar.cc/150" }}  style={styles.profilePicture} />
                    <Text style={styles.name}>{user?.displayName ? user.displayName : user?.email}</Text>
                </View>
            </View>

            <CustomTextInput noBackground scrollEnabled={true} ref={inputRef} multiline placeholderTextColor={colors.LIGHT_TEXT_COLOR} inputStyle={[styles.postField]} value={postText} onChangeText={(e) => {setPostText(e)}} placeholder={`What's on your mind, ${user?.displayName}?`}/>
            

            {selectedAttachments.length > 0 && <FlatList indicatorStyle='black' horizontal style={styles.mainSelectedImagesList} contentContainerStyle={styles.selectedImagesList} data={selectedAttachments} renderItem={({ item, index }) => (
                <Attachmentitem
                    item={item}
                    index={index}
                    deleteAttachment={deleteAttachment}
                    setViewingAttachments={setViewingAttachments}
                    setInitialAttachmentIndex={setInitialAttachmentIndex}
                />
                )}
                keyExtractor={(item) => String(item.fileName)} ListFooterComponent={<AddAdditionalMediaButton />} />}
            {editingAttachments.length > 0 && <FlatList indicatorStyle='black' horizontal style={styles.mainSelectedImagesList} contentContainerStyle={styles.selectedImagesList} data={editingAttachments} renderItem={editingAttachmentImage} keyExtractor={(item) => String(item.AttachmentUUID)} ListFooterComponent={<AddAdditionalMediaButton />} />}
           

            <ScrollView horizontal contentContainerStyle={styles.categoryList} style={styles.categoryListContainer}>
                {postCategories.categories.length > 0 ? postCategories.categories.map((eachCategory) => {
                    return ( <Text style={styles.category} key={eachCategory.CategoryItemName}>{eachCategory.CategoryItemName}</Text>)
                }): 
                 editingCategories?.map((eachCategory) => {
                    if(eachCategory.existing) return ( <Text style={styles.category} key={eachCategory.CategoryItemUUID}>{eachCategory.CategoryItemName}</Text>)
                })
                }
            </ScrollView>
            

            {!post && <View style={styles.mainActionButtonsContainer}>
                <ScrollView scrollEnabled horizontal contentContainerStyle={styles.actionButtonsContainer}>
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => handleAddMedia()} title={"Add Media"} icon={<Image width={5} height={5} source={require("../../assets/images/frame.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Link"} icon={<Image width={5} height={5} source={require("../../assets/images/link.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => setCreatingPoll(true)} title={"Add Poll"} icon={<Image width={5} height={5} source={require("../../assets/images/ordored-list.png")} />} />
                    <CustomButton buttonStyle={styles.actionButtons} textStyle={styles.actionButtonText} onPress={() => {}} title={"Add Event"} icon={<Image width={5} height={5} source={require("../../assets/images/calendar.png")} />} />
                </ScrollView>
            </View>}

            <CustomButton onPress={() => setPostCategories((prev) => ({...prev, state: true}))} textStyle={{color: colors.PRIMARY_COLOR, paddingTop: 10}} title={postCategories.categories.length || editingCategories.length ? "Edit Categories" : "Add Categories"} />
            <CustomButton onPress={handlePost} textStyle={PRIMARY_BUTTON_TEXT_STYLES} buttonStyle={[PRIMARY_BUTTON_STYLES, shadowStyles]} title={!loading ? "Post" : null} icon={loading ? <ActivityIndicator size="small" color="#fff" /> : null} />
            
            {postCategories.state && <CustomModal fullScreen presentationStyle='formSheet' onClose={() => setPostCategories((prev) => ({...prev, state: false}))}>
                <Filters setEditingCategories={setEditingCategories} editingCategories={editingCategories} setPostCategories={setPostCategories} postCategories={postCategories.categories} /* categories={categories}  */onClose={() => setPostCategories((prev) => ({...prev, state: false}))} />
            </CustomModal>}


        </View>
        
           {viewingAttachments && <CustomModal onClose={() => {setViewingAttachments(false)}}>
            <AttachmentCarousel initialIndex={initialAttachmentIndex} Assets={selectedAttachments} AttachmentData={attachmentData} onClose={() => {setViewingAttachments(false)}} />
           </CustomModal>}  
        
        {creatingPoll && <CustomModal fullScreen >
            <Poll onClose={() => {setCreatingPoll(false)}} closeAllModals={() => {setCreatingPoll(false); handlePostClose()}} />
        </CustomModal>}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

    container : {
        flex: 1,        backgroundColor: "white",
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
            paddingTop: 10,
            paddingBottom: 5
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
        borderRadius: 10,
        overflow: "hidden",
        position:"relative"
    },
    contentButtonContainer: {
        overflow: 'hidden',
        borderRadius: 5,
    },
    content: {
        width: 150,
        height: 150,
        position: "relative"
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
    },
    categoryListContainer: {
/*         borderWidth: 1 */
    },
    categoryList: {
        gap: 10
    },
    category: {
        borderWidth: 0.5,
        borderColor: colors.ACTIVE_ORANGE,
        fontSize: 12,
        fontWeight: 300,
        paddingHorizontal: 10,
        paddingVertical: 2,
        marginVertical: 5,
        borderRadius: 50,
        color: colors.ACTIVE_ORANGE
    },
    loader: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
    },
        
})