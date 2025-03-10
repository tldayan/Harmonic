import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { getListOfLikes } from '../../api/network-utils'
import { PostLikeProps } from '../../types/post-types'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileHeader from '../../components/ProfileHeader'
import { colors } from '../../styles/colors'

interface PostLikesModalProps {
    onClose: () => void
    MessageBoardUUID: string
}

export default function PostLikes({onClose,MessageBoardUUID}: PostLikesModalProps) {

    const [likes, setLikes] = useState<PostLikeProps[]>([])
    const [startIndex, setStartIndex] = useState(0)
    const [loading, setLoading] = useState(false)

    const fetchListOfLikes = async() => {
        setLoading(true)
        try {
            const postLikes = await getListOfLikes(MessageBoardUUID, startIndex)
            setLikes((prev) => ([...prev, ...postLikes]));
            setStartIndex((prev) => prev + 10)
            console.log(postLikes)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const onEndReached = () => {
        if(!loading) {
            fetchListOfLikes()
        }
    }

    useEffect(() => {
        fetchListOfLikes()
    }, [])

    const ItemSeperator = () => {
        return <View style={styles.seperator} />
    }

  return (
    <SafeAreaView style={styles.container}>
        <ModalsHeader onClose={onClose} title='Post Likes' />

        <FlatList 
            style={styles.innerContainer}
            contentContainerStyle={styles.likesList}
            data={likes}
            ItemSeparatorComponent={ItemSeperator}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            renderItem={({item}) => <ProfileHeader showActions={false} postLikes={item} />}
            keyExtractor={(item) => item.MessageBoardLikeUUID}
            ListFooterComponent={loading ? <ActivityIndicator size={'small'} /> : null}
        />  
      
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
        flex: 1
    },
    likesList: {
/*         borderWidth: 2, */
    },
    seperator: {
        width: "80%",
        marginHorizontal: "20%",
        height: 1,
        marginVertical: 10,
        backgroundColor: colors.LIGHT_COLOR
    }
})