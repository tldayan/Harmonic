import { FlatList, Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import React from 'react'
import { AttachmentData } from '../types/post-types'
import ModalsHeader from './ModalsHeader';
import Video from 'react-native-video';

const { width } = Dimensions.get('window'); 

interface AttachmentCarouselProps {
    AttachmentData: AttachmentData[]
    onClose: () => void
}

export default function AttachmentCarousel({onClose,AttachmentData} : AttachmentCarouselProps) {

    const attachmentItem = ({ item }: { item: AttachmentData }) => {
        if (!item.Attachment) {
            return null;
        }

        return (
            <TouchableWithoutFeedback>
                <View style={styles.postImageContainer}>
                    <ModalsHeader lightCloseIcon={true} onClose={onClose} />
                    {item.AttachmentType !== "video/mp4" ? (
                <Image style={styles.content} source={{ uri: item?.Attachment }} />
                ) : (
                <View style={styles.videoContainer}>
                    <Video
                    renderLoader={<ActivityIndicator style={styles.loader} size="small" />}
                    controls={true}
                    style={styles.content}
                    source={{ uri: item.Attachment }}
                    />
                </View>
                )}

                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.carouselMainContainer}
                data={AttachmentData}
                horizontal
                renderItem={attachmentItem}
                keyExtractor={(item) => item.AttachmentUUID}
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={true}
                indicatorStyle='white'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: "red",
/*         height: 400, */
    },
    carouselMainContainer: {
        borderWidth: 2,
/*         backgroundColor: "white", */
        borderColor: "white",
        width, 
    },
    postImageContainer: {
        borderWidth :2,
        borderColor: "red",
        width, 
        height: "100%",
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 1.5, 
        alignSelf: "center",
        position: 'relative', 
      },
    content: {
        borderWidth :2,
        borderColor: "red",
        width,
        resizeMode: "contain",
        aspectRatio: 1.5,
        alignSelf: "center"
    },
    loader: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -15, 
        marginTop: -15,
      },
});
