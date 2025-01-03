import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { useEffect, useState } from 'react';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

export type WelcomeMessageProps = {
  params: { [key: string]: string };
};

export const Default = ({}: WelcomeMessageProps): JSX.Element => {
  const [guestData, setGuestData] = useState<GuestProfile>();
  const [guestPersonalizedData, setGuestPersonalizedData] = useState<GuestPersonalizedData>();
  const { sitecoreContext } = useSitecoreContext();

  interface GuestProfile {
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    country: string;
  }

  interface GuestPersonalizedData {
    welcomeMessage: string;
    favoriteBrand: string;
    favoriteProduct: string;
  }

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const GetGuestDataResponse = (await personalize({
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'get_customer_data',
      })) as unknown as GuestProfile;
      console.log('This experience is now running:', GetGuestDataResponse);
      setGuestData(GetGuestDataResponse);
    };
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      const GetPersonalizedDataResponse = (await personalize({
        channel: 'WEB',
        currency: 'EUR',
        friendlyId: 'demo_interactive_experience_scm',
      })) as unknown as GuestPersonalizedData;
      console.log('This experience is now running:', GetPersonalizedDataResponse);
      setGuestPersonalizedData(GetPersonalizedDataResponse);
    };
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  if (sitecoreContext.pageEditing) {
    return (
      <div className={`component rich-text contact-form component-spaced`}>
        <div className="container">
          <h2 className="mb-4">Hello, $FirstName!</h2>
          <p>
            <strong>
              Personalized welcome message will display here if the user is identified.
            </strong>
          </p>
        </div>
      </div>
    );
  } else if (guestData?.firstName === null || guestData?.firstName === '') {
    return <></>;
  } else {
    return (
      <div className={`component rich-text contact-form component-spaced`}>
        <div className="container">
          <h2 className="mb-4">Hello, {guestData?.firstName}!</h2>
          <p>
            <strong>{guestPersonalizedData?.welcomeMessage}</strong>
          </p>
        </div>
      </div>
    );
  }
};
