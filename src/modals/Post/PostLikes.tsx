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

    const [likes, setLikes] = useState<PostLikeProps[]>([
        {
            "MessageBoardLikeUUID": "f4b2dcc0-a576-4638-96b3-98b441968b2a",
            "TotalLikesCount": 18,
            "CreatedDateTime": "2025-03-05T13:09:31.000Z",
            "CreatedBy": "2ff929c1-e3db-11ef-bdd1-42010a400005",
            "UserName": null,
            "FirstName": "Devika",
            "LastName": null,
            "ProfilePicURL": ""
        },
        {
            "MessageBoardLikeUUID": "1ccacded-f4a3-4263-8900-9ecdbf88ae98",
            "TotalLikesCount": 18,
            "CreatedDateTime": "2025-03-05T18:38:55.000Z",
            "CreatedBy": "a99cc57c-c12d-11ef-b36c-42010a400004",
            "UserName": null,
            "FirstName": "shashank",
            "LastName": null,
            "ProfilePicURL": "https://lh3.googleusercontent.com/a/ACg8ocKrREIWnk4gocHl4jRpn4tGkxC_YtCKhzRhk8Lso_bDDgZoStB8=s96-c"
        },
        {
            "MessageBoardLikeUUID": "66b0be3d-f675-4e54-ab72-e1aaff00738f",
            "TotalLikesCount": 18,
            "CreatedDateTime": "2025-03-05T18:39:41.000Z",
            "CreatedBy": "305e1888-f9f1-11ef-bdd1-42010a400005",
            "UserName": null,
            "FirstName": "TL Dayan",
            "LastName": null,
            "ProfilePicURL": "https://lh3.googleusercontent.com/a/ACg8ocJx5OuLCsi0VSMT63B43h4larQWIt9L-NyETn_BHUNQoGTHjA=s96-c"
        }
    ])
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

/*     useEffect(() => {
        fetchListOfLikes()
    }, []) */

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
/*             onEndReached={onEndReached} */
/*             onEndReachedThreshold={0.5} */
            renderItem={({item}) => <ProfileHeader showActions={false} {...item} />}
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
        width: "75%",
        height: 1,
        marginVertical: 10,
        backgroundColor: colors.LIGHT_COLOR
    }
})