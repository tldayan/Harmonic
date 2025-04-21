import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ThreeDots from "../assets/icons/three-dots-vertical.svg"
import { MEMBER_ROLES } from "../utils/constants";


  interface DropdownComponentProps {
    action: string | null
    setAction: React.Dispatch<React.SetStateAction<string | null>>
    userRole: string
    onDropdownFocus: () => void;
    selectedMember: string,
    userUUID: string
  }
  
  export const GroupMemberDropdownComponent = ({action,setAction, userRole, onDropdownFocus, selectedMember, userUUID}: DropdownComponentProps) => {

    const actions = [
        ...((userRole !== MEMBER_ROLES.ADMIN && userUUID !== selectedMember) ? [{ label: 'Make group admin', value: '1' }] : []),
        ...((userRole === MEMBER_ROLES.ADMIN && userUUID !== selectedMember) ? [{ label: 'Remove from admin', value: '2' }] : []),
        ...((userRole !== MEMBER_ROLES.ADMIN && userUUID !== selectedMember) ? [{ label: 'Remove from group', value: '3' }] : []),
        { label: 'Message', value: '3' },
    ];



    return (
      <Dropdown
        style={styles.dropdown}
        data={actions}
        mode= "auto"
        placeholder=""
        selectedTextStyle={{display :"none"}}
        itemTextStyle={{color: "black"}}
        containerStyle={{
          borderRadius: 10,
          width: "90%",
          marginHorizontal: "5%",
          left: "auto",
          shadowColor: "#000", 
          shadowOpacity: 0.1, 
          shadowRadius: 5, 
          shadowOffset: { width: 0, height: 4 }, 
          elevation: 5,
        }}
        onFocus={() => {
          setAction(null);
          onDropdownFocus();
        }}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={action}
        onChange={item => {
          setAction(item.value);
        }}
        renderRightIcon={() => (
          <View style={styles.iconStyle}><ThreeDots width={18} height={18} /></View>
        )}
      />
    );
  };



  const styles = StyleSheet.create({
    dropdown: {
/*       backgroundColor: "red", */
      position: "relative",
      width : "6%",
      marginLeft: 10,
      height: 50,
    },
    iconStyle: {
      width: "0%",
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
     /*  bottom: 0, */
      right:10
    },
  })