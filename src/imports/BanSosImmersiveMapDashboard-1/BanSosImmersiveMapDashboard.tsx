import svgPaths from "./svg-vbk34iy8ac";
import imgChiefControllerProfile from "./9420e7d94fab65e47f817b34a2d2a5c72286cdcb.png";
import imgMapOfJakarta from "./6381474e48bd1c7e4e5742aae915a673738499ac.png";
import imgFloodedStreet from "./eceb2ccdba1950d9889fd09510cc1f0d660cdce5.png";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[20px] tracking-[-1px] w-[150.02px]">
        <p className="leading-[28px]">BanSos</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[20.1px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1 20">
        <g id="Container">
          <path d={svgPaths.p3cdadd00} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container4 />
    </div>
  );
}

function ChiefControllerProfile() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[32px]" data-name="Chief Controller Profile">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgChiefControllerProfile} />
      </div>
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 rounded-[9999px]" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Button />
      <Button1 />
      <ChiefControllerProfile />
    </div>
  );
}

function TopNavBar() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-0 px-[32px] py-[16px] right-0 top-[36px] z-[3]" data-name="TopNavBar">
      <Container />
      <Container2 />
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[15.833px] relative shrink-0 w-[26.333px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.3333 15.8333">
        <g id="Margin">
          <path d={svgPaths.p1de06280} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[245.14px]">
        <p className="leading-[20px]">High flood risk detected in your area</p>
      </div>
    </div>
  );
}

function HighRiskAlertBanner() {
  return (
    <div className="bg-gradient-to-r from-[rgba(186,26,26,0.95)] relative shrink-0 to-[rgba(147,0,10,0.95)] w-full z-[2]" data-name="High-Risk Alert Banner">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[24px] py-[8px] relative size-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]" data-name="High-Risk Alert Banner:shadow" />
          <Margin />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function MapOfJakarta() {
  return (
    <div className="flex-[1_0_0] min-h-px mix-blend-luminosity opacity-80 relative w-full" data-name="Map of Jakarta">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[129.55%] left-0 max-w-none top-[-14.78%] w-full" src={imgMapOfJakarta} />
      </div>
    </div>
  );
}

function HighRiskRed() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[614.39px] size-[12px] top-[444.59px]" data-name="High Risk (Red)">
      <div className="bg-[#ba1a1a] rounded-[9999px] shadow-[0px_0px_16px_0px_#ba1a1a] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[576px] size-[12px] top-[375.44px]" data-name="Container">
      <div className="bg-[#ba1a1a] rounded-[9999px] shadow-[0px_0px_16px_0px_#ba1a1a] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[704px] size-[12px] top-[513.75px]" data-name="Container">
      <div className="bg-[#ba1a1a] rounded-[9999px] shadow-[0px_0px_16px_0px_#ba1a1a] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function MediumRiskOrange() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[704px] size-[12px] top-[296.39px]" data-name="Medium Risk (Orange)">
      <div className="bg-[#ffb59b] rounded-[9999px] shadow-[0px_0px_16px_0px_rgba(255,181,155,0.8)] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[537.59px] size-[12px] top-[592.8px]" data-name="Container">
      <div className="bg-[#ffb59b] rounded-[9999px] shadow-[0px_0px_16px_0px_rgba(255,181,155,0.8)] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function LowRiskBlue() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[384px] size-[12px] top-[247px]" data-name="Low Risk (Blue)">
      <div className="bg-[#4ade80] rounded-[9999px] shadow-[0px_0px_16px_0px_rgba(74,222,128,0.8)] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[832px] size-[12px] top-[691.59px]" data-name="Container">
      <div className="bg-[#4ade80] rounded-[9999px] shadow-[0px_0px_16px_0px_rgba(74,222,128,0.8)] shrink-0 size-[12px]" data-name="Background+Shadow" />
    </div>
  );
}

function InteractiveMapBackground() {
  return (
    <div className="absolute bg-[#e7e7f2] content-stretch flex flex-col inset-0 items-start justify-center" data-name="Interactive Map Background">
      <MapOfJakarta />
      <div className="absolute bg-gradient-to-b from-[rgba(25,27,35,0.8)] inset-0 mix-blend-multiply to-[rgba(25,27,35,0.6)]" data-name="Gradient" />
      <HighRiskRed />
      <Container6 />
      <Container7 />
      <MediumRiskOrange />
      <Container8 />
      <LowRiskBlue />
      <Container9 />
    </div>
  );
}

function Container10() {
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

function Container11() {
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
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] content-stretch drop-shadow-[0px_8px_16px_rgba(0,0,0,0.3)] flex gap-[8px] items-center px-[17px] py-[9px] relative rounded-[9999px] shrink-0" data-name="Floating Back Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, white)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.5)] w-full">
        <p className="leading-[normal]">Search area...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip py-[2px] relative rounded-[inherit] size-full">
        <Container13 />
      </div>
    </div>
  );
}

function FloatingSearchBar() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.3)] relative rounded-[9999px] shrink-0 w-full" data-name="Floating Search Bar">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[17px] py-[13px] relative size-full">
          <Container12 />
          <Input />
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white w-[143.72px]">
        <p className="leading-[32px]">Map Control</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[7.4px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 7.4">
        <g id="Container">
          <path d={svgPaths.p7e19680} fill="var(--fill-0, white)" fillOpacity="0.7" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container15 />
        <Container16 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p2bdb86e0} fill="var(--fill-0, #B2C5FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[82.78px]">
        <p className="leading-[24px]">Risk Zones</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p1d9bcc00} fill="var(--fill-0, #B2C5FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin2() {
  return (
    <div className="flex-[1_0_0] min-w-[14.020000457763672px] relative" data-name="Margin">
      <div className="flex flex-col items-end min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end min-w-[inherit] pl-[125.188px] relative size-full">
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container20 />
      <Margin2 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[16px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
        <g id="Container">
          <path d={svgPaths.p12092b00} fill="var(--fill-0, #B2C5FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[110.38px]">
        <p className="leading-[24px]">Active Reports</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p1d9bcc00} fill="var(--fill-0, #B2C5FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin3() {
  return (
    <div className="flex-[1_0_0] min-w-[14.020000457763672px] relative" data-name="Margin">
      <div className="flex flex-col items-end min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end min-w-[inherit] pl-[97.594px] relative size-full">
          <Container25 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Container23 />
      <Container24 />
      <Margin3 />
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p8fed400} fill="var(--fill-0, white)" fillOpacity="0.4" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.6)] w-[106.23px]">
        <p className="leading-[24px]">Relief Centers</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p24dc5920} fill="var(--fill-0, white)" fillOpacity="0.2" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin4() {
  return (
    <div className="flex-[1_0_0] min-w-[14.020000457763672px] relative" data-name="Margin">
      <div className="flex flex-col items-end min-w-[inherit] size-full">
        <div className="content-stretch flex flex-col items-end min-w-[inherit] pl-[101.734px] relative size-full">
          <Container29 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Container28 />
      <Margin4 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container22 />
      <Container26 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container17 />
      </div>
    </div>
  );
}

function LeftFloatingPanelControls() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] drop-shadow-[0px_8px_16px_rgba(0,0,0,0.3)] relative rounded-[20px] shrink-0 w-full" data-name="Left Floating Panel: Controls">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <Container14 />
        <Margin1 />
      </div>
    </div>
  );
}

function LeftColumnSummaryFilters() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-[320px]" data-name="Left Column: Summary & Filters">
      <FloatingBackButton />
      <FloatingSearchBar />
      <LeftFloatingPanelControls />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[105.94px]">
        <p className="leading-[20px]">Nearby Reports</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#dae2ff] text-[12px] text-center w-[46.09px]">
        <p className="leading-[16px]">View All</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[8px] relative size-full">
          <Heading />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[8px] relative shrink-0 w-full" data-name="Margin">
      <Container30 />
    </div>
  );
}

function FloodedStreet() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Flooded street">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgFloodedStreet} />
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e1e2ec] relative rounded-[8px] shrink-0 size-[64px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <FloodedStreet />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[132.05px]">
        <p className="leading-[20px]">Jalan Kemang Raya</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ffdad6] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#93000a] text-[10px] tracking-[0.25px] w-[48.5px]">
        <p className="leading-[15px]">CRITICAL</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Background1 />
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container33 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434654] text-[12px] w-full">
        <p className="leading-[16px] mb-0">Water level reached 50cm. Impassable</p>
        <p className="leading-[16px]">for light vehicles.</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#737685] text-[12px] w-full">
        <p className="leading-[16px]">10 mins ago</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="flex-[1_0_0] min-w-px relative self-stretch" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between relative size-full">
        <Margin6 />
        <Container34 />
        <Container35 />
      </div>
    </div>
  );
}

function ReportCard() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] relative rounded-[16px] shrink-0 w-full" data-name="Report Card 1">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-start p-[17px] relative size-full">
          <Background />
          <Container32 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.3)]" />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p27589980} fill="var(--fill-0, #737685)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#e1e2ec] relative rounded-[8px] shrink-0 size-[64px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <Container36 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-[115.2px]">
        <p className="leading-[20px]">River Bank South</p>
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(163,53,0,0.2)] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#7b2600] text-[10px] tracking-[0.25px] w-[51px]">
        <p className="leading-[15px]">WARNING</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Overlay />
    </div>
  );
}

function Margin7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[4px] relative shrink-0 w-full" data-name="Margin">
      <Container38 />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434654] text-[12px] w-full">
        <p className="leading-[16px] mb-0">River rising rapidly. Debris blocking</p>
        <p className="leading-[16px]">drainage.</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#737685] text-[12px] w-full">
        <p className="leading-[16px]">32 mins ago</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="flex-[1_0_0] min-w-px relative self-stretch" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between relative size-full">
        <Margin7 />
        <Container39 />
        <Container40 />
      </div>
    </div>
  );
}

function ReportCard1() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] relative rounded-[16px] shrink-0 w-full" data-name="Report Card 2">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-start p-[17px] relative size-full">
          <Background2 />
          <Container37 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.3)]" />
    </div>
  );
}

function Container31() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start pb-[24px] pr-[8px] relative size-full">
          <ReportCard />
          <ReportCard1 />
        </div>
      </div>
    </div>
  );
}

function RightColumnReportsList() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[884px] items-start relative shrink-0 w-[360px]" data-name="Right Column: Reports List">
      <Margin5 />
      <Container31 />
    </div>
  );
}

function FloatingUiLayer() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-between pb-[24px] pt-[80px] px-[24px]" data-name="Floating UI Layer">
      <LeftColumnSummaryFilters />
      <RightColumnReportsList />
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white w-full">
        <p className="leading-[20px]">Risk Levels</p>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[4px] relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.9)] w-[53.8px]">
        <p className="leading-[16px]">High Risk</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="bg-[#ba1a1a] rounded-[9999px] shadow-[0px_0px_8px_0px_rgba(186,26,26,0.8)] shrink-0 size-[12px]" data-name="Background+Shadow" />
        <Container43 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.9)] w-[55.09px]">
        <p className="leading-[16px]">Moderate</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="bg-[#ffb59b] rounded-[9999px] shadow-[0px_0px_8px_0px_rgba(255,181,155,0.6)] shrink-0 size-[12px]" data-name="Background+Shadow" />
        <Container45 />
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.9)] w-[95.22px]">
        <p className="leading-[16px]">Monitored / Safe</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <div className="bg-[#4ade80] rounded-[9999px] shadow-[0px_0px_8px_0px_rgba(74,222,128,0.6)] shrink-0 size-[12px]" data-name="Background+Shadow" />
        <Container47 />
      </div>
    </div>
  );
}

function OverlayBorderShadowOverlayBlur() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(15,23,42,0.4)] content-stretch drop-shadow-[0px_8px_16px_rgba(0,0,0,0.3)] flex flex-col gap-[12px] items-start p-[17px] relative rounded-[16px] shrink-0 w-[153.22px]" data-name="Overlay+Border+Shadow+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <Margin8 />
      <Container42 />
      <Container44 />
      <Container46 />
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-[24px] content-stretch flex flex-col items-start left-[24px]" data-name="Map Legend">
      <OverlayBorderShadowOverlayBlur />
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 size-[15.7px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.7 15.7">
        <g id="Container">
          <path d={svgPaths.p2c9f8e00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[93.89px]">
        <p className="leading-[20px]">Create Report</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#0052cc] gap-[8px] items-center px-[24px] py-[16px] relative rounded-[9999px] shrink-0 to-[#0747a6]" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.32px_0_0] rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <Container48 />
      <Container49 />
    </div>
  );
}

function FloatingActionButton() {
  return (
    <div className="absolute bottom-[24px] content-stretch flex flex-col items-start right-[24px]" data-name="Floating Action Button">
      <Button3 />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full z-[1]" data-name="Main Content Area">
      <InteractiveMapBackground />
      <FloatingUiLayer />
      <MapLegend />
      <FloatingActionButton />
    </div>
  );
}

export default function BanSosImmersiveMapDashboard() {
  return (
    <div className="content-stretch flex flex-col isolate items-start relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(250, 248, 255) 0%, rgb(250, 248, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="BanSos - Immersive Map Dashboard">
      <TopNavBar />
      <HighRiskAlertBanner />
      <MainContentArea />
    </div>
  );
}