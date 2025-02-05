export interface PasswordCheck {
    hasSymbol: boolean;
    hasNumber: boolean;
    hasLowerCase: boolean;
    isLongEnough: boolean;
    passedChecks: number;
  }
  