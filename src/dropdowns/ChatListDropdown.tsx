import React from "react";
import {TouchableOpacity } from "react-native";
import * as DropdownMenu from "zeego/dropdown-menu";
import ThreeDots from "../assets/icons/three-dots-vertical.svg";

const actions = [
  { label: "Create Group", value: "1" },
  { label: "New Chat", value: "2" },
];

interface DropdownComponentProps {
  action: string | null;
  setAction: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatListDropdownComponent = ({
  action,
  setAction,
}: DropdownComponentProps) => {
  return (
    <DropdownMenu.Root>
  <DropdownMenu.Trigger style={{padding: 5}} asChild>
        <TouchableOpacity>
          <ThreeDots width={18} height={18} />
        </TouchableOpacity>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        {actions.map((item) => (
          <DropdownMenu.Item
            key={item.value}
            textValue={item.label}
            onSelect={() => setAction(item.value)}
          >
            <DropdownMenu.ItemTitle>
              {item.label}
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

