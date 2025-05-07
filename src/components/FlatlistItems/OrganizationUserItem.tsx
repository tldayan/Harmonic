import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Check from '../../assets/icons/circle-check.svg'
import ProfileHeader from '../ProfileHeader'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { colors } from '../../styles/colors'

interface Props {
  item: OrganizationUser
  addedMembers?: { memberUUID: string }[]
  handleAddMember: (member: OrganizationUser) => void
}

export const OrganizationUserItem: React.FC<Props> = ({ item, addedMembers, handleAddMember }) => {


  const isAdded = addedMembers?.some(member => member.memberUUID === item.UserUUID)
  const userUUID = useSelector((state: RootState) => state.auth.userUUID)
  const isYou = item.UserUUID === userUUID

  return (
    <TouchableOpacity style={styles.memberItemContainer} onPress={() => handleAddMember(item)}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ProfileHeader noDate ProfilePic={item.ProfilePicURL} name={item.FullName} />
        {isYou && <Text style={styles.you}>You</Text>}
      </View>
      {isAdded && (
        <Check style={styles.checkLogo} fill={colors.ACTIVE_ORANGE} stroke='white' width={20} height={20} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    memberItemContainer : {
         position: "relative",
         padding: 5
     },
     checkLogo : {
         position: "absolute",
         bottom: 0,
         left: 0
     },
     you: {
       paddingHorizontal: 5,
       paddingVertical: 2,
       fontSize: 10,
       borderRadius: 3,
       backgroundColor: colors.LIGHT_COLOR,
       color: colors.LIGHT_TEXT
     },
})
