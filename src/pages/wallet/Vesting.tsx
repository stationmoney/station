import { useTranslation } from "react-i18next"
import { isVestingAccount, useAccount } from "data/queries/vesting"
import { parseVestingSchedule } from "data/queries/vesting"
import { Read } from "components/token"
import VestingScheduleTable from "./VestingScheduleTable"
import styles from "./Vesting.module.scss"

const Vesting = () => {
  const { t } = useTranslation()
  const { data } = useAccount()

  if (!data) return null
  if (!isVestingAccount(data)) return null

  const schedule = parseVestingSchedule(data)

  return (
    <>
      <section className={styles.vesting}>
        <dl>
          <dt>{t("Vested")}</dt>
          <dd>
            <Read amount={schedule.amount.vested} />
          </dd>
          <dt>{t("Total")}</dt>
          <dd>
            <Read amount={schedule.amount.total} />
          </dd>
        </dl>
      </section>
      <VestingScheduleTable {...schedule} />
    </>
  )
}

export default Vesting
