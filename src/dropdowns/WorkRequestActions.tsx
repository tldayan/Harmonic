import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ThreeDotsVertical from "../assets/icons/three-dots-vertical.svg";
import ThreeDotsHorizontal from "../assets/icons/three-dots-horizontal.svg";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";


interface DropdownComponentProps {
  action: string | null;
  setAction: React.Dispatch<React.SetStateAction<string | null>>;
  horizontalDots?: boolean;
}

export const WorkRequestActionDropdownComponent = ({
  action,
  setAction,
  horizontalDots,
}: DropdownComponentProps) => {

    const userUUID = useSelector((state: RootState) => state.auth.userUUID)

    const actions: { label: string; value: string }[] = [
      { label: "Approve Task", value: "1" },
      { label: "Decline Task", value: "2" }
    ];
      





  return (
    <Dropdown
      style={styles.dropdown}
      data={actions}
      mode="auto"
      placeholder=""
      selectedTextStyle={{ display: "none" }}
      containerStyle={styles.dropdownContainer}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={action}
      onFocus={() => setAction(null)}
      onChange={(item) => {
        setAction(item.value);
      }}
      renderRightIcon={() => (
        <View style={styles.iconStyle}>
          {horizontalDots ? (
            <ThreeDotsHorizontal width={18} height={18} />
          ) : (
            <ThreeDotsVertical width={18} height={18} />
          )}
        </View>
      )}
      renderItem={(item) => (
        <Text
          style={[
            styles.dropdownItem,
            item.value === "2" && styles.deleteOption,
          ]}
        >
          {item.label}
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
 /*    backgroundColor: "red", */
/*  borderWidth: 1, */
    position: "relative",
    width: "10%",
    marginLeft: "auto",
    alignSelf: "flex-start",
    height: "auto",
  },
  dropdownContainer: {
    borderRadius: 15,
    width: "60%",
    marginHorizontal: "-50%",
    marginTop: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  iconStyle: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownItem: {
    padding: 10,
    fontSize: 14,
    color: "black",
  },
  deleteOption: {
    color: "red",
  },
});
