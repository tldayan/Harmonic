import { TouchableOpacity } from "react-native"
import { CustomIconButtonProps } from "../types/icon-button.types"



export const CustomIconButton: React.FC<CustomIconButtonProps> = ({onPress,icon}) => {

    return (
        <TouchableOpacity onPress={onPress}>
            {icon}
        </TouchableOpacity> 
    )

}