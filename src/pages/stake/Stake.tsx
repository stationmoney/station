import { useState } from "react"
import { useTranslation } from "react-i18next"
import { combineState } from "data/query"
import { LinkButton } from "components/general"
import { Col, Page, Row, Tabs } from "components/layout"
import Staked from "./Staked"
import Validators from "./Validators"
import StakedDonut from "./StakedDonut"
import {
  useInterchainDelegations,
  useCalcDelegationsByValidator,
  useInterchainValidators,
} from "data/queries/staking"
import QuickStake from "./QuickStake"
import { TooltipIcon } from "components/display"
import QuickStakeTooltip from "./QuickStakeTooltip"
import { Fetching } from "components/feedback"
import styles from "./StakedDonut.module.scss"
import ChainFilter from "components/layout/ChainFilter"

const Stake = () => {
  const { t } = useTranslation()
  const [chainSelected, setChainSelected] = useState("all")

  const interchainDelegations = useInterchainDelegations()
  const interchainValidators = useInterchainValidators()
  const state = combineState(...interchainDelegations, ...interchainValidators)

  const { graphData } = useCalcDelegationsByValidator(
    interchainDelegations,
    interchainValidators
  )

  const tabs = [
    {
      key: "quick",
      tab: t("Quick Stake"),
      children: <QuickStake />,
      extra: <TooltipIcon content={<QuickStakeTooltip />} placement="bottom" />,
    },
    {
      key: "manual",
      tab: t("Manual Stake"),
      children: <Validators />,
    },
  ]

  return (
    <Page
      title={t("Stake")}
      extra={
        <LinkButton to="/rewards" color="primary" size="small">
          {t("Withdraw all rewards")}
        </LinkButton>
      }
    >
      <Col>
        {graphData?.all.length ? (
          <Row>
            <Col span={2}>
              <div className={styles.forFetchingBar}>
                <Fetching {...state}>
                  <ChainFilter title={t("Staked funds")} all {...state}>
                    {(chain) => {
                      setChainSelected(chain || "all")
                      return <StakedDonut chain={chain || "all"} />
                    }}
                  </ChainFilter>
                </Fetching>
              </div>
            </Col>
            <Staked chain={chainSelected} />
          </Row>
        ) : (
          <Staked chain={chainSelected} />
        )}

        <Tabs tabs={tabs} type="page" state />
      </Col>
    </Page>
  )
}

export default Stake
