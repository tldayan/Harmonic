import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../../styles/button-styles'
import { colors } from '../../styles/colors'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'

type Props = NativeStackScreenProps<RootStackParamList, "Hero">;

export default function HeroScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.subHeadingContainer}>
        <View style={styles.bar} />
        <Text style={styles.heading}>We invest in the world’s potential</Text>
        <Text style={styles.subHeading}>Be a part of a community you could only dream of.</Text>
        <CustomButton iconPosition='right' buttonStyle={[PRIMARY_BUTTON_STYLES, {marginTop: 0,backgroundColor : colors.BRIGHT_ORANGE, height: 48, width: 151, borderWidth: 1, borderColor: colors.BORDER_ORANGE}]} textStyle={{fontWeight : 500, fontSize: 16, color: "white"}} onPress={() => {navigation.navigate("Auth")}} title="Learn more" icon={<Image height={10} width={10} source={require("../../assets/images/arrow-right.png")} />} />
      </View>
      
      <View style={styles.socialsContainer}>
        <Text style={styles.featured}>FEATURED IN</Text>
        <View style={styles.youtubeContainer}>
            <Image style={styles.youtubeLogo} source={require("../../assets/images/youtube-logo.png")} />
            <Image style={styles.youtubeLogoText} source={require("../../assets/images/youtube-logo-text.png")} />
        </View>
            <Image style={styles.productHuntLogo} source={require("../../assets/images/product-hunt-logo.png")} />
        <View style={styles.redditContainer}>
            <Image style={styles.redditLogo} source={require("../../assets/images/reddit-logo.png")} />
            <Image style={styles.redditLogoText} source={require("../../assets/images/reddit-logo-text.png")} />
        </View>
      </View>
      
    </View>
  )
}

const styles = StyleSheet.create({

    container : {
        flex: 1,
        backgroundColor : "white",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 32,
        paddingBottom: 32
    },
    bar: {
        marginTop: 20,
        height: 30,
        width: 343,
        borderRadius: 14,
        marginBottom: 32,
        backgroundColor: "#F3F4F6"
    },
    heading: {
        fontWeight: 800,
        fontSize: 36,
        textAlign: "center",
        marginBottom: 24,
    },
    subHeadingContainer : {
        alignItems: "center"
    },
    subHeading: {
        color: colors.LIGHT_TEXT_COLOR,
        marginBottom: 32,
        fontSize: 18,
        flexWrap: "wrap",
        textAlign: "center"
    },
    socialsContainer: {
        gap: 32,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 64
    },
    featured: {
        color: colors.LIGHT_TEXT_COLOR,
    },
    youtubeContainer : {
        flexDirection : "row",
        gap: 10,
        alignItems :"center",
        justifyContent: "center"
    },
    youtubeLogoText : {
        width: 100,
        height: 37,
        resizeMode: "contain"
    },
    youtubeLogo: {
        width: 50,
        height: 40,
        resizeMode: "contain"
    },
    redditContainer :{
        flexDirection : "row",
        gap: 10,
        alignItems :"center",
        justifyContent: "center"
    },
    redditLogo: {
        width: 50,
        height: 50,
        resizeMode: "contain"
    },
    redditLogoText : {
        width: 100,
        height: 27,
        resizeMode: "contain"
    },
    productHuntLogo: {
        width: 250,
        height: 57,
        resizeMode: "contain"
    }

})