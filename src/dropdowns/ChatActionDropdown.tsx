import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';
import ThreeDotsOrange from '../assets/icons/dots-vertical-orange.svg';

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
  chatAction: string | null;
  setChatAction: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatActionDropdownComponent = ({
  setChatAction,
}: DropdownComponentProps) => {
  return (
    <DropdownMenu.Root>
  <DropdownMenu.Trigger style={{padding: 5}} asChild>
    <TouchableOpacity>
      <ThreeDotsOrange width={18} height={18} />
    </TouchableOpacity>
  </DropdownMenu.Trigger>

  <DropdownMenu.Content side="bottom" align="end">
    {chatActions.map(item => (
      <DropdownMenu.Item
        key={item.value}
        textValue={item.label}
        onSelect={() => setChatAction(item.value)}
        destructive={item.value === '7' || item.value === '9'}
      >
        <DropdownMenu.ItemTitle>{item.label}</DropdownMenu.ItemTitle>
      </DropdownMenu.Item>
    ))}
  </DropdownMenu.Content>
</DropdownMenu.Root>

  );
};
