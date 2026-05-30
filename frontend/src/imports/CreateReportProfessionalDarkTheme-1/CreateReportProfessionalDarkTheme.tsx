import svgPaths from "./svg-d3eu477w8p";
import imgPlaceholderImageForMap from "./311b677a528fb8316fca7905a55867722cf4c813.png";

function Container() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p2069b680} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[33.41px]">
          <p className="leading-[20px]">Back</p>
        </div>
      </div>
    </div>
  );
}

function FloatingBackButton() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.3)] relative rounded-[9999px] shrink-0" data-name="Floating Back Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[17px] py-[9px] relative size-full">
        <Container />
        <Container1 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[24px] text-center w-[265.22px]">
        <p className="leading-[31.2px]">Incident Report</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function ContextualFormHeader() {
  return (
    <div className="backdrop-blur-[12px] bg-[rgba(11,14,21,0.8)] drop-shadow-[0px_4px_15px_rgba(0,0,0,0.5)] h-[64px] relative shrink-0 w-full z-[2]" data-name="Contextual Form Header">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-px pl-[24px] pr-[511.73px] relative size-full">
          <FloatingBackButton />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[24px] w-[179.61px]">
          <p className="leading-[31.2px]">Incident Details</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[17px] pt-[16px] px-[24px] relative size-full">
          <Container3 />
          <Heading1 />
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[14.4px]">REPORT TITLE</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[16px] w-full">
          <p className="leading-[normal]">e.g., Flood breach at Sector 4</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden="true" className="absolute bg-[#32353c] inset-0 pointer-events-none rounded-[8px]" />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start px-[17px] py-[15px] relative size-full">
          <Container5 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]" />
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function TitleInput() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Title Input">
      <Label />
      <Input />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[14.4px]">DETAILED DESCRIPTION</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[16px] w-full">
          <p className="leading-[24px]">Provide as much context as possible regarding the situation...</p>
        </div>
      </div>
    </div>
  );
}

function Textarea() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
      <div aria-hidden="true" className="absolute bg-[#32353c] inset-0 pointer-events-none rounded-[8px]" />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[85px] pt-[13px] px-[17px] relative size-full">
          <Container6 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]" />
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function DescriptionInput() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Description Input">
      <Label1 />
      <Textarea />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[14.4px]">SEVERITY LEVEL</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p1c6d5490} fill="var(--fill-0, #C2C6D6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[14px] tracking-[0.14px] w-[92.91px]">
          <p className="leading-[19.6px]">Low / Routine</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#1d2027] flex-[1_0_0] h-full min-w-px relative rounded-[8px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[17px] py-[13px] relative size-full">
          <Container8 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function LabelLow() {
  return (
    <div className="col-1 content-stretch flex h-[45.59px] items-start justify-center justify-self-stretch relative row-1 shrink-0" data-name="Label - Low">
      <BackgroundBorder />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[16.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 14.25">
        <g id="Container">
          <path d={svgPaths.p10d9fd00} fill="var(--fill-0, #FFB786)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffb786] text-[14px] tracking-[0.14px] w-[100.73px]">
          <p className="leading-[19.6px]">Medium / Alert</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderShadow() {
  return (
    <div className="bg-[rgba(255,183,134,0.1)] drop-shadow-[0px_0px_7.5px_rgba(255,183,134,0.15)] flex-[1_0_0] h-full min-w-px relative rounded-[8px]" data-name="Overlay+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[#ffb786] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[17px] py-[13px] relative size-full">
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function LabelMedium() {
  return (
    <div className="col-2 content-stretch flex h-[45.59px] items-start justify-center justify-self-stretch relative row-1 shrink-0" data-name="Label - Medium">
      <OverlayBorderShadow />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p12539700} fill="var(--fill-0, #C2C6D6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[14px] tracking-[0.14px] w-[138.19px]">
          <p className="leading-[19.6px]">Critical / Emergency</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#1d2027] flex-[1_0_0] h-full min-w-px relative rounded-[8px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[17px] py-[13px] relative size-full">
          <Container12 />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function LabelHigh() {
  return (
    <div className="col-3 content-stretch flex h-[45.59px] items-start justify-center justify-self-stretch relative row-1 shrink-0" data-name="Label - High">
      <BackgroundBorder1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_45.59px] relative shrink-0 w-full" data-name="Container">
      <LabelLow />
      <LabelMedium />
      <LabelHigh />
    </div>
  );
}

function SeveritySelector() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Severity Selector">
      <Label2 />
      <Container7 />
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[23px] items-start pb-[24.01px] pt-[23px] px-[24px] relative size-full">
        <TitleInput />
        <DescriptionInput />
        <SeveritySelector />
      </div>
    </div>
  );
}

function Section1IncidentDetails() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] relative rounded-[12px] shrink-0 w-full" data-name="Section 1: Incident Details">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <HorizontalBorder />
        <Container4 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.3)]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p1869180} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[24px] w-[277.92px]">
        <p className="leading-[31.2px]">{`Location & Coordination`}</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container15 />
        <Heading2 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 size-[16.425px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.425 16.425">
        <g id="Container">
          <path d={svgPaths.p9d9e300} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[14.39px] relative shrink-0 w-[91.16px]" data-name="Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] left-1/2 not-italic text-[#adc6ff] text-[12px] text-center top-[6.5px] tracking-[0.6px] uppercase w-[91.16px]">
        <p className="leading-[14.4px]">USE CURRENT</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[24px] relative size-full">
          <Container14 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[16px] w-full">
          <p className="leading-[normal]">Search coordinates or address...</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div aria-hidden="true" className="absolute bg-[#32353c] inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pl-[49px] pr-[17px] py-[15px] relative size-full">
          <Container19 />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]" />
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bottom-[26%] content-stretch flex flex-col items-start left-[16px] top-[26%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #8C909F)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function SearchInput() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Search Input">
      <Input1 />
      <Container20 />
    </div>
  );
}

function Shadow() {
  return (
    <div className="h-[26.667px] relative shrink-0 w-[21.333px]" data-name="Shadow">
      <div className="absolute inset-[-30%_-37.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37.3333 42.6667">
          <g filter="url(#filter0_d_1_1482)" id="Shadow">
            <path d={svgPaths.p1a636980} fill="var(--fill-0, #FFB4AB)" id="Icon" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="42.6667" id="filter0_d_1_1482" width="37.3333" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.705882 0 0 0 0 0.670588 0 0 0 0.8 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1482" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1482" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,180,171,0.2)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="Overlay">
      <Shadow />
    </div>
  );
}

function CenterPin() {
  return (
    <div className="absolute content-stretch drop-shadow-[0px_25px_12.5px_rgba(0,0,0,0.15)] flex flex-col inset-[40.63%_46.93%] items-center" data-name="Center Pin">
      <Overlay />
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p264eb400} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Liberation_Mono:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[12px] w-[165.64px]">
          <p className="leading-[14.4px]">-6.2088° S, 106.8456° E</p>
        </div>
      </div>
    </div>
  );
}

function CoordinatesOverlay() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(50,53,60,0.9)] bottom-[17px] content-stretch flex gap-[8px] items-center left-[17px] px-[13px] py-[5px] rounded-[4px]" data-name="Coordinates Overlay">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Container21 />
      <Container22 />
    </div>
  );
}

function MapArea() {
  return (
    <div className="bg-[#0b0e15] h-[256px] relative rounded-[8px] shrink-0 w-full" data-name="Map Area">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <div className="absolute inset-px mix-blend-luminosity opacity-40" data-name="Placeholder Image for Map">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[307.09%] left-0 max-w-none top-[-103.54%] w-full" src={imgPlaceholderImageForMap} />
          </div>
        </div>
        <div className="absolute bg-gradient-to-t from-[#0b0e15] inset-px to-[rgba(11,14,21,0)]" data-name="Map Overlay Gradient" />
        <CenterPin />
        <CoordinatesOverlay />
      </div>
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <SearchInput />
        <MapArea />
      </div>
    </div>
  );
}

function Section2LocationCoordination() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] relative rounded-[12px] shrink-0 w-full" data-name="Section 2: Location & Coordination">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <HorizontalBorder1 />
        <Container18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.3)]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[18px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 18">
        <g id="Container">
          <path d={svgPaths.p15b83880} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[24px] w-[184.34px]">
          <p className="leading-[31.2px]">Media Evidence</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[17px] pt-[16px] px-[24px] relative size-full">
          <Container23 />
          <Heading3 />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[21.333px] relative shrink-0 w-[29.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.3333 21.3333">
        <g id="Container">
          <path d={svgPaths.p357ea5e0} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#32353c] relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container24 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] text-center w-[305.55px]">
        <p className="leading-[24px]">Drag and drop photos or video files here</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[12px] text-center w-[203.78px]">
        <p className="leading-[14.4px]">or click to browse from your device</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-[305.55px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[3px] items-start relative size-full">
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#424754] text-[10px] tracking-[1px] uppercase w-[150.63px]">
          <p className="leading-[15px]">MAX SIZE: 50MB PER FILE</p>
        </div>
      </div>
    </div>
  );
}

function DragDropZone() {
  return (
    <div className="bg-[#0b0e15] relative rounded-[12px] shrink-0 w-[782px]" data-name="Drag & Drop Zone">
      <div aria-hidden="true" className="absolute border-2 border-[#424754] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-center justify-center p-[42px] relative size-full">
        <Background />
        <Container25 />
        <Margin />
      </div>
    </div>
  );
}

function Section3MediaEvidence() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] relative rounded-[12px] shrink-0 w-full" data-name="Section 3: Media Evidence">
      <div className="content-stretch flex flex-col gap-[24px] items-center overflow-clip pb-[25px] pt-px px-px relative rounded-[inherit] size-full">
        <HorizontalBorder2 />
        <DragDropZone />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.3)]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[25px] py-[13px] relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[14px] text-center tracking-[0.14px] w-[89.67px]">
          <p className="leading-[19.6px]">Cancel</p>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[13.333px] relative shrink-0 w-[15.833px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.8333 13.3333">
        <g id="Container">
          <path d={svgPaths.pf594000} fill="var(--fill-0, #002E6A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#adc6ff] drop-shadow-[0px_0px_10px_rgba(173,198,255,0.2)] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[32px] py-[12px] relative size-full">
        <Container28 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#002e6a] text-[14px] text-center tracking-[0.14px] w-[97.03px]">
          <p className="leading-[19.6px]">{`Submit `}</p>
        </div>
      </div>
    </div>
  );
}

function ActionBar() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-end pb-[48px] pt-[25px] relative shrink-0 w-full" data-name="Action Bar">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <Button1 />
      <Button2 />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full" data-name="Form">
      <Section1IncidentDetails />
      <Section2LocationCoordination />
      <Section3MediaEvidence />
      <ActionBar />
    </div>
  );
}

function MainCanvas() {
  return (
    <div className="content-stretch flex flex-col h-[960px] items-start max-w-[896px] overflow-clip pb-[64px] pt-[48px] px-[32px] relative shrink-0 w-[896px] z-[1]" data-name="Main Canvas">
      <Form />
    </div>
  );
}

export default function CreateReportProfessionalDarkTheme() {
  return (
    <div className="content-stretch flex flex-col isolate items-center relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(16, 19, 26) 0%, rgb(16, 19, 26) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Create Report - Professional Dark Theme">
      <ContextualFormHeader />
      <MainCanvas />
    </div>
  );
}