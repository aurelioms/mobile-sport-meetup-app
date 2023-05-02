export const ButtonCustomTheme = {
  defaultProps: {
    colorScheme: "orange",
  },
  variants: {
    solid: ({ colorScheme }: Record<string, any>) => {
      return {
        _light: {
          backgroundColor: `${colorScheme}.500`,
          _pressed: {
            backgroundColor: `${colorScheme}.600`,
          },
        },
        _text: {
          fontWeight: "500",
        },
      };
    },
    outline: ({ colorScheme }: Record<string, any>) => {
      return {
        _light: {
          borderColor: `${colorScheme}.500`,
          backgroundColor: `${colorScheme}.50`,
          _pressed: {
            backgroundColor: `${colorScheme}.100`,
          },
        },
        _text: {
          fontWeight: "500",
        },
      };
    },
    solidDark: ({ colorScheme }: Record<string, any>) => {
      return {
        _light: {
          backgroundColor: `${colorScheme}.600`,
          _pressed: {
            backgroundColor: `${colorScheme}.700`,
          },
        },
        _text: {
          fontWeight: "500",
          color: "white"
        },
      };
    }
  },
};
