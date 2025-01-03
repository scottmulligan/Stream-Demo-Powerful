import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { context } from 'lib/context';
import { useEffect, useState } from 'react';

export type CustomerDataProps = {
  params: { [key: string]: string };
};

export const Default = ({}: CustomerDataProps): JSX.Element => {
  const [guestData, setGuestData] = useState<GuestProfile>();
  const [guestPersonalizedData, setGuestPersonalizedData] = useState<GuestPersonalizedData>();
  //const id = props.params.RenderingIdentifier;

  // if (typeof window !== 'undefined') {
  //   init({
  //     sitecoreEdgeUrl: config.sitecoreEdgeUrl,
  //     sitecoreEdgeContextId: config.sitecoreEdgeContextId,
  //     siteName: config.sitecoreSiteName,
  //     enableBrowserCookie: true,
  //   });
  //   console.log('Initialized the personalize/browser module.');
  // }

  function handleClick() {
    context
      .getSDK('Events')
      .then((Events) =>
        Events.identity({
          email: 'allison.dorner@example.com',
          firstName: 'Allison',
          lastName: 'Dorner',
          channel: 'WEB',
          language: 'EN',
          currency: 'EUR',
          identifiers: [
            {
              id: 'allison.dorner@example.com',
              provider: 'email',
            },
          ],
        })
      )
      .catch((e) => console.debug(e));
    console.log('Sent identity event.');
  }

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

  return (
    <div className={`component contact-form component-spaced`}>
      <div className="container">
        <div className="contact-form-inner">
          <form>
            <h2 className="mb-4">Identify</h2>
            <p>
              Sitecore can identify customers by email or other identifiers whether the user is
              logged in or has submitted a form on the website.
            </p>
            <input type="text" id="email" placeholder="Enter your email" />
            <input
              onClick={handleClick}
              type="submit"
              value="Identify me"
              className="button button-main mt-3"
            />
          </form>
        </div>
        <br />
        <br />

        <h2 className="mb-4">My Personalized Data</h2>
        <p>
          <strong>Personalized welcome message</strong>
        </p>
        <ul>
          <li>{guestPersonalizedData?.welcomeMessage}</li>
        </ul>
        <p>
          <strong>Favorite brand</strong>
        </p>
        <ul>
          <li>{guestPersonalizedData?.favoriteBrand}</li>
        </ul>
        <p>
          <strong>Favorite product</strong>
        </p>
        <ul>
          <li>{guestPersonalizedData?.favoriteProduct}</li>
        </ul>

        <h2 className="mb-4">My Customer Data</h2>
        <ul>
          <li>
            <strong>Email:</strong> {guestData?.email}
          </li>
          <li>
            <strong>Title:</strong> {guestData?.title}
          </li>
          <li>
            <strong>First name:</strong> {guestData?.firstName}
          </li>
          <li>
            <strong>Last name:</strong> {guestData?.lastName}
          </li>
          <li>
            <strong>Country:</strong> {guestData?.country}
          </li>
        </ul>
      </div>
    </div>
  );
};
