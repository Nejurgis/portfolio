import styled from "@emotion/styled"
import ReactTooltip from "react-tooltip"
// const radii = Math.random() * 100

const ReactTooltipStyled = styled(ReactTooltip)`
  &.type-dark.place-top {
    background-color: black;
    padding: 2rem 2rem;
    color: rgb(0, 255, 0);
    /* -webkit-clip-path: polygon(575px 131px,565px 151px,575px 171px,624px 131px,638px 210px,558px 194px,524px 234px,520px 257px,463px 218px,440px 163px,560px 124px); */
    /* background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3E%3Cpath d='M0,20 C100,80 350,0 500,30 L500,00 L0,0 Z' fill='tomato'/%3E%3C/svg%3E"); */
    /* clip-path: polygon(50% 25%, 50% 2%, 100% 100%, 100 100%); */

    &:after {
      /* content: ""; */

      /* width: 100%; */
      /* height: 1rem; */
      /* border-top-color: blue; */
    }
  }
`
export default ReactTooltipStyled

// <!-- Generator: Adobe Illustrator 22.0.0, SVG Export Plug-In  -->
// <svg version="1.1"
// 	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"
// 	 x="0px" y="0px" width="102px" height="114px" viewBox="0 0 102 114" style="enable-background:new 0 0 102 114;"
// 	 xml:space="preserve">
// <style type="text/css">
// 	.st0{fill:#FFFFFF;stroke:#222221;stroke-miterlimit:10;}
// </style>
// <defs>
// </defs>
// <path class="st0" d="M1.4,37.5h37.3l-23.3,50c0,0-27.3,26.7,13.3,26c40.7-0.7,54.7-2.7,70-30s-39.3-8-29.3-36.7s29.3-46-2-46
// 	s-60-3.3-60,10S-2.6,21.5,1.4,37.5z"/>
// </svg>
//  
