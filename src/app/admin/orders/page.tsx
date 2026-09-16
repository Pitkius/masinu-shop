import { EmptyAdmin } from "../_tables";
export default function Page() {
  return <EmptyAdmin title="Orders" text="No persisted orders yet. Checkout validates totals on the server and returns AWAITING_PAYMENT until a payment provider and database are connected." />;
}
