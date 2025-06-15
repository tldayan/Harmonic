import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { CustomTextInput } from '../../components/CustomTextInput';
import { defaultInputStyles } from '../../styles/global-styles';
import { WorkOrderInformationState } from '../../types/work-order.types';
import CustomSelectInput from '../../components/CustomSelectInput';
import { colors } from '../../styles/colors';
import { getUserProfile } from '../../api/network-utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { WorkRequestInformationState } from '../../types/work-request.types';

interface TaskUserInfoProps {
  setWorkOrderInformation?: React.Dispatch<React.SetStateAction<WorkOrderInformationState>>;
  workOrderInformation?: WorkOrderInformationState;
  setWorkRequestInformation?: React.Dispatch<React.SetStateAction<WorkRequestInformationState>>;
  workRequestInformation?: WorkRequestInformationState;
}

export default function TaskUserInfo({
  setWorkOrderInformation,
  workOrderInformation,
  setWorkRequestInformation,
  workRequestInformation,
}: TaskUserInfoProps) {
  const { userUUID } = useSelector((state: RootState) => state.auth);

  const state = workOrderInformation ?? workRequestInformation;
  const setState = setWorkOrderInformation ?? setWorkRequestInformation;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userUUID);
        const payload = response?.data?.Payload;

        if (setState) {
          setState((prev: any) => ({
            ...prev,
            creatorEmail: payload?.EmailAddress ?? '',
            creatorNumber: payload?.PhoneNumber ?? '',
            creatorName: payload?.FirstName ?? '',
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={styles.userInfoContainer}>
      <CustomTextInput
        disabled
        value={state?.creatorName ?? ''}
        placeholderTextColor={colors.LIGHT_TEXT_COLOR}
        inputStyle={defaultInputStyles}
        onChangeText={(e) =>
          setState &&
          setState((prev: any) => ({
            ...prev,
            creatorName: e,
          }))
        }
        placeholder="Tarun"
      />
      <CustomTextInput
        disabled
        value={state?.creatorEmail ?? ''}
        placeholderTextColor={colors.LIGHT_TEXT_COLOR}
        inputStyle={defaultInputStyles}
        onChangeText={(e) =>
          setState &&
          setState((prev: any) => ({
            ...prev,
            creatorEmail: e,
          }))
        }
        placeholder="tarun@gmail.com"
      />
      <CustomTextInput
        disabled
        inputStyle={[styles.inputField, styles.numberField]}
        placeholderTextColor={colors.LIGHT_TEXT_COLOR}
        placeholder="123 456 7890"
        countryCodeText={'971'}
        onChangeText={(e) =>
          setState &&
          setState((prev: any) => ({
            ...prev,
            creatorNumber: e,
          }))
        }
        value={state?.creatorNumber ?? ''}
        inputMode="tel"
      />
      <CustomSelectInput placeholder="Unit D3" onSelect={() => {}} />
    </View>
  );
}


const styles = StyleSheet.create({
  userInfoContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 10,
  },
  inputField: {
    borderStyle: 'solid',
    borderColor: colors.BORDER_COLOR,
    borderWidth: 1,
    flex: 1,
    height: 42,
    paddingHorizontal: 16,
    color: 'black',
  },
  numberField: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 0,
  },
});
