import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ThreeDots from "../assets/icons/three-dots-vertical.svg"

const actions = [
    { label: 'Create Group', value: '1' },
    { label: 'Message Store', value: '2' },
  ];
  
  interface DropdownComponentProps {
    action: string | null
    setAction: React.Dispatch<React.SetStateAction<string | null>>
  }
  
  export const ChatListDropdownComponent = ({action,setAction}: DropdownComponentProps) => {
  
    return (
      <Dropdown
        style={styles.dropdown}
        data={actions}
        mode= "auto"
        placeholder=""
        selectedTextStyle={{display :"none"}}
        itemTextStyle={{color: "black"}}
        containerStyle={{
          borderRadius: 5,
          width: "90%",
          marginHorizontal: "5%",
          left: "auto",
          shadowColor: "#000", 
          shadowOpacity: 0.1, 
          shadowRadius: 5, 
          shadowOffset: { width: 0, height: 4 }, 
          elevation: 5,
        }}
        onFocus={() => setAction(null)}
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
  /*     backgroundColor: "red", */
      position: "relative",
      width : "6%",
      marginLeft: "auto",
      height: 50,
    },
    iconStyle: {
      width: "100%",
      height: 50,
      alignItems: "center",
      justifyContent: "center"
    },
  })