import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CheckIcon from "../../assets/icons/check.svg";
import { colors } from "../../styles/colors";

interface WorkPriority {
  WorkPriorityId: number;
  WorkPriorityUUID: string;
  WorkPriorityName: string;
  WorkPriorityDescription: string;
  IsDeleted: boolean;
}


interface RadioGroupProps {
  label: string;
  options?: WorkPriority[];
  onSelect?: (selectedOption: WorkPriority) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleSelect = (selectedOption: WorkPriority) => {
    setSelectedId(selectedOption.WorkPriorityUUID);
    if (onSelect) {
      onSelect(selectedOption);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options?.map((option) => (
          <TouchableOpacity
            key={option.WorkPriorityUUID}
            style={styles.radioOption}
            onPress={() => handleSelect(option)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioButton,
                selectedId === option.WorkPriorityUUID ? styles.radioButtonSelected : {},
              ]}
            >
              {selectedId === option.WorkPriorityUUID && (
                <CheckIcon height={10} width={10} />
              )}
            </View>
            <View style={styles.radioLabel}>
              <Text style={styles.radioLabelText}>{option.WorkPriorityName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: "100%",
    gap: 8,
  },
  labelContainer: {
    marginBottom: 4,
  },
  labelText: {
    color: "#111928",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
  },
  optionsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 4,
    gap: 8,
  },
  radioButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: "#F9FAFB",
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR
  },
  radioButtonSelected: {
    backgroundColor: "#1A56DB",
  },
  radioLabel: {
    justifyContent: "center",
  },
  radioLabelText: {
    color: "#111928",
    fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: 14,
  },
});

export default RadioGroup;
