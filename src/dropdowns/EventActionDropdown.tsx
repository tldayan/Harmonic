import * as DropdownMenu from "zeego/dropdown-menu";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ThreeDotsVertical from "../assets/icons/three-dots-vertical.svg";
import ThreeDotsHorizontal from "../assets/icons/three-dots-horizontal.svg";

interface DropdownComponentProps {
  action: string | null;
  setAction: React.Dispatch<React.SetStateAction<string | null>>;
  horizontalDots?: boolean;
  createdBy?: string;
}

export const EventActionDropdownComponent = ({
  action,
  setAction,
  horizontalDots,
  createdBy,
}: DropdownComponentProps) => {
  const userUUID = useSelector((state: RootState) => state.auth.userUUID);

  const actions = [
    ...(userUUID === createdBy ? [{ label: "Edit Event", value: "1" }] : []),
    ...(userUUID === createdBy ? [{ label: "Cancel Event", value: "2" }] : []),
    ...(userUUID !== createdBy ? [{ label: "Leave Event", value: "3" }] : []),
  ];

  return (
    <DropdownMenu.Root>
   <DropdownMenu.Trigger style={{padding: 5}} asChild>
        <TouchableOpacity>
          {horizontalDots ? (
            <ThreeDotsHorizontal width={18} height={18} />
          ) : (
            <ThreeDotsVertical width={18} height={18} />
          )}
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content side="bottom" align="end">
        {actions.map((item) => (
          <DropdownMenu.Item
            key={item.value}
            textValue={item.label}
            onSelect={() => setAction(item.value)}
          >
            <DropdownMenu.ItemTitle
              style={{ color: item.value === "2" ? "red" : "black" }}
            >
              {item.label}
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
