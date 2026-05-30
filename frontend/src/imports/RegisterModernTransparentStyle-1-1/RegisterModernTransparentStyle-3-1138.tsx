import svgPaths from "./svg-njpgy2ul37";
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
    <div className="content-stretch drop-shadow-[0px_1px_0.5px_rgba(0,0,0,0.05)] flex flex-col items-center relative shrink-0" data-name="Heading 2">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-center text-white w-[244.27px]">
        <p className="leading-[32px]">Welcome to BANSOS</p>
      </div>
    </div>
  );
}

function Heading2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0" data-name="Heading 2:margin">
      <Heading />
    </div>
  );
}

function WelcomeHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full" data-name="Welcome Header">
      <Container1 />
      <Heading2Margin />
    </div>
  );
}

function WelcomeHeaderMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Welcome Header:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <WelcomeHeader />
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-full">
        <p className="leading-[24px]">Full Name</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[16px] w-full">
          <p className="leading-[normal]">Enter your full name</p>
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
          <Container5 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container4() {
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
        <p className="leading-[24px]">Email Address</p>
      </div>
    </div>
  );
}

function Container7() {
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

function Input1() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center p-[17px] relative size-full">
          <Container7 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Label1 />
      <Input1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-full">
        <p className="leading-[24px]">Password</p>
      </div>
    </div>
  );
}

function Container9() {
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

function Input2() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center p-[17px] relative size-full">
          <Container9 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Label2 />
      <Input2 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Label">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white w-full">
        <p className="leading-[24px]">Confirm Password</p>
      </div>
    </div>
  );
}

function Container11() {
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

function Input3() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center p-[17px] relative size-full">
          <Container11 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#6b7280] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Label3 />
      <Input3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#3b82f6] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[16px] relative size-full">
          <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[8px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" data-name="Button:shadow" />
          <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.35px] uppercase w-[134.23px]">
            <p className="leading-[20px]">CREATE ACCOUNT</p>
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
      <Container4 />
      <Container6 />
      <Container8 />
      <Container10 />
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

function Container12() {
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
      <Container12 />
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

function ButtonGoogleSignUp() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Button - Google Sign Up">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center justify-center px-[17px] py-[15px] relative size-full">
          <Svg />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[153.23px]">
            <p className="leading-[24px]">Sign up with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Footer">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] text-center w-[246.4px]">
        <p>
          <span className="leading-[24px]">{`Already have an account? `}</span>
          <span className="[text-decoration-skip-ink:none] decoration-[rgba(255,255,255,0.5)] decoration-solid font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-white underline">Log in</span>
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

function RightGlassCardCenteredMain() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.15)] content-stretch flex flex-col gap-[24px] items-start p-[49px] relative rounded-[32px] shrink-0 w-[480px]" data-name="Right Glass Card Centered → Main">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[32px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" data-name="Main:shadow" />
      <WelcomeHeaderMargin />
      <FormMargin />
      <DividerMargin />
      <ButtonGoogleSignUp />
      <FooterMargin />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] max-w-[1280px] min-h-[1024px] min-w-px relative self-stretch" data-name="Container">
      <div className="flex flex-col items-center justify-center max-w-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center max-w-[inherit] min-h-[inherit] px-[96px] py-[48px] relative size-full">
          <RightGlassCardCenteredMain />
        </div>
      </div>
    </div>
  );
}

export default function RegisterModernTransparentStyle() {
  return (
    <div className="content-stretch flex items-start justify-center relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(17, 24, 39) 0%, rgb(17, 24, 39) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Register - Modern Transparent Style">
      <BackgroundImage />
      <Container />
    </div>
  );
}