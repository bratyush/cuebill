import { NextRequest, NextResponse } from 'next/server';

// Configure route as public
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode, mobileNumber } = body;

    // Validate the input
    if (!countryCode || !mobileNumber) {
      return NextResponse.json(
        { error: 'Country code and mobile number are required' },
        { status: 400 }
      );
    }

    // Validate mobile number is 10 digits
    const phoneDigits = mobileNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return NextResponse.json(
        { error: 'Mobile number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Prepare data for Make.com webhook
    const webhookData = {
      countryCode,
      mobileNumber: phoneDigits,
      fullNumber: `${countryCode}${phoneDigits}`,
      timestamp: new Date().toISOString(),
    };

    // Send to Make.com webhook
    const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;
    
    if (!makeWebhookUrl) {
      console.error('MAKE_WEBHOOK_URL environment variable is not set');
      return NextResponse.json(
        { error: 'Webhook configuration missing' },
        { status: 500 }
      );
    }

    const webhookResponse = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    if (!webhookResponse.ok) {
      console.error('Failed to send to Make.com webhook:', webhookResponse.status);
      return NextResponse.json(
        { error: 'Failed to process submission' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        countryCode,
        mobileNumber: phoneDigits,
        fullNumber: `${countryCode} ${phoneDigits}`
      }
    });

    return response;

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
