import svgPaths from "./svg-s222b5by24";
import imgFloodDamage from "./e63331a1de007fe4f014f49a2054fad1ec65d562.png";
import imgMapLocation from "./638c3383bda4bed902867afc30f8bf6cc5330f4d.png";

function FloodDamage() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Flood damage">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[250%] left-0 max-w-none top-[-75%] w-full" src={imgFloodDamage} />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[12.667px] relative shrink-0 w-[14.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 12.6667">
        <g id="Container">
          <path d={svgPaths.p2640d5c0} fill="var(--fill-0, #FFDAD6)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[14px] relative shrink-0 w-[41px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[15px] justify-center leading-[0] left-0 not-italic text-[#ffdad6] text-[12px] top-[6.5px] tracking-[0.6px] uppercase w-[60.11px]">
          <p className="leading-[14.4px]">KRITIS</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-[#93000a] drop-shadow-[0px_0px_7.5px_rgba(255,180,171,0.2)] relative rounded-[9999px] self-stretch shrink-0" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(255,180,171,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center px-[13px] py-[5px] relative size-full">
          <Container1 />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex h-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorderShadow />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[672px] relative shrink-0 w-full" data-name="Heading 1">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[80px] justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-white w-[637.92px]">
        <p className="leading-[31.2px]">Banjir di Jl. Kemang Raya</p>
      </div>
    </div>
  );
}

function Badges() {
  return (
    <div className="absolute bottom-[24px] content-stretch flex flex-col gap-[12px] items-start left-[32px] w-[637.92px]" data-name="Badges">
      <Container />
      <Heading />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="content-stretch flex flex-col h-[512px] items-start justify-center overflow-clip relative shrink-0 w-full" data-name="Hero Section">
      <FloodDamage />
      <div className="absolute bg-gradient-to-t from-[#10131a] inset-0 to-[rgba(16,19,26,0)] via-1/2 via-[rgba(16,19,26,0.6)]" data-name="Gradient Overlay" />
      <div className="absolute bg-gradient-to-r from-[rgba(16,19,26,0.8)] inset-0 to-[rgba(16,19,26,0)] via-1/2 via-[rgba(16,19,26,0)]" data-name="Gradient" />
      <Badges />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p2e0f2ff0} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(173,198,255,0.2)] relative rounded-[9999px] shrink-0 size-[48px]" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#adc6ff] text-[14px] tracking-[0.14px] w-[163.86px]">
        <p className="leading-[19.6px]">High Confidence Report</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[19px] justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-[576px]">
        <p className="leading-[24px]">Diverifikasi oleh 12 anggota komunitas dan dikuatkan oleh data sensor lokal.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-[634px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2.01px] items-start relative size-full">
        <Heading2 />
        <Container5 />
      </div>
    </div>
  );
}

function ConfidenceBanner() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] relative rounded-[12px] shrink-0 w-full" data-name="Confidence Banner">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[17px] relative size-full">
          <Overlay />
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[24px] w-full">
          <p className="leading-[31.2px]">Situation Overview</p>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c2c6d6] text-[16px] w-full">
          <p className="leading-[26px]">Ketinggian air dilaporkan telah mencapai sekitar 80 cm dan menunjukkan tren terus meningkat seiring dengan curah hujan yang masih tinggi. Arus air yang deras memperparah kondisi di lapangan, sehingga kendaraan roda dua maupun roda empat tidak dapat melintas dengan aman. Beberapa kendaraan bahkan berisiko terbawa arus jika dipaksakan melewati genangan tersebut. Situasi ini menyebabkan akses utama menuju wilayah Prapanca terputus total, menghambat mobilitas warga serta distribusi logistik. Warga diimbau untuk tetap waspada, menghindari area terdampak, dan mencari jalur alternatif yang lebih aman sambil menunggu kondisi air surut.</p>
        </div>
      </div>
    </div>
  );
}

function DescriptionCard() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] relative rounded-[12px] shrink-0 w-full" data-name="Description Card">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-[0_0.01px_-0.44px_0] rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Description Card:shadow" />
        <Heading1 />
        <Container6 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[12px] w-full">
          <p className="leading-[14.4px]">WAKTU DILAPORKAN</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p15221b80} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container9 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-[76.33px]">
          <p className="leading-[24px]">14:23 PST</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] col-1 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[17px] pt-[16px] px-[17px] relative size-full">
        <Container7 />
        <Container8 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[12px] w-full">
          <p className="leading-[14.4px]">REPORTER</p>
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Container">
          <path d={svgPaths.p3189a600} fill="var(--fill-0, #ADC6FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container12 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-[94px]">
          <p className="leading-[24px]">Unit 7-Alpha</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] col-2 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[17px] pt-[16px] px-[17px] relative size-full">
        <Container10 />
        <Container11 />
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[12px] w-full">
          <p className="leading-[14.4px]">RADIUS TERPENGARUH</p>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p794b800} fill="var(--fill-0, #FFB786)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container15 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[16px] w-[62.05px]">
          <p className="leading-[24px]">~2.4 km</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] col-3 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[17px] pt-[16px] px-[17px] relative size-full">
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[12px] w-full">
          <p className="leading-[14.4px]">TINGKAT KEPARAHAN</p>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[9px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 9">
        <g id="Container">
          <path d={svgPaths.p1889a500} fill="var(--fill-0, #FFB4AB)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container18 />
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffb4ab] text-[16px] w-[86px]">
          <p className="leading-[24px]">Meningkat</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorderOverlayBlur3() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] col-4 justify-self-stretch relative rounded-[12px] row-1 self-start shrink-0" data-name="Overlay+Border+OverlayBlur">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[17px] pt-[16px] px-[17px] relative size-full">
        <Container16 />
        <Container17 />
      </div>
    </div>
  );
}

function MetadataDetails() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_76.39px] relative shrink-0 w-full" data-name="Metadata/Details">
      <OverlayBorderOverlayBlur />
      <OverlayBorderOverlayBlur1 />
      <OverlayBorderOverlayBlur2 />
      <OverlayBorderOverlayBlur3 />
    </div>
  );
}

function MainColumn() {
  return (
    <div className="col-[1/span_8] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch pb-[40.36px] relative row-1 self-start shrink-0" data-name="Main Column">
      <ConfidenceBanner />
      <DescriptionCard />
      <MetadataDetails />
    </div>
  );
}

function MapLocation() {
  return (
    <div className="flex-[1_0_0] min-h-px opacity-60 relative w-full" data-name="Map location">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[201.74%] left-0 max-w-none top-[-50.87%] w-full" src={imgMapLocation} />
      </div>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(255,180,171,0.2)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="Overlay">
      <div className="bg-[#ffb4ab] rounded-[9999px] shadow-[0px_0px_10px_0px_rgba(255,180,171,0.8)] shrink-0 size-[16px]" data-name="Background+Shadow" />
    </div>
  );
}

function CenterPin() {
  return (
    <div className="absolute content-stretch flex flex-col inset-[37.5%_43.8%] items-center" data-name="Center Pin">
      <Overlay1 />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#10131a] h-[192px] relative shrink-0 w-full z-[2]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center relative size-full">
        <MapLocation />
        <CenterPin />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] tracking-[0.14px] w-full">
        <p className="leading-[19.6px]">Mampang Prapatan, Jakarta Selatan</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-[260px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Heading3 />
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(29,32,39,0.8)] relative shrink-0 w-full z-[1]" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.1)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[11.99px] items-start pb-[16px] pt-[17px] px-[16px] relative size-full">
        <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Icon">
          <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
            <path d={svgPaths.p303da380} fill="var(--fill-0, #ADC6FF)" id="Icon" />
          </svg>
        </div>
        <Container19 />
      </div>
    </div>
  );
}

function MapSnippetCard() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] relative rounded-[12px] shrink-0 w-full" data-name="Map Snippet Card">
      <div className="content-stretch flex flex-col isolate items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Background />
        <OverlayHorizontalBorder />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Heading4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#8c909f] text-[14px] tracking-[0.7px] uppercase w-full">
          <p className="leading-[19.6px]">TINDAKAN LAPANGAN</p>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p7b061c0} fill="var(--fill-0, #002E6A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#adc6ff] drop-shadow-[0px_0px_7.5px_rgba(173,198,255,0.2)] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-center px-[16px] py-[12px] relative size-full">
          <Container20 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#002e6a] text-[14px] text-center tracking-[0.14px] w-[134px]">
            <p className="leading-[19.6px]">Konfirmasi Laporan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[17px] relative shrink-0 w-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 17">
        <g id="Container">
          <path d={svgPaths.p399f9f00} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#424754] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[7.99px] items-center justify-center px-[17px] py-[13px] relative size-full">
          <Container21 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#e1e2ec] text-[14px] text-center tracking-[0.14px] w-[212px]">
            <p className="leading-[19.6px]">Laporkan sebagai Tidak Akurat</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionPanel() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.4)] relative rounded-[12px] shrink-0 w-full" data-name="Action Panel">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <Heading4 />
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function SidebarColumn() {
  return (
    <div className="col-[9/span_4] content-stretch flex flex-col gap-[24px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Sidebar Column">
      <MapSnippetCard />
      <ActionPanel />
    </div>
  );
}

function ContentGrid() {
  return (
    <div className="h-[486px] relative shrink-0 w-full" data-name="Content Grid">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-[repeat(12,minmax(0,1fr))] grid-rows-[_490.19px] px-[32px] relative size-full">
          <MainColumn />
          <SidebarColumn />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Container">
          <path d={svgPaths.p300a1100} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[40px] top-1/2" data-name="Button:shadow" />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20px] relative shrink-0 w-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
        <g id="Container">
          <path d={svgPaths.p2b729200} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[40px] top-0" data-name="Button:shadow" />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[16px] relative shrink-0 w-[4px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 16">
        <g id="Container">
          <path d={svgPaths.p3caf0c80} fill="var(--fill-0, #E1E2EC)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(29,32,39,0.6)] content-stretch flex items-center justify-center p-px relative rounded-[9999px] shrink-0 size-[40px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] left-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[40px] top-0" data-name="Button:shadow" />
      <Container25 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0" data-name="Container">
      <Button3 />
      <Button4 />
    </div>
  );
}

function BackNavigationActions() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-0 px-[32px] py-[24px] right-0 top-0" data-name="Back Navigation & Actions">
      <Button2 />
      <Container23 />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="flex-[1_0_0] h-full max-w-[1440px] min-w-px relative" data-name="Main Content Canvas">
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] pb-[32px] relative size-full">
        <HeroSection />
        <ContentGrid />
        <BackNavigationActions />
      </div>
    </div>
  );
}

export default function ReportDetailProfessionalDarkTheme() {
  return (
    <div className="content-stretch flex items-start justify-center relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(16, 19, 26) 0%, rgb(16, 19, 26) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Report Detail - Professional Dark Theme">
      <MainContentCanvas />
    </div>
  );
}