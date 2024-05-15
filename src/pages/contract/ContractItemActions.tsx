import { useTranslation } from "react-i18next"
import { useAddress, useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { getChainIDFromAddress } from "utils/bech32"
import { useContract } from "./Contract"
import ContractQuery from "./ContractQuery"
import { Button, LinkButton } from "components/general"
import { ModalButton } from "components/feedback"
import { ExtraActions } from "components/layout"

const ContractItemActions = () => {
  const { t } = useTranslation()
  const networks = useNetwork()
  const terraAddress = useAddress()
  const addresses = useInterchainAddresses()
  const { address, admin } = useContract()

  const chainID = getChainIDFromAddress(address, networks)
  const connectedAddress =
    chainID && addresses?.[chainID] ? addresses[chainID] : terraAddress

  return (
    <ExtraActions>
      <ModalButton
        title={t("Query")}
        renderButton={(open) => (
          <Button onClick={open} size="small" outline>
            {t("Query")}
          </Button>
        )}
      >
        <ContractQuery />
      </ModalButton>

      <LinkButton to={`/contract/execute/${address}`} size="small" outline>
        {t("Execute")}
      </LinkButton>

      <LinkButton
        to={`/contract/migrate/${address}`}
        disabled={!admin || connectedAddress !== admin}
        size="small"
        outline
      >
        {t("Migrate")}
      </LinkButton>

      <LinkButton
        to={`/contract/updateadmin/${address}`}
        disabled={!admin || connectedAddress !== admin}
        size="small"
        outline
      >
        {t("Update Admin")}
      </LinkButton>
    </ExtraActions>
  )
}

export default ContractItemActions
