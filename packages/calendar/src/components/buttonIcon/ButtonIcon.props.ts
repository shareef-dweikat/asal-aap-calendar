export type ButtonIconSize = 'small' | 'normal' | 'big' | 'full';
export interface ButtonIconProps {
  children: any;
  onClick?: any;
  isDark: boolean;
  size?: ButtonIconSize;
  iconSize?: ButtonIconSize;
  disabled?: boolean;
  backdropClassName?: string;
  noActive?: boolean;
  style?: any;
}
