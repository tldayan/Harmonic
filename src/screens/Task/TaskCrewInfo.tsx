import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ChevronDown from "../../assets/icons/chevron-down.svg"

export default function TaskCrewInfo() {

    const [expanded, setExpanded] = useState(false);
    const [crew, setCrew] = useState()

/*         const fetchWorkOrderSchedule = async() => {
            try {
                const workRequestorUserProfileResponse = await getUserProfile(workRequestorUUID)
                setUserProfile(workRequestorUserProfileResponse?.data.Payload) 
            } catch(err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
    
        useEffect(() => {
            fetchWorkOrderSchedule()
        }, []) */




  return (
    <View>

    <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={styles.headerText}>Requestor Info</Text>
            <View style={{ transform: [{ rotate: expanded ? "180deg" : "0deg" }] }}>
                <ChevronDown strokeWidth={3} width={15} height={15} />
            </View>
        </View>
      {expanded && <View style={styles.detailsContainer}>
      
                <View style={styles.invoiceItem}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Crew</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>David</Text>
                    <Text style={styles.valueText}>Praveena</Text>
                    <Text style={styles.valueText}>Luke</Text>
                  </View>
                </View>
        
                {/* <View style={styles.invoiceItem}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>Schedule</Text>
                  </View>
                  <View style={styles.valueContainer}>
                    <Text style={styles.valueText}>
                      {userProfile?.EmailAddress}
                    </Text>
                  </View>
                </View> */}
              </View>}
    </View>
  )
}

const styles = StyleSheet.create({
    headerText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#111928",
    },
    detailsContainer: {
      marginTop: 24,
      width: "100%",
    },
    invoiceItem: {
      paddingVertical: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      width: "100%",
    },
    labelContainer: {
      alignSelf: "stretch",
      justifyContent: "center",
    },
    labelText: {
      color: "#111928",
      fontSize: 14,
      fontWeight: "600",
    },
    valueContainer: {
      flexBasis: "60%",
      maxWidth: "60%",
      flexShrink: 1,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    valueText: {
      color: "#6b7280",
      fontSize: 14,
      textAlign: "right",
      flexWrap: "wrap",
    },
  });
  