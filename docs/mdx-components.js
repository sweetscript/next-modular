import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs' // nextra-theme-blog or your custom theme
 
// Get the default MDX components
const themeComponents = getThemeComponents()
 
// Merge components
export function useMDXComponents(components) {
  return {
    ...themeComponents,
    ...components
  }
}

// import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

// const docsComponents = getDocsMDXComponents()

// export const useMDXComponents = components => ({
//   ...docsComponents,
//   ...components
// })