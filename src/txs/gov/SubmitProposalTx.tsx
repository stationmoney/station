import { useTranslation } from "react-i18next"
import { Page } from "components/layout"
import TxContext from "../TxContext"
import SubmitProposalForm from "./SubmitProposalForm"
import ChainFilter from "components/layout/ChainFilter"

const SubmitProposalTx = () => {
  const { t } = useTranslation()

  const render = (chain?: string) => {
    if (!chain) return null
    return <SubmitProposalForm chain={chain} />
  }

  return (
    <Page title={t("New proposal")} small>
      <ChainFilter outside>
        {(chain) => <TxContext>{render(chain)}</TxContext>}
      </ChainFilter>
    </Page>
  )
}

export default SubmitProposalTx
