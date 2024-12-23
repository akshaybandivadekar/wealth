'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/prisma';

const serializeTransaction = (obj) => {
  const serialize = { ...obj };

  if (obj.balance) {
    serialize.balance = obj.balance.toNumber();
  }

  return serialize;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error('User Not Found');
    }

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error('Invalid Balance Amount');
    }

    // Check if this is the User's first Account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serializeAccount = serializeTransaction(account);

    revalidatePath('/dashboard');
    return { success: true, data: serializeAccount };
  } catch (err) {
    throw new Error(err.message);
  }
}
