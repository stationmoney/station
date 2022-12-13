import { useTranslation } from "react-i18next"
import { AccAddress, Coin } from "@terra-money/terra.js"
import { getMaxHeightStyle } from "utils/style"
import { combineState } from "data/query"
import { useMemoizedCalcValue } from "data/queries/coingecko"
import { calcDelegationsTotal } from "data/queries/staking"
import { useDelegations } from "data/queries/staking"
import { useValidators } from "data/queries/staking"
import { ValidatorLink } from "components/general"
import { ModalButton } from "components/feedback"
import { Table } from "components/layout"
import { Read } from "components/token"
import StakedCard from "./components/StakedCard"
import { useChainID } from "data/wallet"

const Delegations = () => {
  const { t } = useTranslation()
  const calcValue = useMemoizedCalcValue()
  const chainID = useChainID()

  const { data: validators, ...validatorsState } = useValidators(chainID)
  const { data: delegations, ...delegationsState } = useDelegations(chainID)
  const state = combineState(validatorsState, delegationsState)

  /* render */
  const title = t("Delegations")

  const render = () => {
    if (!delegations) return null

    const total = calcDelegationsTotal(delegations)
    const value = calcValue({ amount: total, denom: "uluna" })

    return (
      <ModalButton
        title={title}
        renderButton={(open) => (
          <StakedCard
            {...state}
            title={title}
            amount={total}
            value={value}
            onClick={open}
          />
        )}
      >
        <Table
          dataSource={delegations}
          sorter={({ balance: { amount: a } }, { balance: { amount: b } }) =>
            b.minus(a).toNumber()
          }
          columns={[
            {
              title: t("Validator"),
              dataIndex: "validator_address",
              render: (address: AccAddress) => (
                <ValidatorLink address={address} internal />
              ),
            },
            {
              title: t("Delegated"),
              dataIndex: "balance",
              render: (balance: Coin) => <Read {...balance.toData()} />,
              align: "right",
            },
          ]}
          style={getMaxHeightStyle(320)}
        />
      </ModalButton>
    )
  }

  return render()
}

export default Delegations
