import classNames from "classnames"
import { useNetwork } from "data/wallet"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import styles from "./ChainFilter.module.scss"
import { useSavedNetwork } from "utils/localStorage"
import { isTerraChain } from "utils/chain"

const ChainFilter = ({
  children,
  all,
  outside,
  title,
  className,
  terraOnly,
}: {
  children: (chain?: string) => React.ReactNode
  all?: boolean
  outside?: boolean
  title?: string
  className?: string
  terraOnly?: boolean
}) => {
  const { t } = useTranslation()
  const { savedNetwork, changeSavedNetwork } = useSavedNetwork()

  const networks = Object.values(useNetwork())
    .sort((a, b) => (a.name === "Terra" ? -1 : b.name === "Terra" ? 1 : 0))
    .filter((n) => (terraOnly ? isTerraChain(n.chainID) : true))

  const initNetwork =
    networks.find((n) => n.chainID === savedNetwork) ?? networks[0]

  const [selectedChain, setChain] = useState<string | undefined>(
    all ? undefined : initNetwork?.chainID
  )

  const handleSetChain = (chain: string | undefined) => {
    setChain(chain)
    if (terraOnly) return
    changeSavedNetwork(chain)
  }

  return (
    <div className={outside ? styles.chainfilter__out : styles.chainfilter}>
      <div
        className={classNames(
          className,
          styles.header,
          terraOnly ? styles.swap : ""
        )}
      >
        {title && <h1>{title}</h1>}
        <div className={styles.pills}>
          {all && (
            <button
              onClick={() => handleSetChain(undefined)}
              className={`${styles.all} ${selectedChain ?? styles.active}`}
            >
              {t("All")}
            </button>
          )}
          {networks.map((chain) => (
            <button
              key={chain.chainID}
              onClick={() => handleSetChain(chain.chainID)}
              className={
                selectedChain === chain.chainID ? styles.active : undefined
              }
            >
              <img src={chain.icon} alt={chain.name} />
              {chain.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.content}>{children(selectedChain)}</div>
    </div>
  )
}

export default ChainFilter
