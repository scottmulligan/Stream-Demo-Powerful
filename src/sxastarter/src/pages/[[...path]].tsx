import { useCallback, useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import { SitecoreContext, ComponentPropsContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { handleEditorFastRefresh } from '@sitecore-jss/sitecore-jss-nextjs/utils';
import { SitecorePageProps } from 'lib/page-props';
import { sitecorePagePropsFactory } from 'lib/page-props-factory';
import { componentBuilder } from 'temp/componentBuilder';
import { init } from '@sitecore-cloudsdk/personalize/browser';
import config from 'temp/config';

const SitecorePage = ({
  notFound,
  componentProps,
  layoutData,
  headLinks,
}: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore editors do not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  const initPersonalize = useCallback(async () => {
    if (typeof window !== 'undefined') {
      console.log('Running in the if');
      console.log('test env var' + config.sitecoreEdgeUrl);
      await init({
        sitecoreEdgeUrl: config.sitecoreEdgeUrl,
        sitecoreEdgeContextId: config.sitecoreEdgeContextId,
        siteName: config.sitecoreSiteName,
        enableBrowserCookie: true,
      });
    }
    console.log('Initialized the personalize/browser module.');
  }, []);

  initPersonalize();

  // useEffect(() => {
  //   initPersonalize();
  // }, [initPersonalize]);

  if (notFound || !layoutData.sitecore.route) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  const isEditing = layoutData.sitecore.context.pageEditing;

  return (
    <ComponentPropsContext value={componentProps}>
      <SitecoreContext
        componentFactory={componentBuilder.getComponentFactory({ isEditing })}
        layoutData={layoutData}
      >
        <Layout layoutData={layoutData} headLinks={headLinks} />
      </SitecoreContext>
    </ComponentPropsContext>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const props = await sitecorePagePropsFactory.create(context);
  return {
    props,
    revalidate: 5, // In seconds
    notFound: props.notFound, // Returns custom 404 page with a status code of 404 when true
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default SitecorePage;
