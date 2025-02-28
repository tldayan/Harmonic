import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { ViewStyle } from 'react-native';

interface LikeButtonProps {
  style?: ViewStyle;
  stroke?: string;
  strokeWidth?: number;
  fill?: string
}

const LikeButton: React.FC<LikeButtonProps> = ({ style, stroke = '#4D4D4D', strokeWidth = 1.25, fill }) => (
  <Svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill={fill}
    style={style} 
  >
    <Path
      d="M7.33301 11V19C7.33301 19.2652 7.22765 19.5196 7.04011 19.7071C6.85258 19.8946 6.59822 20 6.33301 20H4.33301C4.06779 20 3.81344 19.8946 3.6259 19.7071C3.43836 19.5196 3.33301 19.2652 3.33301 19V12C3.33301 11.7348 3.43836 11.4804 3.6259 11.2929C3.81344 11.1054 4.06779 11 4.33301 11H7.33301ZM7.33301 11C8.39387 11 9.41129 10.5786 10.1614 9.82843C10.9116 9.07828 11.333 8.06087 11.333 7V6C11.333 5.46957 11.5437 4.96086 11.9188 4.58579C12.2939 4.21071 12.8026 4 13.333 4C13.8634 4 14.3721 4.21071 14.7472 4.58579C15.1223 4.96086 15.333 5.46957 15.333 6V11H18.333C18.8634 11 19.3721 11.2107 19.7472 11.5858C20.1223 11.9609 20.333 12.4696 20.333 13L19.333 18C19.1892 18.6135 18.9164 19.1402 18.5557 19.501C18.1949 19.8617 17.7658 20.0368 17.333 20H10.333C9.53736 20 8.7743 19.6839 8.21169 19.1213C7.64908 18.5587 7.33301 17.7956 7.33301 17"
      stroke={stroke} 
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LikeButton;
