import { init, personalize } from '@sitecore-cloudsdk/personalize/browser';
import { context } from 'lib/context';
import config from 'temp/config';

export type CustomerDataProps = {
  params: { [key: string]: string };
};

export const Default = (props: CustomerDataProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  if (typeof window !== 'undefined') {
    init({
      sitecoreEdgeUrl: config.sitecoreEdgeUrl,
      sitecoreEdgeContextId: config.sitecoreEdgeContextId,
      siteName: config.sitecoreSiteName,
      enableBrowserCookie: true,
    });
    console.log('Initialized the personalize/browser module.');
  }

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

  const GetGuestDataResponse = personalize({
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'get_customer_data',
  });
  console.log('This experience is now running:', GetGuestDataResponse);

  return (
    <div
      className={`component contact-form component-spaced ${props.params.styles.trimEnd()}`}
      id={id ? id : undefined}
    >
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
        <h2 className="mb-4">My Customer Data</h2>
        <p>{}</p>
        <h2 className="mb-4">My Personalized Data</h2>
      </div>
    </div>
  );
};
