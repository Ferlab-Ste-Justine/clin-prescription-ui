import intl from 'react-intl-universal';
import { useHistory, useParams } from 'react-router-dom';
import { BarChartOutlined, TeamOutlined } from '@ant-design/icons';
import { Tabs, Tag } from 'antd';
import { useTabSummaryData } from 'graphql/variants/tabActions';
import { GraphqlBackend } from 'providers/';
import ApolloProvider from 'providers/ApolloProvider';
import PatientPanel from 'views/Snv/Entity/PatientPanel';

import LineStyleIcon from 'components/icons/LineStyleIcon';
import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import NotFound from 'components/Results/NotFound';
import ServerError from 'components/Results/ServerError';
import VerdictLabel from 'components/Variant/VerdictLabel';

import ResumePanel from './SummaryPanel';

import styles from './index.module.scss';

export const getVepImpactTag = (score: number | string) => {
  switch (score) {
    case 1:
    case 'modifier':
      return <Tag>MODIFIER</Tag>;
    case 2:
    case 'low':
      return <Tag color="green">LOW</Tag>;
    case 3:
    case 'moderate':
      return <Tag color="gold">MODERATE</Tag>;
    case 4:
    case 'high':
      return <Tag color="red">HIGH</Tag>;

    default:
      return true;
  }
};

export enum TAB_ID {
  SUMMARY = 'summary',
  PATIENTS = 'patients',
  FREQUENCY = 'frequency',
  CLINICAL = 'clinical',
}

interface PathParams {
  locus: string;
  tabid: string;
}

const VariantEntityPage = () => {
  const history = useHistory();
  const { locus, tabid } = useParams<PathParams>();
  const { loading, data, error } = useTabSummaryData(locus);

  if (error) {
    return <ServerError />;
  }

  if (!data && !loading) {
    return <NotFound />;
  }

  return (
    <ContentWithHeader
      className={styles.variantEntity}
      headerProps={{
        icon: <LineStyleIcon />,
        title: data?.hgvsg,
        loading,
        extra: [
          <Tag key="type" color="purple">
            {data?.variant_type.toLocaleUpperCase()}
          </Tag>,
          <div key="score">{getVepImpactTag(data?.max_impact_score)}</div>,
          <VerdictLabel key="verdict" verdict={data?.varsome?.acmg?.verdict} />,
        ],
      }}
    >
      <Tabs
        size="small"
        className={styles.entitySections}
        activeKey={tabid}
        onChange={(key) => {
          if (history.location.key !== key) {
            history.push(`/variant/entity/${locus}/${key}`);
          }
        }}
      >
        <Tabs.TabPane
          tab={
            <span>
              <BarChartOutlined height="16" width="16" />
              {intl.get('screen.variantdetails.tab.summary')}
            </span>
          }
          key={TAB_ID.SUMMARY}
        >
          <ScrollContentWithFooter container>
            <ResumePanel
              locus={locus}
              data={{
                loading,
                variantData: data,
              }}
            />
          </ScrollContentWithFooter>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <TeamOutlined height="16" width="16" />
              {intl.get('screen.variantdetails.tab.patients')}
            </span>
          }
          key={TAB_ID.PATIENTS}
        >
          <ScrollContentWithFooter container>
            <PatientPanel locus={locus} />
          </ScrollContentWithFooter>
        </Tabs.TabPane>
      </Tabs>
    </ContentWithHeader>
  );
};

const EntityPage = () => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <VariantEntityPage />
  </ApolloProvider>
);

export default EntityPage;
