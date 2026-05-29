import svgPaths from "./svg-nv6rjx3zik";
import imgMapOfJakarta from "./16b52abd60bf5a43df87f2e7caea1c96bd7785ce.png";
import imgSystemAdministrator from "./0eaa054e4d1460477cef8d1f4484a3a4900ab059.png";
import imgChiefControllerProfile from "./9420e7d94fab65e47f817b34a2d2a5c72286cdcb.png";

function Heading() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[-1px]" data-name="Heading 1">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[39px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[32px] tracking-[-0.32px] w-[278.05px]">
        <p className="leading-[38.4px]">Dashboard</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-0 right-0 top-[42.39px]" data-name="Container">
      <div className="bg-[#adc6ff] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-[431px]">
        <p className="leading-[24px]">Kemang, Jakarta Selatan · Pemantauan Aktif · 14:42 WIB</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[66.39px] relative shrink-0 w-[278.05px]" data-name="Container">
      <Heading />
      <Container1 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-0 right-0 top-[-1px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[12px] text-right tracking-[0.6px] uppercase w-[89.56px]">
        <p className="leading-[14.4px]">SYSTEM TIME</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col items-end left-0 right-0 top-[14.39px]" data-name="Container">
      <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[29px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[18px] text-right w-[129.63px]">
        <p className="leading-[28.8px]">14:42:09 UTC</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[43.19px] relative shrink-0 w-[129.63px]" data-name="Container">
      <Container3 />
      <Container4 />
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

function Container6() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p3f976180} fill="var(--fill-0, #FFB4AB)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,180,171,0.2)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[40px]" data-name="Overlay">
      <Container6 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffb4ab] text-[24px] w-[289.63px]">
        <p className="leading-[31.2px]">{`RISIKO TINGGI: `}</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffdad6] text-[16px] w-[611.72px]">
        <p className="leading-[24px]">{`Potensi banjir di area Kemang dalam 6 jam ke depan berdasarkan data BMKG & ML model.`}</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[611.72px]" data-name="Container">
      <Heading2 />
      <Container8 />
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center pl-[8px] relative size-full">
        <Overlay />
        <Container7 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#ffb4ab] relative rounded-[6px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#690005] text-[14px] text-center tracking-[0.14px] w-[92.83px]">
          <p className="leading-[19.6px]">Acknowledge</p>
        </div>
      </div>
    </div>
  );
}

function HeroAlertBanner() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(147,0,10,0.2)] relative rounded-[12px] shrink-0 w-full" data-name="Hero Alert Banner">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between p-[17px] relative size-full">
          <Container5 />
          <Button />
          <div className="absolute bg-[#ffb4ab] bottom-[0.81px] left-px top-px w-[4px]" data-name="Background" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,180,171,0.3)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_0px_15px_0px_rgba(255,180,171,0.3)]" />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-[94.23px]">
        <p className="leading-[16px]">LEVEL RISIKO</p>
      </div>
      <div className="h-[18px] relative shrink-0 w-[4px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 18">
          <path d={svgPaths.p233ed800} fill="var(--fill-0, #FFB4AB)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Paragraph />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[#ffb4ab] text-[30px] w-full">
        <p className="leading-[36px]">TINGGI</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#1e293b] h-[6px] overflow-clip relative rounded-[9999px] shrink-0 w-full" data-name="Background">
      <div className="absolute bg-[#ffb4ab] inset-[0_15%_0_0] shadow-[0px_0px_15px_0px_rgba(255,180,171,0.3)]" data-name="Background+Shadow" />
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start relative size-full">
        <Container10 />
        <Background />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[25px] relative size-full">
        <Margin />
        <Container9 />
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-[88.25px]">
        <p className="leading-[16px]">TREN RISIKO</p>
      </div>
      <div className="h-[12px] relative shrink-0 w-[20px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 12">
          <path d={svgPaths.p33125000} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Paragraph1 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-white w-full">
        <p className="leading-[36px]">Meningkat</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 size-[8.75px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 8.75">
        <g id="Container">
          <path d={svgPaths.pa49aac0} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[16px] w-[60.25px]">
        <p className="leading-[24px]">+12.4%</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container12 />
        <Container13 />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[25px] relative size-full">
        <Margin1 />
        <Container11 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-[95.45px]">
        <p className="leading-[16px]">CUACA AKTIF</p>
      </div>
      <div className="h-[20.019px] relative shrink-0 w-[20px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20.0185">
          <path d={svgPaths.p270881c0} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-white w-full">
        <p className="leading-[36px]">42 mm/hr</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[12px] w-full">
        <p className="leading-[16px]">Intensitas: Sangat Lebat</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[25px] relative size-full">
        <Margin2 />
        <Container16 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[12px] tracking-[1.2px] uppercase w-[128.7px]">
        <p className="leading-[16px]">LAPORAN HARI INI</p>
      </div>
      <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
          <path d={svgPaths.pc679c40} fill="var(--fill-0, #94A3B8)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Paragraph3 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black justify-center leading-[0] not-italic relative shrink-0 text-[30px] text-white w-full">
        <p className="leading-[36px]">8 Unit</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#64748b] text-[12px] w-full">
        <p className="leading-[16px]">3 Perlu Verifikasi</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur3() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] col-4 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[25px] relative size-full">
        <Margin3 />
        <Container19 />
      </div>
    </div>
  );
}

function MetricsGrid() {
  return (
    <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_154px] relative shrink-0 w-[960px]" data-name="Metrics Grid">
      <OverlayBorderOverlayBlur />
      <OverlayBorderOverlayBlur1 />
      <OverlayBorderOverlayBlur2 />
      <OverlayBorderOverlayBlur3 />
    </div>
  );
}

function MapOfJakarta() {
  return (
    <div className="flex-[1_0_0] min-h-px mix-blend-luminosity opacity-40 relative w-full" data-name="Map of Jakarta">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[158.29%] left-0 max-w-none top-[-29.15%] w-full" src={imgMapOfJakarta} />
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-[#0b0e15] inset-px" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <MapOfJakarta />
        <div className="absolute bg-gradient-to-t from-[#10131a] inset-0 to-[rgba(16,19,26,0.5)] via-1/2 via-[rgba(16,19,26,0)]" data-name="Gradient" />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[12.775px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.775 12.775">
        <g id="Container">
          <path d={svgPaths.p840e200} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container22 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] tracking-[0.7px] uppercase w-[188.17px]">
          <p className="leading-[19.6px]">JAKARTA TACTICAL GRID</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#1d2027] relative rounded-[4px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(173,198,255,0.2)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[9px] py-[5px] relative size-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[12px] w-[187.23px]">
          <p className="leading-[16px]">LAT -6.2088 | LNG 106.8456</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(16,19,26,0.5)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder+OverlayBlur">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[16px] relative size-full">
          <Heading3 />
          <BackgroundBorder />
        </div>
      </div>
    </div>
  );
}

function SimulatedMarkers() {
  return (
    <div className="absolute bg-[#ffb4ab] inset-[30%_53.1%_66.46%_45%] rounded-[6px]" data-name="Simulated Markers">
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[6px] shadow-[0px_0px_0px_4px_rgba(255,180,171,0.2)]" data-name="Simulated Markers:shadow" />
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <SimulatedMarkers />
        <div className="absolute bg-[#ffb786] border-2 border-[#10131a] border-solid inset-[55%_37.46%_40.28%_60%] rounded-[9999px] shadow-[0px_0px_10px_0px_rgba(255,183,134,0.5)]" data-name="Background+Border+Shadow" />
        <div className="absolute bg-[#adc6ff] border-2 border-[#10131a] border-solid inset-[70%_68.1%_26.46%_30%] rounded-[9999px]" data-name="Background+Border" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute border border-[rgba(173,198,255,0.1)] border-solid left-[calc(50%+0.5px)] opacity-20 rounded-[9999px] size-[800px] top-1/2" data-name="Overlay Radar Sweep (CSS visual only)" />
      </div>
    </div>
  );
}

function MiniMapPreview() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] h-[400px] relative rounded-[12px] shrink-0 w-full" data-name="Mini Map Preview">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Background1 />
        <OverlayHorizontalBorderOverlayBlur />
        <Container23 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function LeftColumnMapPrimaryStats() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[400px] items-start min-w-px pb-[129.2px] relative" data-name="Left Column: Map & Primary Stats">
      <MiniMapPreview />
    </div>
  );
}

function Container24() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p3f18d400} fill="var(--fill-0, #B7C8E1)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container24 />
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] tracking-[0.7px] uppercase w-[135.67px]">
          <p className="leading-[19.6px]">RECENT ACTIVITY</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[12px] text-center w-[52.5px]">
          <p className="leading-[16px]">View Log</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(29,32,39,0.3)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[16px] relative size-full">
          <Heading4 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(255,180,171,0.2)] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffb4ab] text-[10px] uppercase w-[32.61px]">
        <p className="leading-[15px]">KRITIS</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay1 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[11px] w-[55.34px]">
          <p className="leading-[16.5px]">10 mnt lalu</p>
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-full">
          <p className="leading-[24px]">Banjir Jl. Kemang Raya</p>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[14px] w-full">
          <p className="leading-[20px] mb-0">Air 50cm, kendaraan tidak</p>
          <p className="leading-[20px]">bisa melintas.</p>
        </div>
      </div>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(58,74,95,0.3)] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[11px] w-[29px]">
          <p className="leading-[16.5px]">banjir</p>
        </div>
      </div>
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(58,74,95,0.3)] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[11px] w-[58.39px]">
          <p className="leading-[16.5px]">jalan-putus</p>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[29px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start pt-[8px] relative size-full">
        <Overlay2 />
        <Overlay3 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[11px] w-full">
          <p className="leading-[16.5px]">12 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem1Critical() {
  return (
    <div className="bg-[#1d2027] relative rounded-[8px] shrink-0 w-full" data-name="Activity Item 1: Critical">
      <div aria-hidden="true" className="absolute border-[#ffb4ab] border-l-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[20px] pr-[16px] py-[16px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Activity Item 1: Critical:shadow" />
        <Container26 />
        <Heading5 />
        <Container27 />
        <Container28 />
        <Container29 />
      </div>
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(255,183,134,0.2)] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffb786] text-[10px] uppercase w-[64.2px]">
        <p className="leading-[15px]">PERINGATAN</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay4 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[11px] w-[57.44px]">
          <p className="leading-[16.5px]">32 mnt lalu</p>
        </div>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-full">
          <p className="leading-[24px]">Ciliwung Meluap</p>
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[14px] w-full">
          <p className="leading-[20px] mb-0">Air naik cepat, saluran</p>
          <p className="leading-[20px]">tersumbat.</p>
        </div>
      </div>
    </div>
  );
}

function Overlay5() {
  return (
    <div className="bg-[rgba(58,74,95,0.3)] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[11px] w-[34.41px]">
          <p className="leading-[16.5px]">sungai</p>
        </div>
      </div>
    </div>
  );
}

function Overlay6() {
  return (
    <div className="bg-[rgba(58,74,95,0.3)] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[11px] w-[51.77px]">
          <p className="leading-[16.5px]">genangan</p>
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="h-[29px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-start pt-[8px] relative size-full">
        <Overlay5 />
        <Overlay6 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[11px] w-full">
          <p className="leading-[16.5px]">5 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem2Warning() {
  return (
    <div className="bg-[#1d2027] relative rounded-[8px] shrink-0 w-full" data-name="Activity Item 2: Warning">
      <div aria-hidden="true" className="absolute border-[#ffb786] border-l-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pl-[20px] pr-[16px] py-[16px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Activity Item 2: Warning:shadow" />
        <Container30 />
        <Heading6 />
        <Container31 />
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Overlay7() {
  return (
    <div className="bg-[rgba(234,179,8,0.2)] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[4px] shrink-0" data-name="Overlay">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#eab308] text-[10px] uppercase w-[42.02px]">
        <p className="leading-[15px]">SEDANG</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-between relative size-full">
        <Overlay7 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[11px] w-[47.16px]">
          <p className="leading-[16.5px]">1 jam lalu</p>
        </div>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 4">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-full">
          <p className="leading-[24px] mb-0">Genangan Underpass</p>
          <p className="leading-[24px]">Antasari</p>
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[14px] w-full">
          <p className="leading-[20px] mb-0">Genangan semata kaki, masih</p>
          <p className="leading-[20px]">bisa dilalui.</p>
        </div>
      </div>
    </div>
  );
}

function Overlay8() {
  return (
    <div className="bg-[rgba(58,74,95,0.3)] relative rounded-[4px] self-stretch shrink-0" data-name="Overlay">
      <div className="content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[11px] w-[51.7px]">
          <p className="leading-[16.5px]">jalan-raya</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[29px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pt-[8px] relative size-full">
        <Overlay8 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[11px] w-full">
          <p className="leading-[16.5px]">2 konfirmasi</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem3Moderate() {
  return (
    <div className="bg-[#1d2027] content-stretch flex flex-col gap-[4px] h-[210px] items-start opacity-80 pl-[20px] pr-[16px] py-[16px] relative rounded-[8px] shrink-0 w-[235px]" data-name="Activity Item 3: Moderate">
      <div aria-hidden="true" className="absolute border-[#eab308] border-l-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Activity Item 3: Moderate:shadow" />
      <Container34 />
      <Heading7 />
      <Container35 />
      <Container36 />
      <Container37 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#10131a] relative shrink-0 w-full" data-name="Background">
      <div className="overflow-x-auto overflow-y-clip size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start p-[16px] relative size-full">
          <ActivityItem1Critical />
          <ActivityItem2Warning />
          <ActivityItem3Moderate />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="overflow-x-clip overflow-y-auto size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[16px] relative size-full">
          <Background2 />
        </div>
      </div>
    </div>
  );
}

function RightColumnRecentActivityFeed() {
  return (
    <div className="bg-[#10131a] h-[549px] relative rounded-[12px] shrink-0 w-[301px]" data-name="Right Column: Recent Activity Feed">
      <div className="content-stretch flex flex-col items-start overflow-x-clip overflow-y-auto p-px relative size-full">
        <OverlayHorizontalBorder />
        <Container25 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(66,71,84,0.3)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function BentoGridLayout() {
  return (
    <div className="content-stretch flex gap-[20px] h-[542px] items-start overflow-clip relative shrink-0 w-full" data-name="Bento Grid Layout">
      <LeftColumnMapPrimaryStats />
      <RightColumnRecentActivityFeed />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="h-[960px] max-w-[1440px] relative shrink-0 w-full" data-name="Main Content Canvas">
      <div className="max-w-[inherit] overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] p-[32px] relative size-full">
          <HeaderSection />
          <HeroAlertBanner />
          <MetricsGrid />
          <BentoGridLayout />
        </div>
      </div>
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

function BackgroundBorder1() {
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

function Container41() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[22.5px]" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[12px] w-[95.77px]">
        <p className="leading-[16px]">Pengguna</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[38.5px] relative shrink-0 w-[154.19px]" data-name="Container">
      <Heading1 />
      <Container41 />
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder1 />
      <Container40 />
    </div>
  );
}

function Container42() {
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
      <Container42 />
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffdad6] text-[14px] text-center tracking-[0.14px] w-[149.84px]">
        <p className="leading-[19.6px]">Emergency Broadcast</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
        <Container39 />
        <Button2 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p191dcc80} fill="var(--fill-0, #60A5FA)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function LinkActiveTab() {
  return (
    <div className="bg-[rgba(37,99,235,0.2)] relative rounded-br-[8px] rounded-tr-[8px] shrink-0 w-full" data-name="Link - Active Tab">
      <div aria-hidden="true" className="absolute border-[#3b82f6] border-l-4 border-solid inset-0 pointer-events-none rounded-br-[8px] rounded-tr-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container43 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[14px] w-[104.56px]">
            <p className="leading-[20px]">Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container44() {
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
          <Container44 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-[118px]">
            <p className="leading-[20px]">Incident Reports</p>
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

function Container45() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="healthicons:risk-analysis-24px">
        <Group />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container45 />
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
        <LinkActiveTab />
        <LinkInactiveTabs />
        <Link />
      </div>
    </div>
  );
}

function Container46() {
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

function Link1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container46 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-[81px]">
            <p className="leading-[20px]">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container47() {
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

function Link2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container47 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#94a3b8] text-[14px] w-[95px]">
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
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function AsideJsonComponentSideNavBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(2,6,23,0.8)] content-stretch flex flex-col h-[1024px] items-start left-0 pr-px pt-[64px] top-0 w-[256px]" data-name="Aside - JSON Component: SideNavBar">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <div className="absolute bg-[rgba(255,255,255,0)] h-[853px] left-0 shadow-[0px_25px_50px_-12px_rgba(30,58,138,0.2)] top-0 w-[256px]" data-name="Aside - JSON Component: SideNavBar:shadow" />
      <Container38 />
      <Nav />
      <HorizontalBorder />
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Black',sans-serif] font-black h-[28px] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[20px] tracking-[-1px] w-[150.02px]">
        <p className="leading-[28px]">BanSos</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Container49 />
      </div>
    </div>
  );
}

function Container52() {
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
        <Container52 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[9999px]" />
    </div>
  );
}

function Container53() {
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

function Container51() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Input />
      <Container53 />
    </div>
  );
}

function Container54() {
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
      <Container54 />
    </div>
  );
}

function Container55() {
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
      <Container55 />
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

function Container50() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container51 />
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
      <Container48 />
      <Container50 />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[256px] pt-[64px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(16, 19, 26) 0%, rgb(16, 19, 26) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Dashboard">
      <MainContentCanvas />
      <AsideJsonComponentSideNavBar />
      <TopNavBarWeb />
    </div>
  );
}