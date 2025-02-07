import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { COUNTRY_CODES } from '../utils/constants'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import ModalsHeader from '../modals/ModalsHeader';

interface CountryCodesProps {
    setCountryCode: (value: string | null) => void | undefined;
    setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>; 
  }
  
type Country = {
    PhoneCountryId: number,
    PhoneCountryName: string,
    PhoneCountryISO2: string,
    PhoneCountryISO3: string,
    PhoneCode: string,
    PhoneCountryEmoji: string
};

export const CountryCodes: React.FC<CountryCodesProps> = ({ setCountryCode, setIsDropdownVisible }) => {

    const [search, setSearch] = useState<string>("")

    const filteredCountries = useMemo(() => {
        console.log(search)
        return COUNTRY_CODES.filter((eachCountry) => {
            return eachCountry.PhoneCountryName.toLowerCase().includes(search.toLowerCase()) || eachCountry.PhoneCode.includes(search)
        })
    }, [search])

    const handleCountryCodeSelect = (code: string) => {
        setIsDropdownVisible(false)
        setCountryCode(code)
    }


    const renderItem = useCallback(({item} : {item: Country}) => (
        <TouchableOpacity style={styles.countryOption} onPress={() => handleCountryCodeSelect(item.PhoneCode)}>
            <View style={styles.countryContent} >
            <View>
                <Text style={styles.countryText}>{item.PhoneCountryName} ({item.PhoneCode})</Text>
            </View>
            </View>
        </TouchableOpacity>
    ), [])
    

  return (

    <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
            <ModalsHeader title='Country Code' onClose={() => setIsDropdownVisible(false)} />
            
            <TextInput placeholderTextColor={colors.LIGHT_TEXT_COLOR} style={styles.input} placeholder='Search for a country' value={search} onChangeText={setSearch} />
            <FlatList 
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                keyExtractor={(item) => item.PhoneCountryId.toString()}
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