import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { personalize } from '@sitecore-cloudsdk/personalize/browser';
import { context } from 'lib/context';

interface Fields {
  Title: Field<string>;
  EmailLabel: Field<string>;
  SubjectLabel: Field<string>;
  MessageLabel: Field<string>;
  ButtonLabel: Field<string>;
  BackgroundImage: ImageField;
}

const message = {
  channel: 'WEB',
  type: 'IDENTITY',
  language: 'EN',
  currency: 'EUR',
  //page: 'Login',
  pos: 'powerful',
  //browser_id: browser_id,
  //title: 'Sir',
  email: 'allison.dorner@example.com',
  firstname: 'Allison',
  lastname: 'Dorner',
};

JSON.stringify(message);

export type CustomerDataProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: CustomerDataProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  function handleClick() {
    // context.getSDK('Events').then((Events) =>
    //   Events.pageView({
    //     channel: 'WEB',
    //     currency: 'EUR',
    //     page: 'Test name',
    //     language: 'EN',
    //   })
    // );

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

  // const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   if (!email.trim()) {
  //     alert('Email form fields must be filled.');
  //     return;
  //   }
  // };

  const getGuestDataResponse = personalize({
    channel: 'WEB',
    currency: 'EUR',
    friendlyId: 'get_customer_data',
  });
  console.log('This experience is now running:', getGuestDataResponse);
  const guestDataOutput = JSON.stringify(getGuestDataResponse);

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
        <p>{guestDataOutput}</p>
        <h2 className="mb-4">My Personalized Data</h2>
      </div>
    </div>
  );
};
