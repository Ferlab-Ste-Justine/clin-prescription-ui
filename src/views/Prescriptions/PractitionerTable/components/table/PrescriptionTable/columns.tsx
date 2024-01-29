import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { Tooltip } from 'antd';
import { ITableAnalysisResult } from 'graphql/prescriptions/models/Prescription';
import DownloadButton from 'views/Prescriptions/components/DownloadButton';
import StatusTag from 'views/Prescriptions/components/StatusTag';
import { getPrescriptionStatusDictionnary } from 'views/Prescriptions/utils/constant';

import { formatDate } from 'utils/date';

export const prescriptionsColumns = (): ProColumnType<ITableAnalysisResult>[] => [
  {
    key: 'prescription_id',
    dataIndex: ['prescription_id'],
    render: (prescription_id: string) => (
      <Link to={`/prescription/entity/${prescription_id}`}>{prescription_id}</Link>
    ),
    title: intl.get('screen.patientsearch.table.prescription'),
    sorter: { multiple: 1 },
  },
  {
    key: 'patient_id',
    dataIndex: ['patient_id'],
    render: (patient_id: string) => patient_id,
    title: intl.get('screen.patientsearch.table.patient'),
    sorter: { multiple: 1 },
  },
  {
    key: 'status',
    dataIndex: 'status',
    render: (value: string) =>
      value ? <StatusTag dictionary={getPrescriptionStatusDictionnary()} status={value} /> : null,
    title: intl.get('screen.patientsearch.table.status'),
    sorter: { multiple: 1 },
  },
  {
    key: 'created_on',
    dataIndex: 'created_on',
    render: (date: string) => formatDate(date),
    title: intl.get('screen.patientsearch.table.createdOn'),
    tooltip: intl.get('screen.patientsearch.table.createdOn.tooltip'),
    sorter: { multiple: 1 },
  },
  {
    key: 'analysis_code',
    dataIndex: ['analysis_code'],
    title: intl.get('screen.patientsearch.table.test'),
    tooltip: intl.get('screen.patientsearch.table.test.tooltip'),
    sorter: { multiple: 1 },
  },
  {
    key: 'ep',
    dataIndex: ['ep'],
    title: intl.get('screen.patientsearch.table.ep'),
    tooltip: intl.get('screen.patientsearch.table.ep.tooltip'),
    sorter: { multiple: 1 },
  },
  {
    key: 'download',
    title: '',
    align: 'center',
    width: 40,
    dataIndex: ['prescription_id'],
    render: (prescription_id: string) => (
      <Tooltip title={intl.get('download.documents')}>
        <DownloadButton prescriptionId={prescription_id} iconOnly />
      </Tooltip>
    ),
  },
];
