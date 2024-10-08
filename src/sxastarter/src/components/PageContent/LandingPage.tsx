import React from 'react';
import {
  Field,
  ImageField,
  RichText,
  Placeholder,
  Text,
  RichTextField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { ParallaxBackgroundImage } from 'components/NonSitecore/ParallaxBackgroundImage';

interface Fields {
  Title: Field<string>;
  Content: RichTextField;
  BackgroundImage: ImageField;
}

export type LandingPageProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: LandingPageProps): JSX.Element => {
  const id = props.params?.RenderingIdentifier;

  return (
    <div
      className={`component page-background col-12 ${props.params?.styles?.trimEnd()}`}
      id={id ? id : undefined}
    >
      <ParallaxBackgroundImage BackgroundImage={props.fields.BackgroundImage} />

      <div className="container">

        <h1 className="display-6 fw-bold">
          <Text field={props.fields.Title}></Text>
        </h1>
        <div className="fs-2">
          <RichText field={props.fields.Content}></RichText>
        </div>
      </div>

      <div className="background-content-wrapper">
        <div className="background-content component-spaced container rounded-corners">
          <div className="p-3 p-sm-5">
            <div className="row">
              <Placeholder name="landing-page-content" rendering={props.rendering} />
            </div>
          </div>
        </div>
      </div>
      <Placeholder name="page-content" rendering={props.rendering} />
    </div>
  );
};
