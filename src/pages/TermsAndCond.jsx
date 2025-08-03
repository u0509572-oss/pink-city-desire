import { DisclaimerBg } from "../assets";
import Container from "../components/common/Container";
import InfoBox from "../components/TermsAndCond/InfoBox";

const TermsAndCond = () => {
  return (
    <div
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${DisclaimerBg})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(285.91deg,rgba(201,68,208,0.8)_-57.37%,rgba(0,0,0,0.8)_91.52%)]"></div>
      <div className="relative text-white section-container">
        <Container>
          <div className="flex flex-col gap-8 md:gap-14">
            <h2 className="responsive-heading font-semibold">
              Terms of Use & Age Disclaimer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
              <InfoBox
                heading="Age Restriction"
                data="This website contains content intended only for users aged 18 years and older. By accessing this site, you confirm that you meet the minimum legal age requirement in your country or jurisdiction."
              />
              <InfoBox
                heading="Consent"
                data={
                  <div>
                    By continuing, you agree that:
                    <ul className="list-disc pl-6">
                      <li>You are at least 18 years of age</li>
                      <li>
                        You will not allow anyone underage to access this
                        content
                      </li>
                      <li>
                        You accept full responsibility for accessing this
                        material
                      </li>
                    </ul>
                  </div>
                }
              />
              <InfoBox
                heading="Privacy & Discretion"
                data="All bookings and interactions are private and confidential. We do not store unnecessary data or share your personal information with third parties."
              />
              <div className="md:col-span-3 col-span-1">
                <InfoBox
                  heading="Legal Use"
                  data={
                    <div>
                      You agree to use this website strictly for lawful and
                      legitimate purposes. By accessing and interacting with
                      this platform, you acknowledge and accept the following
                      conditions:
                      <ul className="list-disc pl-6">
                        <li>
                          No Misrepresentation: You agree not to impersonate any
                          person or entity, or to provide false information
                          during any form submission or communication.
                        </li>
                        <li>
                          No Harassment or Abuse: Any form of harassment, hate
                          speech, exploitation, or abusive behavior—toward
                          service providers, staff, or other users—will not be
                          tolerated.
                        </li>
                        <li>
                          No Illegal Transactions: This platform does not
                          promote or permit any illegal activity, including but
                          not limited to human trafficking, solicitation in
                          prohibited areas, or activities that violate local or
                          international law.
                        </li>
                      </ul>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TermsAndCond;
