// tailwind.config.ts
export default {
    theme: {
      extend: {
        colors: {
          customPrimary: {
            'bunting': {  DEFAULT: '#172557',  50: '#546FD2',  100: '#4462CD',  200: '#314EB8',  300: '#284098',  400: '#203377',  500: '#172557',  600: '#0B122B',  700: '#000000',  800: '#000000',  900: '#000000',  950: '#000000'},
          },
          customYellow: {
            'lightning-yellow': {  DEFAULT: '#F9BD1D',  50: '#FEF1D0',  100: '#FDEBBC',  200: '#FCE094',  300: '#FBD46C',  400: '#FAC945',  500: '#F9BD1D',  600: '#D89F06',  700: '#A27704',  800: '#6B4E03',  900: '#342601',  950: '#191201'},
          },
        },
        fontFamily: {
          gotham: ['Gotham'],
        },
      }
    }
  }