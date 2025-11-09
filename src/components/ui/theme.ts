import {createSystem, defaultConfig, defineConfig} from "@chakra-ui/react";


// const brandColor = "#38dfdb"
// const secondaryColor = "#121820"
// const secondaryDarkColor = "#121820"
// const secondaryLightColor = "#181f29"
// const dangerColor = "#ef5f58"
//
// const component = {
//   bg: {
//     value: '#1E242C'
//   },
//   bgHover: {
//     value: '#262D36'
//   },
//   bgActive: {
//     value: '#2C343E'
//   },
//   border: {
//     value: '#2e3540'
//   }
// };


const config = defineConfig({
  globalCss: {
    "html, body": {
      margin: 0,
      padding: 0,
    },
    "body": {
      position: 'relative',
      fontFamily: "Geist, Geist Fallback"
    },
    "a": {
      outline: "none !important"
    },
    ".cm-editor": {
      fontFamily: "'Fira Code', monospace !important",
    },
    ".font-logo": {
      fontFamily: "Geist Mono, Geist Mono Fallback"
    }
  },
  theme: {
    // recipes: {
    //   button: buttonRecipe,
    //   input: inputRecipe,
    //   container: containerRecipe,
    //   textarea: textareaRecipe,
    // },
    // slotRecipes: {
    //   toast: toastSlotRecipe,
    //   select: selectSlotRecipe,
    //   table: tableSlotRecipe,
    //   menu: menuSlotRecipe,
    //   radioCard: radioCardSlotRecipe,
    //   switch: switchSlotRecipe,
    // },
    // tokens: {
    //   colors: {
    //     primary: {
    //       50: {value: '#73faf7'},
    //       100: {value: '#66f6f3'},
    //       200: {value: '#57f3f0'},
    //       300: {value: '#4aefec'},
    //       400: {value: '#41e4e1'},
    //       500: {value: brandColor},
    //       600: {value: '#32ccc8'},
    //       700: {value: '#2aafac'},
    //       800: {value: '#249592'},
    //       900: {value: '#1b706d'},
    //       contrast: {value: 'black'},
    //       solid: {value: brandColor},
    //     },
    //     action: {
    //       50: component.bg,
    //       100: component.bg,
    //       200: component.bg,
    //       300: component.bg,
    //       400: component.bg,
    //       500: component.bg,
    //       600: component.bg,
    //       700: component.bg,
    //       800: component.bg,
    //       900: component.bg,
    //       contrast: {value: 'white'},
    //       solid: component.bg,
    //     },
    //     danger: {
    //       50: {value: "#fef5f5"},
    //       100: {value: "#fbd8d7"},
    //       200: {value: "#f8b5b3"},
    //       300: {value: "#f38783"},
    //       400: {value: "#f06965"},
    //       500: {value: dangerColor},
    //       600: {value: "#b24542"},
    //       700: {value: "#8f3835"},
    //       800: {value: "#792f2d"},
    //       900: {value: "#582220"},
    //       contrast: {value: 'white'},
    //       solid: {value: dangerColor},
    //     },
    //     light: {
    //       50: {value: 'rgba(255,255,255)'},
    //       100: {value: 'rgba(255,255,255)'},
    //       200: {value: 'rgba(255,255,255)'},
    //       300: {value: 'rgba(255,255,255)'},
    //       400: {value: 'rgba(255,255,255)'},
    //       500: {value: 'rgba(255,255,255)'},
    //       600: {value: 'rgba(245,245,245)'},
    //       700: {value: 'rgba(235,235,235)'},
    //       800: {value: 'rgba(225,225,225)'},
    //       900: {value: 'rgba(215,215,215)'},
    //       contrast: {value: 'black'},
    //       solid: {value: 'rgba(255,255,255)'},
    //     },
    //   }
    // },
    // semanticTokens: {
    //   colors: {
    //     primary: {value: brandColor},
    //     secondary: {value: secondaryColor},
    //     secondaryDark: {value: secondaryDarkColor},
    //     secondaryLight: {value: secondaryLightColor},
    //     danger: {value: dangerColor},
    //     action: component.bg,
    //     component,
    //     white: {value: 'rgba(205,205,205)'}
    //   },
    // },
  },
})

export const system = createSystem(defaultConfig, config)
