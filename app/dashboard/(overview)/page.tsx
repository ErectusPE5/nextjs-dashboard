//import { Card } from '@/app/ui/dashboard/cards'; // delete this line ss3
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
//import {fetchRevenue, fetchLatestInvoices, fetchCardData } from '@/app/lib/data'; // remove fetchRevenue ss1, remove fetchLatestInvoices ss2, delete this line ss3

import { Suspense } from 'react'; //ss1
import CardWrapper from '@/app/ui/dashboard/cards'; //ss3
import { RevenueChartSkeleton, LatestInvoicesSkeleton,CardsSkeleton } from '@/app/ui/skeletons'; //ss1, ss2 LatestInvoicesSkeleton, ss3 CardsSkeleton,

export default async function Page() {
  //const revenue = await fetchRevenue(); // delete this line ss1
  //const latestInvoices = await fetchLatestInvoices(); // delete this line ss2
  /*const cardData = await fetchCardData();
  const totalPaidInvoices = cardData.totalPaidInvoices;
  const totalPendingInvoices = cardData.totalPendingInvoices;
  const numberOfInvoices = cardData.numberOfInvoices;
  const numberOfCustomers = cardData.numberOfCustomers;*/
  /*const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
   delete this line ss3*/
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/*<Card title="Collected" value={totalPaidInvoices} type="collected" /> }
        { <Card title="Pending" value={totalPendingInvoices} type="pending" /> }
        { <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> }
        { <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> delete this line  and move to CardWrapper in card.tsx ss3*/}
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}  /> //ss1 delete this line*/}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        {/* <LatestInvoices latestInvoices={latestInvoices} /> //ss2 delete this line*/}

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}