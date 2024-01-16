import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { extractServiceRequestId } from 'api/fhir/helper';
import { PrescriptionFormApi } from 'api/form';

import { globalActions, useLang } from 'store/global';
import { HTTP_HEADERS, MIME_TYPES } from 'utils/constants';
import { downloadFile, extractFilename } from 'utils/helper';

interface OwnProps {
  prescriptionId: string;
  iconOnly?: Boolean;
  text?: string;
}

const DownloadButton = ({ prescriptionId, iconOnly, text }: OwnProps) => {
  const lang = useLang();
  const dispatch = useDispatch();
  const [downloadingDocuments, setDownloadingDocuments] = useState(false);
  const downloadDocuments = () => {
    const id = extractServiceRequestId(prescriptionId);
    PrescriptionFormApi.downloadDocuments(id, lang)
      .then(({ data, error, response }) => {
        if (error) {
          dispatch(
            globalActions.displayNotification({
              type: 'error',
              message: intl.get('notification.error'),
              description: intl.get('notification.error.file.download'),
            }),
          );
        } else {
          const fileName = extractFilename(
            response.headers[HTTP_HEADERS.CONTENT_DISPOSITION],
            `${id}.pdf`,
          );
          const blob = new Blob([data as BlobPart], {
            type: MIME_TYPES.APPLICATION_PDF,
          });
          downloadFile(blob, fileName);
        }
      })
      .finally(() => {
        setDownloadingDocuments(false);
      });
    setDownloadingDocuments(true);
  };
  return iconOnly ? (
    <Button
      type="link"
      icon={<DownloadOutlined />}
      size="small"
      loading={downloadingDocuments}
      onClick={downloadDocuments}
    />
  ) : (
    <Button
      key="download-docs"
      type="primary"
      loading={downloadingDocuments}
      onClick={downloadDocuments}
      icon={<DownloadOutlined width={'16'} height={'16'} />}
    >
      {text ? text : intl.get('download.documents')}
    </Button>
  );
};

export default DownloadButton;
