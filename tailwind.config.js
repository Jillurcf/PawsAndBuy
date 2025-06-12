// const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  // content: ["./src/app/**/*.{js,jsx,ts,tsx}"],
  // presets: [require("nativewind/preset")],
  theme: {
    screens: {
      sm: '300px',
      md: '400px',
      lg: '880px',
      tablet: '1024px',
    },
    extend: {
      fontFamily: {
        RoboBlack: 'RoboBlack',
        RoboBlackItalic: 'RoboBlackItalic',
        RoboBold: ' RoboBold',
        RoboBoldItalic: 'RoboBoldItalic',
        RoboMedium: 'RoboMedium',
        RoboItalic: 'RoboItalic',
        RoboLight: 'RoboLight',
        RoboMedium: 'RoboMedium',
        RoboRegular: 'RoboRegular',
      },

      colors: {
        primary: '#064145',
        title: '#272727',
        subT: '#5e5e5e',
        primary: '#064145',
        offWhite: '#E6ECEC',
        secondary: '#F4FAFA',
        white100: '#EFEFEF',
        border: '#DFDFDF',
        primary100: '#EEF6F6',
        primary200: '#9BB3B5',
        danger: '#CE3535',
      },
    },
  },
  plugins: [],
}