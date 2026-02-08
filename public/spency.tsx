import React from "react"

type SpencyDarkType = React.SVGProps<SVGSVGElement>

export function SpencyDark({className, ...props}: SpencyDarkType) {

  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className} 
      {...props}
    >
     <rect x="30" y="30" width="452" height="452" rx="226" stroke="currentColor" strokeWidth="60"/>
      <rect x="128" y="127" width="256" height="60" rx="30" fill="currentColor"/>
    </svg>
  )
}

