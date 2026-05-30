import svgPaths from "./svg-tzl2th8dap";
import imgDisasterReliefScene from "./382468de2bbae8dd38eb3457dfd55ddc4e30b40c.png";

function DisasterReliefScene() {
  return (
    <div className="flex-[1_0_0] min-h-px opacity-80 relative w-full" data-name="Disaster relief scene">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[125%] left-0 max-w-none top-[-12.5%] w-full" src={imgDisasterReliefScene} />
      </div>
    </div>
  );
}

function BackgroundImage() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-start justify-center" data-name="Background Image">
      <DisasterReliefScene />
      <div className="absolute bg-gradient-to-r from-[rgba(0,0,0,0.8)] inset-0 to-[rgba(0,0,0,0.3)] via-1/2 via-[rgba(0,0,0,0.6)]" data-name="Gradient" />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[30px] relative shrink-0 w-[31.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.5 30">
        <g id="Container">
          <path d={svgPaths.p2e5c9480} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[40px] justify-center leading-[0] not-italic relative shrink-0 text-[32px] text-white tracking-[1.6px] uppercase w-[145.63px]">
        <p className="leading-[40px]">BANSOS</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Heading() {
  return (
    <div className="drop-shadow-[0px_2px_1px_rgba(0,0,0,0.06),0px_4px_1.5px_rgba(0,0,0,0.07)] h-[140.78px] relative shrink-0 w-full" data-name="Heading 1">
      <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[141px] justify-center leading-[0] left-0 not-italic text-[64px] text-white top-[69.69px] tracking-[-1.6px] uppercase w-[323.2px]">
        <p className="leading-[70.4px] mb-0">BANJIR</p>
        <p className="leading-[70.4px]">{`& SOSMED`}</p>
      </div>
    </div>
  );
}

function Shadow() {
  return (
    <div className="content-stretch drop-shadow-[0px_1px_0.5px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-full" data-name="Shadow">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[90px] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-white w-[418.7px]">
        <p className="leading-[30px] mb-0">Empowering communities through reliable</p>
        <p className="leading-[30px] mb-0">emergency reporting and transparent social</p>
        <p className="leading-[30px]">assistance distribution.</p>
      </div>
    </div>
  );
}

function Shadow1() {
  return (
    <div className="content-stretch drop-shadow-[0px_1px_0.5px_rgba(0,0,0,0.05)] flex flex-col items-start relative shrink-0 w-full" data-name="Shadow">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] w-[399.55px]">
        <p className="leading-[24px]">Join us in making a difference where it matters most.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start max-w-[512px] relative shrink-0 w-[418.7px]" data-name="Container">
      <Heading />
      <Shadow />
      <Shadow1 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[512px] pt-[32px] relative shrink-0" data-name="Margin">
      <Container4 />
    </div>
  );
}

function LeftContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative" data-name="Left Content">
      <Container1 />
      <Margin />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-full">
        <p className="leading-[24px]">Email</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[16px] w-full">
          <p className="leading-[normal]">Enter your email</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center p-[17px] relative size-full">
          <Container6 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Input />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-full">
        <p className="leading-[24px]">Password</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[16px] w-full">
          <p className="leading-[normal]">••••••••••</p>
        </div>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center p-[17px] relative size-full">
          <Container8 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[135.27px]">
        <p className="[text-decoration-skip-ink:none] decoration-[rgba(255,255,255,0.5)] decoration-solid leading-[24px] underline">Forgot password?</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex h-[24px] items-start justify-end relative shrink-0 w-full" data-name="Container">
      <Link />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Input1 />
      <Container9 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#3b82f6] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[16px] relative size-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.35px] uppercase w-[54.59px]">
            <p className="leading-[20px]">SIGN IN</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-name="Button:margin">
      <Button />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Form">
      <Container5 />
      <Container7 />
      <ButtonMargin />
    </div>
  );
}

function FormMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Form:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[16px] relative size-full">
        <Form />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-[15.63px]">
        <p className="leading-[24px]">or</p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-full" data-name="Divider">
      <div className="bg-[rgba(255,255,255,0.4)] flex-[1_0_0] h-px min-w-px" data-name="Horizontal Divider" />
      <Container10 />
      <div className="bg-[rgba(255,255,255,0.4)] flex-[1_0_0] h-px min-w-px" data-name="Horizontal Divider" />
    </div>
  );
}

function DividerMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Divider:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start py-[8px] relative size-full">
        <Divider />
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p29ad9380} fill="var(--fill-0, #4285F4)" id="Vector" />
          <path d={svgPaths.p73c0a80} fill="var(--fill-0, #34A853)" id="Vector_2" />
          <path d={svgPaths.p1f69ba00} fill="var(--fill-0, #FBBC05)" id="Vector_3" />
          <path d={svgPaths.p3d0b3f00} fill="var(--fill-0, #EA4335)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function ButtonGoogleSignIn() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Button - Google Sign In">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center justify-center px-[17px] py-[15px] relative size-full">
          <Svg />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[147.38px]">
            <p className="leading-[24px]">Sign in with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] text-center w-[249.36px]">
        <p>
          <span className="leading-[24px]">{`Are you new? `}</span>
          <span className="[text-decoration-skip-ink:none] decoration-[rgba(255,255,255,0.5)] decoration-solid font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-white underline">Create an Account</span>
        </p>
      </div>
    </div>
  );
}

function FooterMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Footer />
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.15)] flex-[1_0_0] min-w-px relative rounded-[32px]" data-name="Main">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[49px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" data-name="Main:shadow" />
        <FormMargin />
        <DividerMargin />
        <ButtonGoogleSignIn />
        <FooterMargin />
      </div>
    </div>
  );
}

function RightGlassCard() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-[480px]" data-name="Right Glass Card">
      <Main />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] max-w-[1280px] min-h-[1024px] min-w-px relative self-stretch" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] min-h-[inherit] px-[96px] py-[48px] relative size-full">
          <LeftContent />
          <RightGlassCard />
        </div>
      </div>
    </div>
  );
}

export default function LoginModernTransparentStyle() {
  return (
    <div className="content-stretch flex items-start justify-center relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(17, 24, 39) 0%, rgb(17, 24, 39) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Login - Modern Transparent Style">
      <BackgroundImage />
      <Container />
    </div>
  );
}