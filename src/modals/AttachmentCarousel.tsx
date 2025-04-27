import { FlatList, Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { AttachmentData } from '../types/post-types'
import ModalsHeader from './ModalsHeader';
import Video from 'react-native-video';
import { Asset } from 'react-native-image-picker';
import { PhotoFile } from 'react-native-vision-camera';
import CustomButton from '../components/CustomButton';
const Pinchable = require('react-native-pinchable').default;
import Close from "../assets/icons/close-light.svg"
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window'); 

interface AttachmentCarouselProps {
    AttachmentData?: AttachmentData[]
    capturedAttachments?: PhotoFile[]
    Attachment?: string | null
    Assets?: Asset[]
    onClose: () => void
    initialIndex?: number
}
/* const MemoizedModalsHeader = React.memo(ModalsHeader); */

export default function AttachmentCarousel({onClose,AttachmentData, initialIndex = 0,Assets, Attachment,capturedAttachments} : AttachmentCarouselProps) {
    const [loading, setLoading] = useState(true)
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null)
    const flatListRef = useRef<FlatList>(null)
    console.log(Attachment)
    const onViewableItemsChanged = ({viewableItems}: {viewableItems: any[]}) => {
        if(viewableItems.length > 0) {
            setVisibleIndex(viewableItems[0].index)
        }
    }

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50
    }


    const attachmentItem = useMemo(() => {
        return ({ item, index }: { item: AttachmentData; index: number }) => {
            if (!item.Attachment) {
                return null;
            }
    
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.postImageContainer}>
                        {/* <MemoizedModalsHeader lightCloseIcon={true} onClose={onClose} /> */}
                        <CustomButton buttonStyle={styles.close} onPress={onClose} icon={<Close width={20} height={20} />} />
                        <View style={styles.contentWrapper}>
                            {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                            {!item.AttachmentType.includes("video") ? (
                                <Pinchable>
                                    <Image onLoad={() => setLoading(false)} style={styles.content} source={{ uri: item?.Attachment }} />
                                </Pinchable>
                               
                            ) : (
                                <Video
                                    controls={true}
                                    paused={visibleIndex !== index}
                                    style={styles.content}
                                    source={{ uri: item.Attachment }}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }, [loading, visibleIndex, onClose]); 


    const capturedAttachmentItem = useMemo(() => {
        return ({ item, index }: { item: PhotoFile; index: number }) => {
            if (!item.path) {
                return null;
            }
    
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.postImageContainer}>
                        {/* <MemoizedModalsHeader lightCloseIcon={true} onClose={onClose} /> */}
                        <CustomButton buttonStyle={styles.close} onPress={onClose} icon={<Close width={20} height={20} />} />
                        <View style={styles.contentWrapper}>
                            {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                                <Pinchable>
                                    <Image onLoad={() => setLoading(false)} style={styles.content} source={{ uri: `file://${item.path}` }} />
                                </Pinchable>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }, [loading, visibleIndex, onClose]); 


    
    const assetsAttachmentItem = useMemo(() => {
        return ({ item, index }: { item: Asset; index: number }) => {
            if (!item.uri) {
                return null;
            }
    
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.postImageContainer}>
                   {/*      <MemoizedModalsHeader lightCloseIcon={true} onClose={onClose} /> */}
                   <CustomButton buttonStyle={styles.close} onPress={onClose} icon={<Close width={20} height={20} />} />
                        <View style={styles.contentWrapper}>
                            {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                            {!item.type?.includes("video") ? (
                                <Pinchable>
                                    <Image onLoad={() => setLoading(false)} style={styles.content} source={{ uri: item?.uri }} />
                                </Pinchable>
                                
                            ) : (
                                <Video
                                    renderLoader={<ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                                    controls={true}
                                    paused={visibleIndex !== index}
                                    style={styles.content}
                                    source={{ uri: item.uri }}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }, [loading, visibleIndex, onClose]); 
    

    return (
        <View style={styles.container}>
            {AttachmentData?.length ? <FlatList
                ref={flatListRef}
                style={styles.carouselMainContainer}
                data={AttachmentData}
                horizontal
                renderItem={attachmentItem}
                keyExtractor={(item) => item.AttachmentUUID}
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                indicatorStyle='white'  
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: width, offset: width * index,index
                })}
                initialScrollIndex={initialIndex}
            /> : Assets?.length ?
            <FlatList
                ref={flatListRef}
                style={styles.carouselMainContainer}
                data={Assets}
                horizontal
                renderItem={assetsAttachmentItem}
                keyExtractor={(item) => item.fileName!}
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                indicatorStyle='white'  
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: width, offset: width * index,index
                })}
                initialScrollIndex={initialIndex}
            /> : capturedAttachments?.length ? 
            <FlatList
                ref={flatListRef}
                style={styles.carouselMainContainer}
                data={capturedAttachments}
                horizontal
                renderItem={capturedAttachmentItem}
                keyExtractor={(item) => item.path}
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                indicatorStyle='white'  
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: width, offset: width * index,index
                })}
                initialScrollIndex={initialIndex}
            /> 
            
            : 
            <View style={styles.postImageContainer}>
                <ModalsHeader lightCloseIcon={true} onClose={onClose} />
                {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                <Pinchable>
                   <Image style={styles.content} onLoad={() => setLoading(false)} source={{uri: Attachment || ""}} /> 
                </Pinchable>
                
            </View>
            
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
/*         borderWidth: 2,
        borderColor: "red", */
    },
    carouselMainContainer: {
/*         borderWidth: 2,
        borderColor: "white", */
        width, 
    },
    postImageContainer: {
/*         borderWidth: 2,
        borderColor: "red", */
        width, 
        height: "100%",
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    contentWrapper: {
/*         position: "relative", */
        width,
/*         aspectRatio: 1, */
/*         borderWidth: 2,
        borderColor: "red" */
    },
    content: {
/*         borderWidth: 2,
        borderColor: "aqua", */
        width,
        resizeMode: "contain",
        aspectRatio: 1.5,
        alignSelf: "center",
        position: "relative"
    },
    loader: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }]
    },
    close: {
        borderWidth: 1,
        marginLeft: "auto",
        marginBottom: 15,
      /*     backgroundColor: colors.ACTIVE_ORANGE, */
        borderColor: colors.ACTIVE_ORANGE,
        borderRadius: 50,
        padding: 10
    }
});
