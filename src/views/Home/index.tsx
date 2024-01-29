import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { CheckCircleFilled, HomeOutlined, MedicineBoxFilled } from '@ant-design/icons';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Button, Col, Row, Space, Typography } from 'antd';
import { getUserFullName } from 'auth/keycloak';
import PractitionerTable from 'views/Prescriptions/PractitionerTable';

import FamilyRestroomIcon from 'components/icons/FamilyRestroomIcon';
import ContentWithHeader from 'components/Layout/ContentWithHeader';
import ScrollContentWithFooter from 'components/Layout/ScrollContentWithFooter';
import PrescriptionForm from 'components/Prescription';
import AddParentModal from 'components/Prescription/AddParentModal';
import AnalysisChoiceModal from 'components/Prescription/AnalysisChoiceModal';
import { LimitTo, Roles } from 'components/Roles/Rules';
import { prescriptionFormActions } from 'store/prescription/slice';

import ActionButton from './components/ActionButton';

const { Title } = Typography;

import { useEffect, useState } from 'react';
import Modal from 'antd/lib/modal/Modal';
import DownloadButton from 'views/Prescriptions/components/DownloadButton';

import { usePrescriptionForm } from 'store/prescription';
import { DYNAMIC_ROUTES } from 'utils/routes';

import styles from './index.module.scss';

const Home = () => {
  const dispatch = useDispatch();

  const { prescriptionId } = usePrescriptionForm();
  const [isVisible, setIsVisible] = useState(!!prescriptionId);

  const handleClose = () => {
    setIsVisible(false);
    clearPrescriptionId();
  };

  useEffect(() => {
    setIsVisible(!!prescriptionId);
  }, [prescriptionId]);

  const clearPrescriptionId = () =>
    dispatch(prescriptionFormActions.saveCreatedPrescription(undefined));

  useEffect(() => {
    window.addEventListener('beforeunload', clearPrescriptionId);
    return () => {
      window.removeEventListener('beforeunload', clearPrescriptionId);
    };
  }, []);

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
              <Row gutter={[24, 24]}>
                <LimitTo roles={[Roles.Prescriber, Roles.Practitioner]}>
                  <Col lg={12} className={styles.contentCol} data-cy="CreateNewPrescription">
                    <ActionButton
                      icon={<MedicineBoxFilled />}
                      title={intl.get('create.new.prescription')}
                      description={intl.get('analysis.prescription.and.request.for.patient')}
                      onClick={() => dispatch(prescriptionFormActions.startAnalyseChoice())}
                    />
                  </Col>
                  <Col lg={12} className={styles.contentCol}>
                    <ActionButton
                      disabled
                      icon={<FamilyRestroomIcon />}
                      title={intl.get('add.parent.to.existing.prescription')}
                      description={intl.get('find.analysis.and.add.family.member')}
                      onClick={() => dispatch(prescriptionFormActions.startAddParentChoice())}
                    />
                  </Col>
                </LimitTo>
              </Row>
            }
          />
          <GridCard
            title={<Title level={3}>{intl.get('my.prescriptions')}</Title>}
            bordered={false}
            className={styles.contentCard}
            wrapperClassName={styles.contentCardWrapper}
            content={
              <Row gutter={[48, 48]}>
                <PractitionerTable />
              </Row>
            }
          />
        </div>
      </ScrollContentWithFooter>
      <PrescriptionForm />
      <AddParentModal />
      <AnalysisChoiceModal />
      <Modal width={828} visible={isVisible} closable={false} footer={null}>
        <div className={styles.successModal}>
          <CheckCircleFilled />
          <Space direction={'vertical'} align={'center'}>
            <h3 className="ant-typography">{intl.get('prescription.submitted.success.title')}</h3>
            <p>
              {intl.getHTML('prescription.submitted.success.message', { id: prescriptionId })}&nbsp;
              <a href={DYNAMIC_ROUTES.PRESCRIPTION_ENTITY.replace(':id', prescriptionId!)}>
                {intl.get('prescription.submitted.success.link')}
              </a>
            </p>
          </Space>
          <Space>
            <DownloadButton
              prescriptionId={prescriptionId!}
              text={intl.get('prescription.submitted.actions.download')}
            />
            <Button key="close" onClick={handleClose}>
              {intl.get('close')}
            </Button>
          </Space>
        </div>
      </Modal>
    </ContentWithHeader>
  );
};

export default Home;
