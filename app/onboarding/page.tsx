import Step1Basics from "./steps/Step1Basics";
import Step2Location from "./steps/Step2Location";
import Step3Mission from "./steps/Step3Mission";
import Step4Capacity from "./steps/Step4Capacity";
import Step5Funding from "./steps/Step5Funding";
import Step6Eligibility from "./steps/Step6Eligibility";

export default function OnboardingPage({ searchParams }: { searchParams: { step?: string } }) {
  const step = Number(searchParams.step || 1);

  const steps = {
    1: <Step1Basics />, 
    2: <Step2Location />,
    3: <Step3Mission />,
    4: <Step4Capacity />,
    5: <Step5Funding />,
    6: <Step6Eligibility />,
  };

  return steps[step] || <Step1Basics />;
}
