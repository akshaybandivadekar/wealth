import { notFound } from 'next/navigation';

import { getAccountWithTransactions } from '@/actions/accounts';
import TransactionTable from '../_components/transaction-table';
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';
import { blueishPurpleColor } from '@/constants/color';

const AccountsPage = async ({ params }) => {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);
  if (!accountData) {
    notFound();
  }
  const { transctions, ...account } = accountData;

  return (
    <div className='spact-y-8 px-5 flex gap-4 items-end justify-between'>
      <div>
        <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>
          {account.name}
        </h1>
        <p className='text-muted-foreground'>
          {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
        </p>
      </div>
      <div className='text-right pb-2'>
        <div className='text-xl sm:text-2xl font-bold'>
          ${parseFloat(account.balance).toFixed(2)}
        </div>
        <p className='text-sm text-muted-foreground'>
          {account._count.transactions} Transactions
        </p>
      </div>

      {/* Chart Section */}

      {/* Transaction Table */}
      <Suspense
        fallback={
          <BarLoader
            className='mt-4'
            width={'100%'}
            color={blueishPurpleColor}
          />
        }>
        <TransactionTable transactions={transctions} />
      </Suspense>
    </div>
  );
};

export default AccountsPage;
