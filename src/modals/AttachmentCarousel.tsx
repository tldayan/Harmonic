import { FlatList, Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import { AttachmentData } from '../types/post-types'
import ModalsHeader from './ModalsHeader';
import Video from 'react-native-video';

const { width } = Dimensions.get('window'); 

interface AttachmentCarouselProps {
    AttachmentData: AttachmentData[]
    onClose: () => void
    initialIndex?: number
}
const MemoizedModalsHeader = React.memo(ModalsHeader);

export default function AttachmentCarousel({onClose,AttachmentData, initialIndex = 0} : AttachmentCarouselProps) {
    const [loading, setLoading] = useState(true)
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null)
    const flatListRef = useRef<FlatList>(null)

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
                                    renderLoader={<ActivityIndicator style={styles.loader} size={"small"} color={"white"} />}
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
    

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                style={styles.carouselMainContainer}
                data={AttachmentData}
                horizontal
                renderItem={attachmentItem}
                keyExtractor={(item) => item.AttachmentUUID}
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={true}
                indicatorStyle='white'  
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(data, index) => ({
                    length: width, offset: width * index,index
                })}
                initialScrollIndex={initialIndex}
            />
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
        aspectRatio: 1,
/*         alignSelf: "center",
        justifyContent: "center",
        alignItems: "center", */
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
