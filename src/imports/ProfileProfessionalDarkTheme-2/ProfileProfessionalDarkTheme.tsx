import svgPaths from "./svg-8u0eey2vln";
import imgSystemAdministrator from "./0eaa054e4d1460477cef8d1f4484a3a4900ab059.png";
import imgChiefControllerProfile from "./9420e7d94fab65e47f817b34a2d2a5c72286cdcb.png";
import imgProfilePicture from "./05bf566309a931f21d624caab9298ae2c690b994.png";
import imgMapView from "./95a1e6ef9cc5afd696639f1af1a49888c9223daf.png";

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

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[22.5px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[12px] w-[95.77px]">
        <p className="leading-[16px]">Pengguna</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[38.5px] relative shrink-0 w-[154.19px]" data-name="Container">
      <Heading1 />
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder />
      <Container2 />
    </div>
  );
}

function Container4() {
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

function Button() {
  return (
    <div className="bg-[#93000a] content-stretch drop-shadow-[0px_0px_7.5px_rgba(255,180,171,0.3)] flex gap-[8px] items-center justify-center px-px py-[11px] relative rounded-[6px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,180,171,0.2)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Container4 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffdad6] text-[14px] text-center tracking-[0.14px] w-[149.84px]">
        <p className="leading-[19.6px]">Emergency Broadcast</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
        <Container1 />
        <Button />
      </div>
    </div>
  );
}

function Container5() {
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
          <Container5 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] tracking-[0.14px] w-[106.67px]">
            <p className="leading-[19.6px]">Mission Control</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.pa053f40} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function LinkInactiveTabs() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link - Inactive Tabs">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container6 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-[83.75px]">
            <p className="leading-[20px]">Risk Reports</p>
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

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="healthicons:risk-analysis-24px">
        <Group />
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container7 />
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-[16px] pt-[17px] px-[8px] relative size-full">
        <Link />
        <LinkInactiveTabs />
        <Link1 />
      </div>
    </div>
  );
}

function Container8() {
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

function Link2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container8 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-[53.66px]">
            <p className="leading-[20px]">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container9() {
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

function Link3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container9 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-[46.7px]">
            <p className="leading-[20px]">Logout</p>
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
        <Link2 />
        <Link3 />
      </div>
    </div>
  );
}

function AsideJsonComponentSideNavBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(2,6,23,0.8)] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px pt-[64px] top-0 w-[256px]" data-name="Aside - JSON Component: SideNavBar">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <div className="absolute bg-[rgba(255,255,255,0)] h-[853px] left-0 shadow-[0px_25px_50px_-12px_rgba(30,58,138,0.2)] top-0 w-[256px]" data-name="Aside - JSON Component: SideNavBar:shadow" />
      <Container />
      <Nav />
      <HorizontalBorder />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[20px] tracking-[-1px] w-[150.02px]">
        <p className="leading-[28px]">BanSos</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Container14() {
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
        <Container14 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container15() {
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

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Input />
      <Container15 />
    </div>
  );
}

function Container16() {
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

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container16 />
    </div>
  );
}

function Container17() {
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

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center p-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <Container17 />
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

function Container12() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container13 />
        <Button1 />
        <Button2 />
        <ChiefControllerProfile />
      </div>
    </div>
  );
}

function TopNavBarWeb() {
  return (
    <div className="absolute backdrop-blur-[6px] bg-[rgba(2,6,23,0.6)] content-stretch drop-shadow-[0px_0px_7.5px_rgba(59,130,246,0.1)] flex h-[64px] items-center justify-between left-0 pb-px px-[24px] top-0 w-[1280px]" data-name="TopNavBar (Web)">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <Container10 />
      <Container12 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[12px] tracking-[0.6px] uppercase w-[104.66px]">
        <p className="leading-[16px]">TOTAL REPORTS</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#003d9b] text-[24px] w-[26.14px]">
        <p className="leading-[32px]">14</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[104.66px]" data-name="Container">
      <Container20 />
      <Container21 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[30px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="Container">
          <path d={svgPaths.p18b91560} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container19 />
        <Container22 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[14.167px] relative shrink-0 w-[16.542px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5417 14.1667">
        <g id="Container">
          <path d={svgPaths.pcbde380} fill="var(--fill-0, #191B23)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[#e1e2ec] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[10px] relative size-full">
          <Container23 />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[14px] text-center w-[116.27px]">
            <p className="leading-[20px]">Account Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsActionsCard() {
  return (
    <div className="bg-[#191b23] col-3 drop-shadow-[0px_4px_6px_rgba(9,30,66,0.08)] justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Stats/Actions Card">
      <div aria-hidden="true" className="absolute border border-[#e1e2ec] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center p-[25px] relative size-full">
          <Container18 />
          <div className="bg-[#e1e2ec] h-px shrink-0 w-full" data-name="Horizontal Divider" />
          <Button3 />
        </div>
      </div>
    </div>
  );
}

function ProfilePicture() {
  return (
    <div className="pointer-events-none relative rounded-[9999px] shrink-0 size-[96px]" data-name="Profile Picture">
      <div className="absolute inset-0 overflow-hidden rounded-[9999px]">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgProfilePicture} />
      </div>
      <div aria-hidden="true" className="absolute border-4 border-solid border-white inset-0 rounded-[9999px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p10054d00} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex flex-col items-center justify-center p-[7px] right-0 rounded-[9999px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e1e2ec] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_-0.5px_-0.5px_0] rounded-[9999px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
      <Container25 />
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <ProfilePicture />
        <Button4 />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[32px] tracking-[-0.32px] w-full">
        <p className="leading-[40px]">Alex Mercer</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-full">
        <p className="leading-[24px]">alex.mercer@example.com</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[12.25px] relative shrink-0 w-[12.833px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.25">
        <g id="Container">
          <path d={svgPaths.p26f9d500} fill="var(--fill-0, #00734C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(130,249,190,0.2)] relative rounded-[9999px] self-stretch shrink-0" data-name="Overlay">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[4px] items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <Container29 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#00734c] text-[12px] w-[110.06px]">
            <p className="leading-[16px]">Verified Responder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e7e7f2] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black w-[72.13px]">
            <p className="leading-[16px]">Joined 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[8px] h-[32px] items-start pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Overlay />
      <Background />
    </div>
  );
}

function Container26() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function UserInfoCard() {
  return (
    <div className="bg-[#191b23] col-[1/span_2] h-[171px] justify-self-stretch relative rounded-[12px] row-1 shrink-0" data-name="User Info Card">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[24px] items-center p-[25px] relative size-full">
          <div className="absolute bg-gradient-to-r from-[rgba(0,82,204,0.1)] inset-[1px_1.34px_1px_1px] to-[rgba(0,82,204,0)]" data-name="Gradient" />
          <Container24 />
          <Container26 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e2ec] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_12px_0px_rgba(9,30,66,0.08)]" />
    </div>
  );
}

function ProfileHeaderBento() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_171px] relative shrink-0 w-full" data-name="Profile Header Bento">
      <StatsActionsCard />
      <UserInfoCard />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[24px] w-[191.28px]">
        <p className="leading-[32px]">Saved Locations</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-[402.17px]">
        <p className="leading-[24px]">Manage areas you are currently monitoring for alerts.</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[402.17px]" data-name="Container">
      <Heading2 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 size-[11.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
        <g id="Container">
          <path d={svgPaths.p20803d40} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-[#003d9b] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[8px] items-center px-[16px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
      <Container33 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white w-[89.45px]">
        <p className="leading-[20px]">Add Location</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Button5 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start px-[4px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[12px] w-[30.45px]">
        <p className="leading-[16px]">Clear</p>
      </div>
    </div>
  );
}

function OverlayShadowOverlayBlur() {
  return (
    <div className="absolute backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center p-[6px] right-[12.68px] rounded-[9999px] top-[12px]" data-name="Overlay+Shadow+OverlayBlur">
      <div className="bg-[#006c47] rounded-[9999px] shrink-0 size-[10px]" data-name="Background" />
      <Container35 />
    </div>
  );
}

function MapView() {
  return (
    <div className="h-[128px] opacity-80 relative shrink-0 w-full z-[2]" data-name="Map View">
      <div aria-hidden="true" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 pointer-events-none">
        <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden">
          <img alt="" className="absolute h-[306.77%] left-0 max-w-none top-[-103.39%] w-full" src={imgMapView} />
        </div>
        <div className="absolute bg-clip-padding bg-white border-0 border-[transparent] border-solid inset-0 mix-blend-saturation" />
      </div>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <OverlayShadowOverlayBlur />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[13.5px] relative shrink-0 w-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 13.5">
        <g id="Container">
          <path d={svgPaths.p1db01d20} fill="var(--fill-0, #003D9B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0" data-name="Heading 3">
      <Container38 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] w-[127.13px]">
        <p className="leading-[20px]">Primary Residence</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container39 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Button6 />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] w-full">
        <p className="leading-[20px]">Jl. Sudirman No. 45, Jakarta Selatan</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[#ededf8] content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px py-[6px] relative rounded-[6px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[12px] text-center w-[63.63px]">
        <p className="leading-[16px]">Edit Radius</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[#ededf8] content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px py-[6px] relative rounded-[6px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[12px] text-center w-[56.72px]">
        <p className="leading-[16px]">View Map</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Button7 />
      <Button8 />
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start p-[16px] relative size-full">
        <Container37 />
        <Container40 />
        <Container41 />
      </div>
    </div>
  );
}

function LocationCard() {
  return (
    <div className="bg-[#191b23] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Location Card 1">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <MapView />
        <Container36 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e2ec] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_12px_0px_rgba(9,30,66,0.08)]" />
    </div>
  );
}

function MapView1() {
  return (
    <div className="flex-[1_0_0] min-h-px opacity-80 relative w-full" data-name="Map View">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute h-[306.77%] left-0 max-w-none top-[-103.39%] w-full" src={imgMapView} />
        </div>
        <div className="absolute bg-white inset-0 mix-blend-saturation" />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start px-[4px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[12px] w-[27.52px]">
        <p className="leading-[16px]">Alert</p>
      </div>
    </div>
  );
}

function OverlayShadowOverlayBlur1() {
  return (
    <div className="absolute backdrop-blur-[4px] bg-[rgba(255,255,255,0.9)] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[4px] items-center p-[6px] right-[12.66px] rounded-[9999px] top-[12px]" data-name="Overlay+Shadow+OverlayBlur">
      <div className="bg-[#ba1a1a] rounded-[9999px] shrink-0 size-[10px]" data-name="Background" />
      <Container42 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e2e8f0] h-[128px] relative shrink-0 w-full z-[2]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <MapView1 />
        <OverlayShadowOverlayBlur1 />
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="h-[14.25px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 14.25">
        <g id="Container">
          <path d={svgPaths.p56f7860} fill="var(--fill-0, #003D9B)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-[228px]" data-name="Heading 3">
      <Container45 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] w-[98px]">
        <p className="leading-[20px]">Office District</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="h-[15px] relative shrink-0 w-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 15">
        <g id="Container">
          <path d={svgPaths.pd83d200} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <Container46 />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Button9 />
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] w-full">
        <p className="leading-[20px]">SCBD Tower 2, Jakarta Selatan</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#ededf8] content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px py-[6px] relative rounded-[6px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[12px] text-center w-[63.63px]">
        <p className="leading-[16px]">Edit Radius</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="bg-[#ededf8] content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px py-[6px] relative rounded-[6px]" data-name="Button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#191b23] text-[12px] text-center w-[56.72px]">
        <p className="leading-[16px]">View Map</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-center pt-[8px] relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 w-full z-[1]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start p-[16px] relative size-full">
        <Container44 />
        <Container47 />
        <Container48 />
      </div>
    </div>
  );
}

function LocationCard1() {
  return (
    <div className="bg-[#191b23] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Location Card 2">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Background1 />
        <Container43 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e1e2ec] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_4px_12px_0px_rgba(9,30,66,0.08)]" />
    </div>
  );
}

function Container49() {
  return (
    <div className="h-[44px] relative shrink-0 w-[38px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 38 44">
        <g id="Container" opacity="0.5">
          <path d={svgPaths.p37ad9920} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <Container49 />
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] text-center w-[123.42px]">
          <p className="leading-[20px]">Add New Location</p>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-center opacity-70 relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] text-center w-[127.19px]">
        <p className="leading-[20px]">Monitor a new area</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <Container51 />
      </div>
    </div>
  );
}

function ButtonAddNewLocationCard() {
  return (
    <div className="bg-[#191b23] col-3 justify-self-stretch min-h-[220px] relative rounded-[12px] row-1 self-start shrink-0" data-name="Button - Add New Location Card">
      <div aria-hidden="true" className="absolute border-2 border-[#c3c6d6] border-dashed inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-col items-center justify-center min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center min-h-[inherit] pl-[133.73px] pr-[133.74px] py-[77px] relative size-full">
          <Margin />
          <Container50 />
          <Margin1 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[_254px] relative shrink-0 w-full" data-name="Container">
      <LocationCard />
      <LocationCard1 />
      <ButtonAddNewLocationCard />
    </div>
  );
}

function SavedLocationsSection() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Saved Locations Section">
      <Container30 />
      <Container34 />
    </div>
  );
}

function Container53() {
  return (
    <div className="h-[20.05px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20.05">
        <g id="Container">
          <path d={svgPaths.p3f50100} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#272a31] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <Container53 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[183.03px]">
        <p className="leading-[24px]">Notification Preferences</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[12px] w-[258.63px]">
        <p className="leading-[16px]">Manage critical alert channels and frequency.</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[258.63px]" data-name="Container">
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Container">
      <Background2 />
      <Container54 />
    </div>
  );
}

function Container57() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Preference() {
  return (
    <div className="relative shrink-0 w-full" data-name="Preference 1">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between p-[24px] relative size-full">
          <Container52 />
          <Container57 />
        </div>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p2bdb86e0} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#272a31] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <Container59 />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[138.09px]">
        <p className="leading-[24px]">{`Privacy & Security`}</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[12px] w-[264.58px]">
        <p className="leading-[16px]">Two-factor authentication and biometric locks.</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[264.58px]" data-name="Container">
      <Container61 />
      <Container62 />
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Background3 />
        <Container60 />
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Preference1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Preference 2">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[24px] pt-[25px] px-[24px] relative size-full">
          <Container58 />
          <Container63 />
        </div>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p254c2600} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#272a31] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <Container65 />
    </div>
  );
}

function Container67() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[138.38px]">
        <p className="leading-[24px]">Data Management</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[12px] w-[239.83px]">
        <p className="leading-[16px]">Clear local cache and export mission logs.</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[239.83px]" data-name="Container">
      <Container67 />
      <Container68 />
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Background4 />
        <Container66 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="h-[12px] relative shrink-0 w-[7.4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.4 12">
        <g id="Container">
          <path d={svgPaths.p28c84800} fill="var(--fill-0, #8C909F)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Preference2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Preference 3">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[24px] pt-[25px] px-[24px] relative size-full">
          <Container64 />
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] h-[267px] relative rounded-[12px] shrink-0 w-[912px]" data-name="Overlay+Border+OverlayBlur">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Preference />
        <Preference1 />
        <Preference2 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function MainContent() {
  return (
    <div className="h-[928px] max-w-[1280px] relative shrink-0 w-full" data-name="Main Content">
      <div className="max-w-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[inherit] p-[32px] relative size-full">
          <ProfileHeaderBento />
          <SavedLocationsSection />
          <OverlayBorderOverlayBlur />
        </div>
      </div>
    </div>
  );
}

export default function ProfileProfessionalDarkTheme() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[213.05px] pl-[272px] pr-[32px] pt-[96px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(16, 19, 26) 0%, rgb(16, 19, 26) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Profile - Professional Dark Theme">
      <AsideJsonComponentSideNavBar />
      <TopNavBarWeb />
      <MainContent />
    </div>
  );
}