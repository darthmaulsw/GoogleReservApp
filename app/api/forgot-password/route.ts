import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';
import { sendEmail } from '../../../lib/email';
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Generate a secure, time-limited reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 3600 * 1000); // Token valid for 1 hour

      // Store the token in the database
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt,
        },
      });

      // Construct the reset link
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

      // Send email using your SMTP setup
      await sendEmail({
        to: user.email!,
        subject: "Password Reset Request",
        text: `Click this link to reset your password: ${resetLink}`,
        html: `<p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
      });
    }

    // Always return a generic success message to prevent email enumeration
    return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
} 