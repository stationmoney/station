import { useTranslation } from "react-i18next"
import DescriptionIcon from "@mui/icons-material/Description"
import BoltIcon from "@mui/icons-material/Bolt"
import { TUTORIAL, SETUP } from "config/constants"
import { ExternalLink } from "components/general"
import { Contacts } from "components/layout"
import styles from "./Links.module.scss"

const Links = () => {
  const { t } = useTranslation()

  const community = {
    medium: "https://medium.com/terra-money",
    discord: "https://terra.sc/discord",
    telegram: "https://t.me/TerraNetworkLobby",
    twitter: "https://twitter.com/terra_money",
    github: "https://github.com/terra-money",
  }

  return (
    <div className={styles.links}>
      <div className={styles.tutorial}>
        <ExternalLink href={SETUP} className={styles.link}>
          <BoltIcon style={{ fontSize: 18 }} />
          {t("Setup")}
        </ExternalLink>
        <ExternalLink href={TUTORIAL} className={styles.link}>
          <DescriptionIcon style={{ fontSize: 18 }} />
          {t("Documentation")}
        </ExternalLink>
      </div>

      <div className={styles.community}>
        <Contacts contacts={community} menu />
      </div>
    </div>
  )
}

export default Links
