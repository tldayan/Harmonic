import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../styles/colors';
import ModalsHeader from './ModalsHeader';
import FastImage from '@d11/react-native-fast-image';

interface OrganizationsListProps {
    onClose: () => void;
    organizationsList: Organization[];
    setOrganization?: React.Dispatch<React.SetStateAction<Organization | null>>;
}


export default function OrganizationsList({organizationsList, onClose, setOrganization}: OrganizationsListProps) {
    console.log(organizationsList)
  return (
    <View style={styles.container}>
        <ModalsHeader title='Switch Organization' />
        <View style={styles.organizationList}>
            {organizationsList?.map((oraganization) => (
                <TouchableOpacity key={oraganization.OrganizationUUID} onPress={() => {setOrganization?.(oraganization); onClose()}} style={styles.organization}>
                    <FastImage style={styles.shortLogo} source={{uri: oraganization.OrganizationShortLogo ?? ""}} />
                    <Text style={{fontWeight: "500"}} key={oraganization.OrganizationUUID}>{oraganization.OrganizationName}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
/*         borderWidth: 1, */
        backgroundColor: "white",
        borderRadius: 10,
/*         width: 343, */
        paddingBottom: 20
/*         padding: 20, */
    },
    title: {
        fontWeight: 500,
        fontSize: 14,
        textAlign: "center",
        marginBottom : 10
    },
    organizationList: {
        gap: 10
     /*    borderWidth: 2, */
    },
    organization: {
        borderRadius: 50,
        alignSelf: "center",
        width: "80%",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
/*         borderWidth: 1,
        borderColor: colors.ACTIVE_ORANGE, */
        backgroundColor: colors.BACKGROUND_COLOR,
        paddingVertical: 10,
    },
    shortLogo: {
        width: 25,
        height: 25
    }
})