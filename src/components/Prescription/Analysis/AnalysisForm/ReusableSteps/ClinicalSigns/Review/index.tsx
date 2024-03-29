import intl from 'react-intl-universal';
import { Descriptions, Space } from 'antd';
import { isEmpty } from 'lodash';

import {
  EMPTY_FIELD,
  STEPS_ID,
} from 'components/Prescription/Analysis/AnalysisForm/ReusableSteps/constant';
import {
  CLINICAL_SIGN_NA,
  CLINICAL_SIGNS_FI_KEY,
  CLINICAL_SIGNS_ITEM_KEY,
  IClinicalSignItem,
} from 'components/Prescription/components/ClinicalSignsSelect/types';
import { usePrescriptionForm, usePrescriptionFormConfig } from 'store/prescription';

interface OwnProps {
  stepId?:
    | STEPS_ID.FATHER_IDENTIFICATION
    | STEPS_ID.MOTHER_IDENTIFICATION
    | STEPS_ID.CLINICAL_SIGNS;
}

const ClinicalSignsReview = ({ stepId = STEPS_ID.CLINICAL_SIGNS }: OwnProps) => {
  const formConfig = usePrescriptionFormConfig();
  const { analysisData } = usePrescriptionForm();

  const getData = (key: CLINICAL_SIGNS_FI_KEY) => analysisData[stepId]?.[key];

  const getSignsByStatus = (isObserved: Boolean) =>
    isObserved
      ? ((getData(CLINICAL_SIGNS_FI_KEY.SIGNS) ?? []) as IClinicalSignItem[]).filter(
          (sign) => sign[CLINICAL_SIGNS_ITEM_KEY.IS_OBSERVED] === isObserved,
        )
      : ((getData(CLINICAL_SIGNS_FI_KEY.NOT_OBSERVED_SIGNS) ?? []) as IClinicalSignItem[]);

  const formatSignsWithAge = (sign: IClinicalSignItem, index: number) => (
    <span key={index}>{`${sign[CLINICAL_SIGNS_ITEM_KEY.NAME]} (${
      sign[CLINICAL_SIGNS_ITEM_KEY.TERM_VALUE]
    }) ${
      sign.is_observed && sign.age_code
        ? ' - ' +
          formConfig?.clinical_signs.onset_age.find((age) => age.value === sign.age_code)?.name
        : ''
    }`}</span>
  );

  const getObservedSignsList = () => {
    const observedSigns = getSignsByStatus(true);
    return isEmpty(observedSigns)
      ? EMPTY_FIELD
      : observedSigns
          .filter((sign) => sign.is_observed !== CLINICAL_SIGN_NA)
          .map(formatSignsWithAge);
  };

  const getNotObservedSignsList = () => {
    const notObservedSigns = getSignsByStatus(false);
    return isEmpty(notObservedSigns) ? EMPTY_FIELD : notObservedSigns.map(formatSignsWithAge);
  };

  const getClinicalSignsRemark = () => {
    const remark = getData(CLINICAL_SIGNS_FI_KEY.CLINIC_REMARK) ?? EMPTY_FIELD;
    return isEmpty(remark.toString().trim()) ? EMPTY_FIELD : remark;
  };

  return (
    <Descriptions className="label-20" column={1} size="small">
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.observed')}>
        <Space direction="vertical" size={0}>
          {getObservedSignsList()}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.not.observed')}>
        <Space direction="vertical" size={0}>
          {getNotObservedSignsList()}
        </Space>
      </Descriptions.Item>
      <Descriptions.Item label={intl.get('prescription.clinical.signs.review.label.note')}>
        <>{getClinicalSignsRemark()}</>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ClinicalSignsReview;
