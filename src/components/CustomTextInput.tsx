import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CustomTextInputFieldProps } from "../types/text-input.types";
import { useRef, useState } from "react";
import { colors } from "../styles/colors";
import UsFlag from "../assets/icons/US.svg"
import CanadaFlag from "../assets/icons/CA.svg"
import UKFlag from "../assets/icons/GB.svg"
import ChevronDown from "../assets/icons/chevron-down.svg"
import AEFlag from "../assets/icons/AE.svg"

export const CustomTextInput: React.FC<CustomTextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  inputStyle,
  labelStyle,
  placeholderTextColor,
  errorMessage,
  rightIcon,
  inputMode,
  countryCode,
  setCountryCode
}) => {
  
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; country: string; flagIcon: React.ReactNode }>({
    code: "+1",
    country: "United States",
    flagIcon: <UsFlag width={19.6} height={14} />
  });

  const numberInputRef = useRef<any>(null);
  const countryCodes = [
    { id : "1", code: "+1", country: "United States", flagIcon: <UsFlag width={19.6} height={14} /> },
    { id : "2", code: "+1", country: "Canada", flagIcon: <CanadaFlag width={19.6} height={14} /> },
    { id : "3", code: "+44", country: "United Kingdom", flagIcon: <UKFlag width={19.6} height={14} /> },
    { id : "4", code: "+971", country: "UAE", flagIcon: <AEFlag width={19.6} height={14} /> }
  ];

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleCountryCodeSelect = (code: string, country: string, flagIcon: React.ReactNode) => {
    if (setCountryCode) {
      setCountryCode(code); 
    }
    setSelectedCountry({ code, country, flagIcon });
    setIsDropdownVisible(false);
  };


  return (
    <View style={[styles.container]}>
      {label && <Text style={[labelStyle, isFocused && {color: "#111928"}]}>{label}</Text>}
      <View style={styles.inputWrapper}>
        {inputMode === "tel" && 
        <TouchableOpacity style={styles.numberInput} ref={numberInputRef} onPress={toggleDropdown}>
          {selectedCountry.flagIcon}
          <Text style={styles.countryCode}>{countryCode}</Text>
          <ChevronDown width={10} height={10} />
        </TouchableOpacity>}
        <TextInput
          inputMode={inputMode}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            inputStyle,
            errorMessage && { backgroundColor: colors.RED_SHADE, borderColor: "red" },
            isFocused && !errorMessage && { borderColor: colors.ACTIVE_ACCENT_COLOR }
          ]}
          
          onFocus={handleFocus} 
          onBlur={handleBlur} 
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {isDropdownVisible && <View style={[styles.dropdown, { top: (numberInputRef.current?.offsetHeight || 0) + 70 }]}>
          <FlatList
            data={countryCodes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCountryCodeSelect(item.code, item.country, item.flagIcon)} style={styles.countryOption}>
                <View style={styles.countryContent}>
                  {item.flagIcon}
                  <View >
                    <Text style={styles.countryText}>{item.country} ({item.code})</Text>
                  </View>
                </View>
                
              </TouchableOpacity>
            )}
          />
        </View>}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  inputWrapper: {
    borderRadius : 50,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingRight: 40,
    flex: 1,
  },
  numberInput: {
    borderColor: colors.BORDER_COLOR,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderWidth: 1,
    backgroundColor: "#F3F4F6",
/*     width : "30%", */
    fontWeight: 500,
    height : "100%",
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent :"center",
    gap : 8
  },
  dropdown: {
    position: 'absolute',
    width: '60%',
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    zIndex: 1,
    marginTop: 5,
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 25
  },
  countryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -8}],
  },
  errorText: {
    color: 'red',
    marginTop: 5
  },
});