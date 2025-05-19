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
import { WorkRequestInformationState } from '../../types/work-request.types'
import { STATUS_CODE } from '../../utils/constants'

interface AssetTypesProps {
    onClose: () => void;
    setTaskInformation?: React.Dispatch<React.SetStateAction<TaskInformationState>>;
    setWorkRequestInformation?: React.Dispatch<React.SetStateAction<WorkRequestInformationState>>;
  }

  export default function AssetTypes({
    onClose,
    setTaskInformation,
    setWorkRequestInformation
  }: AssetTypesProps) {
  
  
    
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
                if(Assets.Status === STATUS_CODE.ERROR) return
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

    useEffect(() => {
        

        fetchAssetList()
        
    }, [organizationUUID])


    const assetItem = ({ item }: { item: WorkAsset }) => (
        <CustomButton
            buttonStyle={styles.asset}
            onPress={() => {
                const update = {
                  asset: {
                    assetName: item.AssetName,
                    assetUUID: item.AssetUUID,
                  },
                };
              
                if (setTaskInformation) {
                  setTaskInformation(prev => ({ ...prev, ...update }));
                } else if (setWorkRequestInformation) {
                  setWorkRequestInformation(prev => ({ ...prev, ...update }));
                }
              
                onClose();
              }}
              
              
            title={item.AssetName}
        />
    )

  return (
    <View style={styles.container}>
        <ModalsHeader onClose={onClose} title='Asset' />
        {loading ? <ActivityIndicator size="small" /> : (
            <ScrollView style={styles.mainAssetList} horizontal={true} scrollEnabled={true}>
                <FlatList
                    style={styles.assetList}
                    data={assets}
                    contentContainerStyle= {{gap: 15}}
                    keyExtractor={(item) => item.AssetUUID}
                    renderItem={assetItem}
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
        paddingBottom: 10,
        maxHeight: 500
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
