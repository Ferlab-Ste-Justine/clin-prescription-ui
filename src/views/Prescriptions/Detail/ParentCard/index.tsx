import intl from 'react-intl-universal';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Descriptions, Divider, Space, Typography } from 'antd';
import { extractPatientId } from 'api/fhir/helper';
import { ServiceRequestEntity, ServiceRequestEntityExtension } from 'api/fhir/models';
import { getPatientAffectedStatus } from 'api/fhir/patientHelper';
import { get } from 'lodash';

import CollapsePanel from 'components/containers/collapse';
import ParagraphLoader from 'components/uiKit/ParagraphLoader';

import PatientContent from '../PatientCard/PatientContent';
import RequestTable from '../RequestTable';

const { Title } = Typography;

interface OwnProps {
  extension?: ServiceRequestEntityExtension;
  prescription?: ServiceRequestEntity;
  loading: boolean;
}

const ParentCard = ({ extension, loading, prescription }: OwnProps) => (
  <ParagraphLoader loading={loading} paragraph={{ rows: 6 }}>
    {extension?.extension?.length && (
      <CollapsePanel
        header={
          <Title level={4}>
            {intl.get(get(extension?.extension[0].valueCoding, 'coding[0].code', ''))}
          </Title>
        }
        datacy={`ParentCard_${intl.get(
          get(extension?.extension[0].valueCoding, 'coding[0].code', ''),
        )}`}
      >
        <Space direction="vertical" size="large">
          <GridCard
            content={
              <>
                <PatientContent
                  patient={extension?.extension[1].valueReference?.resource!}
                  reference={prescription?.subject?.resource?.managingOrganization?.reference}
                  labelClass="label-20"
                />
                <Divider />
                <Descriptions column={1} size="small" className="label-20">
                  <Descriptions.Item
                    label={intl.get('screen.prescription.entity.parent.affectedStatus')}
                  >
                    {intl.get(getPatientAffectedStatus(extension))}
                  </Descriptions.Item>
                </Descriptions>
              </>
            }
          />
          <RequestTable
            patientId={extractPatientId(extension?.extension[1].valueReference?.resource.id!)}
            data={extension?.extension[1].valueReference?.resource?.requests ?? []}
          />
        </Space>
      </CollapsePanel>
    )}
  </ParagraphLoader>
);

export default ParentCard;
