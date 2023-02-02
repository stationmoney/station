import { FormError } from "components/form"
import { InternalButton } from "components/general"
import { useBankBalance, useIsWalletEmpty } from "data/queries/bank"
import { useExchangeRates } from "data/queries/coingecko"
import { useNativeDenoms } from "data/token"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import ManageTokens from "./ManageTokens"
import Asset from "./Asset"
import styles from "./AssetList.module.scss"
import { useTokenFilters } from "utils/localStorage"
import { toInput } from "txs/utils"
import {
  useCustomTokensCW20,
  useCustomTokensNative,
} from "data/settings/CustomTokens"

const AssetList = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { hideNoWhitelist, hideLowBal } = useTokenFilters()

  const coins = useBankBalance()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const native = useCustomTokensNative()
  const cw20 = useCustomTokensCW20()
  const alwaysVisibleDenoms = new Set([
    ...cw20.list.map((a) => a.token),
    ...native.list.map((a) => a.denom),
  ])

  const list = useMemo(
    () =>
      [
        ...Object.values(
          coins.reduce((acc, { denom, amount, chain }) => {
            const data = readNativeDenom(denom)
            if (acc[data.token]) {
              acc[data.token].balance = `${
                parseInt(acc[data.token].balance) + parseInt(amount)
              }`
              acc[data.token].chains.push(chain)
              return acc
            } else {
              const isWhitelisted = !denom.endsWith("...")
              return {
                ...acc,
                [data.token]: {
                  denom,
                  balance: amount,
                  icon: data.icon,
                  symbol: data.symbol,
                  price: isWhitelisted ? prices?.[data.token]?.price ?? 0 : 0,
                  change: isWhitelisted ? prices?.[data.token]?.change ?? 0 : 0,
                  chains: [chain],
                },
              }
            }
          }, {} as Record<string, any>)
        ),
      ]
        .filter(
          (a) => (hideNoWhitelist ? !a.symbol.endsWith("...") : a) // TODO: update and implement whitelist check
        )
        .filter((asset) => {
          if (!hideLowBal) return true

          if (alwaysVisibleDenoms.has(asset.denom)) return true

          return hideLowBal ? asset.price * toInput(asset.balance) >= 1 : asset
        })
        .sort(
          (a, b) =>
            b.price * parseInt(b.balance) - a.price * parseInt(a.balance)
        ),
    [coins, readNativeDenom, hideNoWhitelist, hideLowBal, prices]
  )

  const render = () => {
    if (!coins) return

    return (
      <div>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}
        <section>
          {list.map(({ denom, ...item }) => (
            <Asset
              denom={denom}
              {...readNativeDenom(denom)}
              {...item}
              key={denom}
            />
          ))}
        </section>
      </div>
    )
  }

  return (
    <article className={styles.assetlist}>
      <div className={styles.assetlist__title}>
        <h3>Assets</h3>
        <ManageTokens>
          {(open) => (
            <InternalButton onClick={open}>{t("Manage tokens")}</InternalButton>
          )}
        </ManageTokens>
      </div>
      <div className={styles.assetlist__list}>{render()}</div>
    </article>
  )
}

export default AssetList
