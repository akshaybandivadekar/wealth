'use server';

import { auth } from '@clerk/nextjs/server';

import serializeTransaction from './utils/serializeTransaction';
import { db } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateDefaultAccount(accountId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error('User Not Found');
    }

    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });

    revalidatePath('/dashboard');
    return { success: true, data: serializeTransaction(account) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getAccountWithTransactions(accountId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error('Unauthorized');

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error('User Not Found');
    }

    const account = await db.account.findUnique({
      where: {
        id: accountId,
        userId: user.id,
      },
      include: {
        transactions: {
          orderBy: { date: 'desc' },
        },
        _count: {
          select: { transactions: true },
        },
      },
    });
    if (!account) return null;

    return {
      ...serializeTransaction(account),
      transactions: account.transactions.map(serializeTransaction),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
