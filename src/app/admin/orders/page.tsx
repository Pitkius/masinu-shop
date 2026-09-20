import { EmptyAdmin } from "../_tables";
export default function Page() {
  return <EmptyAdmin title="Orders" text="Paid Stripe checkouts are confirmed by Stripe. Connect DATABASE_URL to store order history in admin." />;
}
