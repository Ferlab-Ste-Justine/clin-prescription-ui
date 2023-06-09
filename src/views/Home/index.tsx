import { useDispatch } from 'react-redux';
import { HomeOutlined, MedicineBoxFilled } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Col, Row, Typography } from 'antd';
import { getUserFullName } from 'auth/keycloak';
import PractitionerTable from 'views/Prescriptions/PractitionerTable';

import FamilyRestroomIcon from 'components/icons/FamilyRestroomIcon';
import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import PrescriptionForm from 'components/Prescription';
import AddParentModal from 'components/Prescription/AddParentModal';
import AnalysisChoiceModal from 'components/Prescription/AnalysisChoiceModal';
import { LimitTo, Roles } from 'components/Roles/Rules';
import useQueryParam from 'hooks/useQueryParams';
import { prescriptionFormActions } from 'store/prescription/slice';
import { HAS_PRESCRIPTION } from 'utils/constants';

import ActionButton from './components/ActionButton';
const { Title } = Typography;

import styles from './index.module.scss';

const Home = () => {
  const dispatch = useDispatch();
  const hasPrescription = useQueryParam().get(HAS_PRESCRIPTION);
  const colWidth = hasPrescription ? 12 : 24;

  return (
    <ContentWithHeader
      headerProps={{
        icon: <HomeOutlined />,
        title: getUserFullName(),
      }}
    >
      <ScrollContentWithFooter className={styles.homePageWrapper} container>
        <div className={styles.contentWrapper}>
          <GridCard
            bordered={false}
            className={styles.contentCard}
            wrapperClassName={styles.contentCardWrapper}
            content={
              <Row gutter={[48, 48]}>
                <LimitTo roles={[Roles.Prescriber, Roles.Practitioner]}>
                  <Col lg={colWidth} className={styles.contentCol} data-cy="CreateNewPrescription">
                    <ActionButton
                      icon={<MedicineBoxFilled />}
                      title="Créer une nouvelle prescription"
                      description="Prescription d’analyse et requêtes pour un patient ou une famille"
                      onClick={() => dispatch(prescriptionFormActions.startAnalyseChoice())}
                    />
                  </Col>
                  {hasPrescription && (
                    <Col lg={colWidth} className={styles.contentCol}>
                      <ActionButton
                        icon={<FamilyRestroomIcon />}
                        title="Ajouter un parent à une prescription existante"
                        description="Trouver une analyse en cours et rajouter un membre de la famille"
                        onClick={() => dispatch(prescriptionFormActions.startAddParentChoice())}
                      />
                    </Col>
                  )}
                </LimitTo>
              </Row>
            }
          />
          {hasPrescription && (
            <GridCard
              title={<Title level={3}>Mes Prescriptions</Title>}
              bordered={false}
              className={styles.contentCard}
              wrapperClassName={styles.contentCardWrapper}
              content={
                <Row gutter={[48, 48]}>
                  <PractitionerTable />
                </Row>
              }
            />
          )}
        </div>
      </ScrollContentWithFooter>
      <PrescriptionForm />
      <AddParentModal />
      <AnalysisChoiceModal />
    </ContentWithHeader>
  );
};

export default Home;
