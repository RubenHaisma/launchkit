import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe, PLANS } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )

        // Determine plan based on price ID
        let plan = 'free'
        let credits = 50

        if (subscription.items.data[0]?.price.id === PLANS.pro.priceId) {
          plan = 'pro'
          credits = PLANS.pro.credits
        } else if (subscription.items.data[0]?.price.id === PLANS.growth.priceId) {
          plan = 'growth'
          credits = -1 // unlimited
        }

        // Update user with subscription info
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: session.customer as string,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            plan,
            credits: credits === -1 ? 999999 : credits, // Set high number for unlimited
          },
        })

        console.log(`User ${userId} subscribed to ${plan} plan`)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string

        if (!subscriptionId) break

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const userId = subscription.metadata?.userId

        if (!userId) {
          // Try to find user by customer ID
          const user = await prisma.user.findUnique({
            where: { stripeCustomerId: invoice.customer as string }
          })
          
          if (!user) {
            console.error('No user found for subscription renewal')
            break
          }
        }

        // Reset credits for the new billing period
        let credits = 50
        let plan = 'free'

        if (subscription.items.data[0]?.price.id === PLANS.pro.priceId) {
          plan = 'pro'
          credits = PLANS.pro.credits
        } else if (subscription.items.data[0]?.price.id === PLANS.growth.priceId) {
          plan = 'growth'
          credits = 999999 // unlimited
        }

        await prisma.user.update({
          where: userId ? { id: userId } : { stripeCustomerId: invoice.customer as string },
          data: {
            stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            credits,
          },
        })

        console.log(`Credits reset for user on ${plan} plan`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Downgrade user to free plan
        await prisma.user.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            plan: 'free',
            credits: 50,
          },
        })

        console.log('User downgraded to free plan')
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}