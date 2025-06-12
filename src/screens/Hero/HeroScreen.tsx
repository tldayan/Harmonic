import { StyleSheet, Text, View, Image, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import { PRIMARY_BUTTON_STYLES } from '../../styles/button-styles'
import { colors } from '../../styles/colors'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../types/navigation-types'
import { CustomSafeAreaView } from '../../components/CustomSafeAreaView'

const { width, height } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, "Hero">;

export default function HeroScreen({ navigation }: Props) {
  return (
    <CustomSafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.subHeadingContainer}>
          <View style={styles.bar} />
          <Text style={styles.heading}>We invest in the world’s potential</Text>
          <Text style={styles.subHeading}>Be a part of a community you could only dream of.</Text>

          <CustomButton
            iconPosition='right'
            buttonStyle={[
              PRIMARY_BUTTON_STYLES,
              styles.learnMoreButton
            ]}
            textStyle={styles.learnMoreText}
            onPress={() => navigation.navigate("Auth")}
            title="Learn more"
            icon={
              <Image
                style={{ width: 12, height: 12 }}
                source={require("../../assets/images/arrow-right.png")}
              />
            }
          />
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
      </ScrollView>
    </CustomSafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    alignItems: "center",
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.05,
  },
  bar: {
    height: 30,
    width: '100%',
    maxWidth: 343,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    marginVertical: 24,
  },
  heading: {
    fontWeight: "800",
    fontSize: width > 400 ? 36 : 28,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 40,
  },
  subHeadingContainer: {
    alignItems: "center",
    width: '100%',
  },
  subHeading: {
    color: colors.LIGHT_TEXT_COLOR,
    marginBottom: 24,
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  learnMoreButton: {
    marginTop: 0,
    backgroundColor: colors.BRIGHT_ORANGE,
    height: 48,
    width: 151,
    borderWidth: 1,
    borderColor: colors.BORDER_ORANGE,
  },
  learnMoreText: {
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
  socialsContainer: {
    marginTop: 48,
    alignItems: "center",
    gap: 24,
    width: '100%',
  },
  featured: {
    color: colors.LIGHT_TEXT_COLOR,
    fontSize: 14,
    marginBottom: 8,
  },
  youtubeContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  youtubeLogo: {
    width: 50,
    height: 40,
    resizeMode: "contain",
  },
  youtubeLogoText: {
    width: 100,
    height: 37,
    resizeMode: "contain",
  },
  productHuntLogo: {
    width: width * 0.6,
    height: 57,
    resizeMode: "contain",
  },
  redditContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  redditLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  redditLogoText: {
    width: 100,
    height: 27,
    resizeMode: "contain",
  },
});
