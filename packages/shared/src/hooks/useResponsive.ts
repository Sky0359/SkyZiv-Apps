
import { useWindowDimensions } from 'react-native';

export const breakpoints = {
  mobile: 600,
  tablet: 900,
  desktop: 1200,
} as const;

export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();

  const isMobile = width < breakpoints.mobile;
  const isTablet =
    width >= breakpoints.mobile &&
    width < breakpoints.tablet;
  const isDesktop = width >= breakpoints.tablet;

  const columns =
    width < 600 ? 1 :
    width < 900 ? 2 :
    width < 1200 ? 3 : 4;

  return {
    width,
    height,
    fontScale,
    isMobile,
    isTablet,
    isDesktop,
    columns,
  };
}
