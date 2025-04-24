import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface WorkOrderItemProps {
    wordOrderItem: WorkOrder
}

export default function WorkOrderItem({WorkOrderItem}: WorkOrderItemProps) {
  return (
    <View>
      <Text>WorkOrderItem</Text>
    </View>
  )
}

const styles = StyleSheet.create({})