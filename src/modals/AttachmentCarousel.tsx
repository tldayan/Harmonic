import { FlatList, Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { AttachmentData } from '../types/post-types'
import ModalsHeader from './ModalsHeader';
import Video from 'react-native-video';
import { Asset } from 'react-native-image-picker';

const { width } = Dimensions.get('window'); 

interface AttachmentCarouselProps {
    AttachmentData?: AttachmentData[]
    Attachment?: string | null
    Assets?: Asset[]
    onClose: () => void
    initialIndex?: number
}
const MemoizedModalsHeader = React.memo(ModalsHeader);

export default function AttachmentCarousel({onClose,AttachmentData, initialIndex = 0,Assets, Attachment} : AttachmentCarouselProps) {
    const [loading, setLoading] = useState(true)
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null)
    const flatListRef = useRef<FlatList>(null)
    console.log(Assets)
    console.log(AttachmentData)
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
                        <MemoizedModalsHeader lightCloseIcon={true} onClose={onClose} />
                        <View style={styles.contentWrapper}>
                            {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                            {!item.AttachmentType.includes("video") ? (
                                <Image onLoad={() => setLoading(false)} style={styles.content} source={{ uri: item?.Attachment }} />
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

    
    const assetsAttachmentItem = useMemo(() => {
        return ({ item, index }: { item: Asset; index: number }) => {
            if (!item.uri) {
                return null;
            }
    
            return (
                <TouchableWithoutFeedback>
                    <View style={styles.postImageContainer}>
                        <MemoizedModalsHeader lightCloseIcon={true} onClose={onClose} />
                        <View style={styles.contentWrapper}>
                            {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                            {!item.type?.includes("video") ? (
                                <Image onLoad={() => setLoading(false)} style={styles.content} source={{ uri: item?.uri }} />
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
            /> : 
            <View style={styles.postImageContainer}>
                <ModalsHeader lightCloseIcon={true} onClose={onClose} />
                {loading && <ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
                <Image style={styles.content} onLoad={() => setLoading(false)} source={{uri: Attachment || ""}} />
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
});
