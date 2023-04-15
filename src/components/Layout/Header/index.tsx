import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { DownOutlined } from '@ant-design/icons';
import Gravatar from '@ferlab/ui/core/components/Gravatar';
import { useKeycloak } from '@react-keycloak/web';
import { Button, Dropdown, Menu, PageHeader, Space } from 'antd';
import { getUserFirstName } from 'auth/keycloak';

import HeaderLink from 'components/Layout/Header/HeaderLink';
import { globalActions, useLang } from 'store/global';
import { LANG } from 'utils/constants';
import EnvironmentVariables from 'utils/EnvVariables';
import ROUTES from 'utils/routes';
import { IncludeKeycloakTokenParsed } from 'utils/tokenTypes';

import styles from './index.module.scss';

const Header = () => {
  const { keycloak } = useKeycloak();
  const lang = useLang();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentPathName = history.location.pathname;
  const tokenParsed = keycloak.tokenParsed as IncludeKeycloakTokenParsed;
  const targetLang = lang === LANG.FR ? LANG.EN : LANG.FR;

  return (
    <PageHeader
      title={
        <img className={styles.logo} alt={'Clin Portal UI'} src="/assets/logos/cqgc-white.svg" />
      }
      subTitle={
        <nav className={styles.headerList}>
          <HeaderLink
            key="home"
            currentPathName={currentPathName}
            to={ROUTES.HOME}
            icon={<HomeOutlined />}
            title={intl.get('layout.main.menu.home')}
          />
          {/* <LimitTo key="prescriptions" roles={[Roles.Practitioner]}>
            <HeaderLink
              key="prescriptions"
              currentPathName={currentPathName}
              to={ROUTES.PRESCRIPTION_SEARCH}
              icon={<MedicineBoxOutlined />}
              title={intl.get('layout.main.menu.prescriptions')}
              data-cy="HeaderLinkPrescriptions"
            />
          </LimitTo>
          <LimitTo key="archives" roles={[Roles.Download]}>
            <HeaderLink
              key="archives"
              currentPathName={currentPathName}
              to={ROUTES.ARCHIVE_EXPLORATION}
              icon={<FileTextOutlined />}
              title={intl.get('layout.main.menu.archives')}
              data-cy="HeaderLinkArchives"
            />
          </LimitTo>
          <LimitTo key="variants" roles={[Roles.Variants]}>
            <HeaderLink
              key="variants"
              currentPathName={currentPathName}
              to={ROUTES.HOME}
              icon={<LineStyleIcon height="14" width="14" />}
              title={intl.get('layout.main.menu.variants')}
              data-cy="HeaderLinkVariants"
            />
          </LimitTo> */}
        </nav>
      }
      extra={
        <Space className={styles.extras} size={12}>
          <Dropdown
            key="user-menu"
            trigger={['click']}
            overlay={
              <Menu
                onClick={async ({ key }) => (key === 'logout' ? await keycloak.logout() : null)}
                items={[{ label: intl.get('logout'), key: 'logout' }]}
              />
            }
          >
            <a className={styles.userMenuTrigger} onClick={(e) => e.preventDefault()} href="">
              <Gravatar
                className={styles.userGravatar}
                circle
                email={tokenParsed.email || tokenParsed.identity_provider_identity}
              />
              <span className={styles.userName}>{getUserFirstName()}</span>
              <DownOutlined />
            </a>
          </Dropdown>
          {EnvironmentVariables.configFor('SHOW_TRANSLATION_BTN') === 'true' && (
            <Button
              size="small"
              className={styles.langBtn}
              type="text"
              onClick={() => dispatch(globalActions.changeLang(targetLang))}
            >
              {targetLang.toUpperCase()}
            </Button>
          )}
        </Space>
      }
      className={styles.mainHeader}
    />
  );
};

export default Header;
