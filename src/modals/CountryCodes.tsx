import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { COUNTRY_CODES } from '../utils/constants'
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import ModalsHeader from '../modals/ModalsHeader';
import { getCountryCodes } from '../api/network-utils';

interface CountryCodesProps {
    setCountryCode: (value: Country | null) => void | undefined;
    setIsDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>; 
  }
  

export const CountryCodes: React.FC<CountryCodesProps> = ({ setCountryCode, setIsDropdownVisible }) => {

    const [search, setSearch] = useState<string>("")
    const [countryCodes, setCountryCodes] = useState<Country[]>([])

    const fetchCoutryCodes = async() => {
        const countryCodes = await getCountryCodes()
        setCountryCodes(countryCodes)
    }

    useEffect(() => {
        if(countryCodes.length !== 0) return
        fetchCoutryCodes() //API REQUIRES AUTH TOKEN
    }, [])

    const filteredCountries = useMemo(() => {
        
        if(countryCodes.length === 0 || !countryCodes) return

        return countryCodes.filter((eachCountry) => {
            return eachCountry.PhoneCountryName.toLowerCase().includes(search.toLowerCase()) || eachCountry.PhoneCode.includes(search)
        })
    }, [search])

    const handleCountryCodeSelect = (item: Country) => {
        setIsDropdownVisible(false)
        setCountryCode(item)
    }


    const renderItem = useCallback(({item} : {item: Country}) => (
        <TouchableOpacity style={styles.countryOption} onPress={() => handleCountryCodeSelect(item)}>
            <View style={styles.countryContent} >
                <View>
                    <Text style={styles.countryText}>{item.PhoneCountryEmojiRaw} {item.PhoneCountryName} ({item.PhoneCode})</Text>
                </View>
            </View>
        </TouchableOpacity>
    ), [])
    

  return (
        <SafeAreaView style={styles.container}>
            <ModalsHeader title='Country Code' onClose={() => setIsDropdownVisible(false)} />
            
            <TextInput placeholderTextColor={colors.LIGHT_TEXT_COLOR} style={styles.input} placeholder='Search for a country' value={search} onChangeText={setSearch} />
            {countryCodes?.length === 0 ? <ActivityIndicator size={"small"} /> :
            <FlatList
                keyboardShouldPersistTaps="handled"
                style={styles.list}
                keyExtractor={(item) => item.PhoneCountryId?.toString()}
                renderItem={renderItem}
                data={(filteredCountries && filteredCountries?.length > 0) ? filteredCountries : countryCodes}
            />}
        </SafeAreaView>
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