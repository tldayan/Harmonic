import { Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { COUNTRY_CODES } from '../utils/constants'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CloseIcon from "../assets/icons/close.svg"
import { colors } from '../styles/colors';

interface CountryCodesProps {
    setCountryCode: (value: string | null) => void | undefined;
    setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>; 
  }
  
type Country = {
    id: string;
    code: string;
    country: string;
    flagIcon: string;
};

export const CountryCodes: React.FC<CountryCodesProps> = ({ setCountryCode, setIsDropdownVisible }) => {

    const [search, setSearch] = useState<string>("")

    const filteredCountries = useMemo(() => {
        console.log(search)
        return COUNTRY_CODES.filter((eachCountry) => {
            return eachCountry.country.toLowerCase().includes(search.toLowerCase()) || eachCountry.code.includes(search)
        })
    }, [search])

    const handleCountryCodeSelect = (code: string) => {
        setIsDropdownVisible(false)
        setCountryCode(code)
    }


    const renderItem = useCallback(({item} : {item: Country}) => (
        <TouchableOpacity style={styles.countryOption} onPress={() => handleCountryCodeSelect(item.code)}>
            <View style={styles.countryContent} >
            <Text>{item.flagIcon}</Text>
            <View>
                <Text style={styles.countryText}>{item.country} ({item.code})</Text>
            </View>
            </View>
        </TouchableOpacity>
    ), [])
    

  return (

    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Country code</Text>
                <TouchableOpacity style={styles.closeButton} onPress={() => setIsDropdownVisible(false)}>
                    <CloseIcon />
                </TouchableOpacity>
            </View>
            
            <TextInput placeholderTextColor={colors.LIGHT_TEXT_COLOR} style={styles.input} placeholder='Search for a country' value={search} onChangeText={setSearch} />
            <FlatList 
                style={styles.list}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                data={filteredCountries.length > 0 ? filteredCountries : COUNTRY_CODES}
            />
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
    container :{
        flex : 1, 
    },
    headerContainer: {
        position: "relative",
        marginHorizontal: 20,
        alignItems : 'center',
        justifyContent : "center",
        flexDirection: "row",
        padding: 20,
    },
    closeButton: {
        position: "absolute",
        right: 0
    },
    title : {
        textAlign : "center",
        fontWeight: "bold"
    },
    input:  {
        padding : 10,
        borderRadius : 5,
        backgroundColor: "#FAF9F6",
        marginBottom: 10,
        marginHorizontal: 20
    },
    list: {
        paddingHorizontal: 10,
        flex: 1,
        backgroundColor: "white",
    },
    countryOption: {
        paddingVertical: 12,
        paddingHorizontal: 10
      },
      countryContent : {
        flexDirection : "row",
        alignItems: "center",
        gap: 8
      },
      countryCode: {
        fontWeight: 500
      },
      countryText : {
        fontWeight: 400
      }
})