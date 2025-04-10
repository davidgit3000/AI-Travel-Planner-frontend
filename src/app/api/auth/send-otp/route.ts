import { NextResponse } from "next/server";
import { generateOTP, otpStorage, validateEmail } from "@/utils";
import { sendEmail, generateOTPEmailTemplate } from "@/utils/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Store OTP in memory
    otpStorage.set(email, {
      otp,
      timestamp: Date.now(),
    });

    // Send OTP via email
    try {
      console.log(`OTP for ${email}: ${otp}`);
      const response = await sendEmail({
        to: email,
        subject: "Verify your email - TripMate AI",
        html: generateOTPEmailTemplate(otp),
      });

      console.log(response.data);
      return NextResponse.json(
        { message: "OTP sent successfully", data: response.data },
        { status: 200 }
      );
    } catch (error) {
      console.error('Failed to send email:', error);
      // For development, still log the OTP even if email fails
      console.log(`OTP for ${email}: ${otp}`);
    }

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
