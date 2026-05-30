import svgPaths from "./svg-4cw3jmfwr8";
import imgSystemAdministrator from "./0eaa054e4d1460477cef8d1f4484a3a4900ab059.png";
import imgChiefControllerProfile from "./9420e7d94fab65e47f817b34a2d2a5c72286cdcb.png";
import imgFloodDisaster from "./29b25b748125cb7259bcf974fb07992b480291cc.png";

function Heading() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[-1px]" data-name="Heading 1">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[39px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[32px] tracking-[-0.32px] w-[293.41px]">
        <p className="leading-[38.4px]">Community Report</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[46.39px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-[364.73px]">
        <p className="leading-[24px]">Data lapangan real-time dari warga sekitar Anda</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[70.39px] relative shrink-0 w-[364.73px]" data-name="Container">
      <Heading />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[12px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 12">
        <g id="Container">
          <path d={svgPaths.p2889b5c0} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] content-stretch flex gap-[8px] items-center px-[17px] py-[11px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Container3 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] text-center w-[37.86px]">
        <p className="leading-[24px]">Filter</p>
      </div>
    </div>
  );
}

function Container4() {
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

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[93.89px]">
        <p className="leading-[20px]">Create Report</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-gradient-to-r content-stretch flex from-[#0052cc] gap-[8px] items-center px-[24px] py-[16px] relative rounded-[9999px] shrink-0 to-[#0747a6]" data-name="Button">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.32px_0_0] rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <Container4 />
      <Container5 />
    </div>
  );
}

function FloatingActionButton() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Floating Action Button">
      <Button1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Button />
      <FloatingActionButton />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Header Section">
      <Container />
      <Container2 />
    </div>
  );
}

function SystemAdministrator() {
  return (
    <div className="flex-[1_0_0] h-full min-w-px relative" data-name="System Administrator">
      <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgSystemAdministrator} />
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#1d2027] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <SystemAdministrator />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(173,198,255,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[-1px]" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[23px] justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-white w-[154.19px]">
        <p className="leading-[22.5px]">Andi Wijaya</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[22.5px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[12px] w-[95.77px]">
        <p className="leading-[16px]">Pengguna</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[38.5px] relative shrink-0 w-[154.19px]" data-name="Container">
      <Heading1 />
      <Container9 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder />
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[9.333px] relative shrink-0 w-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 9.33333">
        <g id="Container">
          <path d={svgPaths.p30536580} fill="var(--fill-0, #FFDAD6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#93000a] content-stretch drop-shadow-[0px_0px_7.5px_rgba(255,180,171,0.3)] flex gap-[8px] items-center justify-center px-px py-[11px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,180,171,0.2)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Container10 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffdad6] text-[14px] text-center tracking-[0.14px] w-[149.84px]">
        <p className="leading-[19.6px]">Emergency Broadcast</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
        <Container7 />
        <Button2 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container11 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] tracking-[0.14px] w-[106.67px]">
            <p className="leading-[19.6px]">Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3539f080} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="bg-[rgba(37,99,235,0.2)] relative shrink-0 w-full" data-name="Link">
      <div aria-hidden="true" className="absolute border-[#3b82f6] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container12 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[14px] tracking-[0.14px] w-[113px]">
            <p className="leading-[19.6px]">Incident Reports</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[16.71%_8.33%_16.67%_8.31%]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.0064 15.9885">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p294cf430} fill="var(--fill-0, #94A3B8)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p2152e6c0} fill="var(--fill-0, #94A3B8)" fillRule="evenodd" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="healthicons:risk-analysis-24px">
        <Group />
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container13 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] tracking-[0.14px] w-[103px]">
            <p className="leading-[19.6px]">Risk Analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-[16px] pt-[17px] relative size-full">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container14 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] tracking-[0.14px] w-[54.64px]">
            <p className="leading-[19.6px]">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container15 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] tracking-[0.14px] w-[47.53px]">
            <p className="leading-[19.6px]">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-[16px] pt-[17px] px-[16px] relative size-full">
        <Link3 />
        <Link4 />
      </div>
    </div>
  );
}

function AsideSideNavBarWeb() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(2,6,23,0.8)] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px pt-[64px] top-0 w-[256px]" data-name="Aside - SideNavBar (Web)">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <div className="absolute bg-[rgba(255,255,255,0)] h-[1025px] left-0 shadow-[0px_25px_50px_-12px_rgba(30,58,138,0.2)] top-0 w-[256px]" data-name="Aside - SideNavBar (Web):shadow" />
      <Container6 />
      <Nav />
      <HorizontalBorder />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[20px] tracking-[-1px] w-[150.02px]">
        <p className="leading-[28px]">BanSos</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container17 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[14px] w-full">
          <p className="leading-[normal]">Search...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#272a31] relative rounded-[9999px] shrink-0 w-[256px]" data-name="Input">
      <div className="content-stretch flex items-start justify-center overflow-clip pb-[7px] pl-[41px] pr-[17px] pt-[6px] relative rounded-[inherit] size-full">
        <Container20 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute bottom-[10%] content-stretch flex flex-col items-start left-[12px] top-[10%]" data-name="Container">
      <div className="relative shrink-0 size-[18px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <path d={svgPaths.p8a35e00} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Input />
      <Container21 />
    </div>
  );
}

function Container22() {
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

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container22 />
    </div>
  );
}

function Container23() {
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

function Button4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container23 />
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

function Container18() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container19 />
        <Button3 />
        <Button4 />
        <ChiefControllerProfile />
      </div>
    </div>
  );
}

function TopNavBarWeb() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(2,6,23,0.6)] content-stretch drop-shadow-[0px_0px_7.5px_rgba(59,130,246,0.1)] flex h-[64px] items-center justify-between left-0 pb-px px-[24px] top-0 w-[1280px]" data-name="TopNavBar (Web)">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container16 />
      <Container18 />
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-[#ffb4ab] drop-shadow-[0px_0px_4px_rgba(255,180,171,0.5)] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Shadow">
      <div className="content-stretch flex flex-col items-start px-[10px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#690005] text-[10px] tracking-[1px] w-[39.63px]">
          <p className="leading-[15px]">KRITIS</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#32353c] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="content-stretch flex flex-col items-start px-[11px] py-[5px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[10px] tracking-[1px] w-[43.88px]">
          <p className="leading-[15px]">BANJIR</p>
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[25px] items-start left-0 top-0" data-name="Container">
      <BackgroundShadow />
      <BackgroundBorder1 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[25px] relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] left-[582.81px] not-italic text-[#64748b] text-[12px] top-[6.5px] w-[72.19px]">
        <p className="leading-[14.4px]">10 menit lalu</p>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white w-full">
        <p className="leading-[31.2px]">Banjir di Jl. Kemang Raya</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-full">
        <p className="leading-[26px]">Ketinggian air mencapai 80cm dan terus meningkat. Arus deras membuat kendaraan tidak dapat melintas. Akses menuju Prapanca terputus total.</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <Container28 />
    </div>
  );
}

function FloodDisaster() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Flood Disaster">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[159.25%] left-0 max-w-none top-[-29.62%] w-full" src={imgFloodDisaster} />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col h-[192px] items-start justify-center overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <FloodDisaster />
      <div className="absolute bg-gradient-to-t from-[rgba(2,6,23,0.8)] inset-0 to-[rgba(2,6,23,0)]" data-name="Gradient" />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[52.3px]">
        <p className="leading-[24px]">#banjir</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[95.06px]">
        <p className="leading-[24px]">#jalan-putus</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[163.58px]">
        <p className="leading-[24px]">#evakuasi-diperlukan</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container32 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667">
        <g id="Container">
          <path d={svgPaths.p3d8f00c0} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container35 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[16px] w-[274.34px]">
          <p className="leading-[24px]">Mampang Prapatan, Jakarta Selatan</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p3cf2be00} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(96,165,250,0.1)] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[4px] relative size-full">
        <Container36 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[99.63px]">
          <p className="leading-[24px]">12 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pt-[17px] relative size-full">
          <Container34 />
          <Overlay />
        </div>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[508px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <Container25 />
        <Container27 />
        <Container29 />
        <Container30 />
        <HorizontalBorder1 />
      </div>
    </div>
  );
}

function Card1Critical() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-1 h-[514px] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Card 1: Critical">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-[4px] pr-px py-px relative rounded-[inherit] size-full">
        <Container24 />
      </div>
      <div aria-hidden="true" className="absolute border-[#ffb4ab] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function BackgroundShadow1() {
  return (
    <div className="bg-[#eab308] drop-shadow-[0px_0px_4px_rgba(234,179,8,0.5)] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Shadow">
      <div className="content-stretch flex flex-col items-start px-[10px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#020617] text-[10px] tracking-[1px] w-[48.72px]">
          <p className="leading-[15px]">SEDANG</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#32353c] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="content-stretch flex flex-col items-start px-[11px] py-[5px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[10px] tracking-[1px] w-[110px]">
          <p className="leading-[15px]">POHON TUMBANG</p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[25px] items-start left-0 top-0" data-name="Container">
      <BackgroundShadow1 />
      <BackgroundBorder2 />
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[25px] relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] left-[602.52px] not-italic text-[#64748b] text-[12px] top-[6.5px] w-[52.48px]">
        <p className="leading-[14.4px]">1 jam lalu</p>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white w-full">
        <p className="leading-[31.2px]">Pohon Tumbang Menutup Jalan</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-full">
        <p className="leading-[26px] mb-0">Pohon beringin besar tumbang di depan RS Medika. Menutup 2 lajur jalan utama.</p>
        <p className="leading-[26px]">Sedang dalam penanganan petugas PPSU setempat.</p>
      </div>
    </div>
  );
}

function FloodDisaster1() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Flood Disaster">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[159.25%] left-0 max-w-none top-[-29.62%] w-full" src={imgFloodDisaster} />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col h-[192px] items-start justify-center overflow-clip relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <FloodDisaster1 />
      <div className="absolute bg-gradient-to-t from-[rgba(2,6,23,0.8)] inset-0 to-[rgba(2,6,23,0)]" data-name="Gradient" />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container41 />
      <Container42 />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[137px]">
        <p className="leading-[24px]">#lalulintas-macet</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[112.81px]">
        <p className="leading-[24px]">#cuaca-buruk</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667">
        <g id="Container">
          <path d={svgPaths.p3d8f00c0} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container47 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[16px] w-[205.28px]">
          <p className="leading-[24px]">Kebon Jeruk, Jakarta Barat</p>
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p3cf2be00} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(96,165,250,0.1)] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.99px] items-center px-[12px] py-[4px] relative size-full">
        <Container48 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[103.19px]">
          <p className="leading-[24px]">45 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <Container46 />
      <Overlay1 />
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <Container38 />
        <Container40 />
        <Container43 />
        <HorizontalBorder2 />
      </div>
    </div>
  );
}

function Card2Warning() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Card 2: Warning">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-[4px] pr-px py-px relative rounded-[inherit] size-full">
        <Container37 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eab308] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function BackgroundShadow2() {
  return (
    <div className="bg-[#eab308] drop-shadow-[0px_0px_4px_rgba(234,179,8,0.5)] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Shadow">
      <div className="content-stretch flex flex-col items-start px-[10px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#020617] text-[10px] tracking-[1px] w-[48.72px]">
          <p className="leading-[15px]">SEDANG</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#32353c] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="content-stretch flex flex-col items-start px-[11px] py-[5px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[10px] tracking-[1px] w-[99.48px]">
          <p className="leading-[15px]">INFRASTRUKTUR</p>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[25px] items-start left-0 top-0" data-name="Container">
      <BackgroundShadow2 />
      <BackgroundBorder3 />
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[25px] relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] left-[602.52px] not-italic text-[#64748b] text-[12px] top-[6.5px] w-[52.48px]">
        <p className="leading-[14.4px]">1 jam lalu</p>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white w-full">
        <p className="leading-[31.2px]">Tiang Listrik Miring Berbahaya</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-full">
        <p className="leading-[26px] mb-0">Satu tiang listrik di pemukiman warga miring akibat tanah amblas pasca hujan</p>
        <p className="leading-[26px]">semalam. Kabel menjuntai rendah ke arah jalan warga.</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container53 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[116.05px]">
        <p className="leading-[24px]">#perbaikan-pln</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[112.81px]">
        <p className="leading-[24px]">#bahaya-listrik</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container58() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667">
        <g id="Container">
          <path d={svgPaths.p3d8f00c0} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container58 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[16px] w-[171.06px]">
          <p className="leading-[24px]">Ciracas, Jakarta Timur</p>
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p3cf2be00} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(96,165,250,0.1)] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[5.99px] items-center px-[12px] py-[4px] relative size-full">
        <Container59 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[93.27px]">
          <p className="leading-[24px]">8 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder3() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <Container57 />
      <Overlay2 />
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <Container50 />
        <Container52 />
        <Container54 />
        <HorizontalBorder3 />
      </div>
    </div>
  );
}

function Card3Moderate() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-1 justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Card 3: Moderate">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-[4px] pr-px py-px relative rounded-[inherit] size-full">
        <Container49 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eab308] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function BackgroundShadow3() {
  return (
    <div className="bg-[#d3e4fe] drop-shadow-[0px_0px_4px_rgba(211,228,254,0.5)] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Shadow">
      <div className="content-stretch flex flex-col items-start px-[10px] py-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[10px] tracking-[1px] w-[48.7px]">
          <p className="leading-[15px]">RENDAH</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#32353c] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="content-stretch flex flex-col items-start px-[11px] py-[5px] relative size-full">
        <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[10px] tracking-[1px] w-[67.81px]">
          <p className="leading-[15px]">GENANGAN</p>
        </div>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[25px] items-start left-0 top-0" data-name="Container">
      <BackgroundShadow3 />
      <BackgroundBorder4 />
    </div>
  );
}

function Container61() {
  return (
    <div className="h-[25px] relative shrink-0 w-full" data-name="Container">
      <Container62 />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] left-[600.11px] not-italic text-[#64748b] text-[12px] top-[6.5px] w-[54.89px]">
        <p className="leading-[14.4px]">2 jam lalu</p>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-white w-full">
        <p className="leading-[31.2px]">Genangan Air Pasca Hujan</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-full">
        <p className="leading-[26px] mb-0">Genangan air setinggi mata kaki (10-15cm) di sekitar TPU Jeruk Purut. Masih bisa</p>
        <p className="leading-[26px]">dilewati kendaraan roda 2 dan roda 4.</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading5 />
      <Container64 />
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[85.42px]">
        <p className="leading-[24px]">#genangan</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[133.95px]">
        <p className="leading-[24px]">#pantauan-cuaca</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Container66 />
      <Container67 />
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[11.667px] relative shrink-0 w-[9.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 11.6667">
        <g id="Container">
          <path d={svgPaths.p3d8f00c0} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container68() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container69 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[16px] w-[191.7px]">
          <p className="leading-[24px]">Cilandak, Jakarta Selatan</p>
        </div>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p3cf2be00} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(96,165,250,0.1)] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[4px] relative size-full">
        <Container70 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[16px] w-[93.25px]">
          <p className="leading-[24px]">3 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder4() {
  return (
    <div className="content-stretch flex items-center justify-between pt-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <Container68 />
      <Overlay3 />
    </div>
  );
}

function Container60() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start p-[24px] relative size-full">
        <Container61 />
        <Container63 />
        <Container65 />
        <HorizontalBorder4 />
      </div>
    </div>
  );
}

function Card4Low() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-2 justify-self-stretch relative rounded-[12px] row-2 self-start shrink-0" data-name="Card 4: Low">
      <div className="content-stretch flex flex-col items-start overflow-clip pl-[4px] pr-px py-px relative rounded-[inherit] size-full">
        <Container60 />
      </div>
      <div aria-hidden="true" className="absolute border-[#d3e4fe] border-b border-l-4 border-r border-solid border-t inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function ReportsGrid() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[__495.19px_287.19px] h-[522px] pb-[16px] pt-[8px] relative shrink-0 w-[976px]" data-name="Reports Grid">
      <Card1Critical />
      <Card2Warning />
      <Card3Moderate />
      <Card4Low />
    </div>
  );
}

export default function IncidentReportsProfessionalDarkTheme() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[295.67px] pl-[280px] pr-[24px] pt-[64px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(16, 19, 26) 0%, rgb(16, 19, 26) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Incident Reports - Professional Dark Theme">
      <HeaderSection />
      <AsideSideNavBarWeb />
      <TopNavBarWeb />
      <ReportsGrid />
    </div>
  );
}