import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ModalsHeader from '../ModalsHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { getAssetList } from '../../api/network-utils'
import CustomButton from '../../components/CustomButton'
import { colors } from '../../styles/colors'
import { ScrollView } from 'react-native-gesture-handler'
import { TaskInformationState } from '../../types/work-order.types'

interface AssetTypesProps {
    onClose: () => void
    setTaskInformation: React.Dispatch<React.SetStateAction<TaskInformationState>>
}

export default function AssetTypes({onClose, setTaskInformation} : AssetTypesProps) {
    
    const [assets, setAssetsList] = useState<WorkAsset[]>([])
    const [loading, setLoading] = useState(false)
    const [startIndex, setStartIndex] = useState(0)
    const [hasMoreAssets, setHasMoreAssets] = useState(true)
    const {organizationUUID} = useSelector((state: RootState) => state.auth)


    const fetchAssetList = async () => {
            if(!hasMoreAssets) return

            setLoading(true)
            try {
                const Assets = await getAssetList(organizationUUID, startIndex)
                if(Assets.Payload.length < 20) {
                    setHasMoreAssets(false)
                }
                setStartIndex((prev) => prev + 20)
                setAssetsList((prev) => [...prev, ...Assets.Payload])
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

/*     useEffect(() => {
        

        fetchAssetList()
        
    }, [organizationUUID]) */


    const assetItem = ({ item }: { item: WorkAsset }) => (
        <CustomButton
            buttonStyle={styles.asset}
            onPress={() => {setTaskInformation((prev) => (
                {...prev, asset: {assetName: item.AssetName, assetUUID: item.AssetUUID}}
            ));onClose()}}
            title={item.AssetName}
        />
    )

  return (
    <View style={styles.container}>
        <ModalsHeader onClose={onClose} title='Asset' />
        {loading ? <ActivityIndicator size="small" /> : (
            <ScrollView style={styles.mainAssetList} horizontal={true} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
                <FlatList
                    style={styles.assetList}
                    data={assets}
                    contentContainerStyle= {{gap: 15}}
                    keyExtractor={(item) => item.AssetUUID}
                    renderItem={assetItem}
                    onEndReached={fetchAssetList}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={<Text>No Assets Available</Text>}
                    ListFooterComponent={loading ? <ActivityIndicator size={"small"} /> : null}
                />
            </ScrollView>
        )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 20,
        width: 343,
        paddingBottom: 10
    },
    mainAssetList: {
        flexDirection: "column", 
        width: "90%", 
        alignSelf: "center",
        paddingBottom: 10,
    },
    assetList: {
        width: "90%",
        alignSelf: "center",
        paddingHorizontal: 10,
    },
    asset: {
        backgroundColor: colors.LIGHT_COLOR,
        borderRadius: 25,
        paddingVertical: 5
    }
})
