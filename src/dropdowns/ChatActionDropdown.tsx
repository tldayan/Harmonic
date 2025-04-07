import { Dropdown } from "react-native-element-dropdown";
import ThreeDotsOrange from "../assets/icons/dots-vertical-orange.svg"
import { StyleSheet, View } from "react-native";

export const chatActions = [
    { label: 'User Info', value: '1' },
    { label: 'Search messages', value: '2' },
    { label: 'Mute notifications', value: '3' },
    { label: 'Add to favorites', value: '4' },
    { label: 'Close chat', value: '5' },
    { label: 'Report', value: '6' },
    { label: 'Block', value: '7' },
    { label: 'Clear chat', value: '8' },
    { label: 'Delete chat', value: '9' },
  ];

interface DropdownComponentProps {
    chatAction: string | null
    setChatAction: React.Dispatch<React.SetStateAction<string | null>>
  }

export const ChatActionDropdownComponent = ({chatAction, setChatAction} : DropdownComponentProps) => {

    return (
      <Dropdown
        style={styles.dropdown}
        data={chatActions}
        mode= "auto"
        placeholder='Group Subject'
        placeholderStyle={{color: "black", fontWeight: 300}}
        itemTextStyle={{color: "black", textAlign :"right"}}
        containerStyle={{
          borderRadius: 15,
          width: "50%",
          marginHorizontal: "50%",
          left: 0,
          shadowColor: "#000", 
          shadowOpacity: 0.1, 
          shadowRadius: 5, 
          shadowOffset: { width: 0, height: 4 }, 
          elevation: 10,
        }}
        onFocus={() => setChatAction(null)}
        maxHeight={300}
        labelField="label"
        valueField="value"
        value={chatAction}
        onChange={item => {
          setTimeout(() => {
            setChatAction(item.value);
          }, 0);
        }}
          renderRightIcon={() => (
          <View style={styles.iconStyle}><ThreeDotsOrange width={18} height={18} /></View>
        )}
      />
    );
  };


  const styles = StyleSheet.create({
        dropdown: {
          /*     backgroundColor: "red", */
       /*    borderWidth: 1, */
          width : 50,
          height: 50,
        },
        iconStyle: {
          width: "100%",
/*           height: 50, */
          alignItems: "center",
          justifyContent: "center"
        },
  
  })