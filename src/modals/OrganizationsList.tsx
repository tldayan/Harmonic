import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton';
import { colors } from '../styles/colors';
import ModalsHeader from './ModalsHeader';

interface OrganizationsListProps {
    onClose: () => void;
    organizationsList: Organization[];
    setOrganization?: React.Dispatch<React.SetStateAction<Organization | null>>;
}


export default function OrganizationsList({organizationsList, onClose, setOrganization}: OrganizationsListProps) {
  return (
    <View style={styles.container}>
        <ModalsHeader onClose={onClose} title='Switch Organization' />
        <View style={styles.organizationList}>
            {organizationsList?.map((oraganization) => (
                <CustomButton buttonStyle={styles.organization} key={oraganization.OrganizationUUID}  onPress={() => setOrganization?.(oraganization)} title={oraganization.OrganizationName}/>
            ))}
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: "white",
        borderRadius: 10,
        width: 343,
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
     /*    borderWidth: 2, */
    },
    organization: {
        borderRadius: 50,
        alignSelf: "center",
        width: "80%",
        borderWidth: 1,
        borderColor: colors.ACTIVE_ORANGE,
        backgroundColor: colors.BACKGROUND_COLOR,
        paddingVertical: 10,
    }
})