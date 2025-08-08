import { NextResponse } from "next/server";
import { prisma } from '../../../lib/prisma';
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password, action } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required." }, { status: 400 });
    }

    // Find the reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid token." }, { status: 400 });
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return NextResponse.json({ error: "Token has expired." }, { status: 400 });
    }

    if (action === 'validate') {
      return NextResponse.json({ message: "Token is valid." });
    }

    if (action === 'reset') {
      if (!password) {
        return NextResponse.json({ error: "Password is required." }, { status: 400 });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update user's password
      await prisma.user.update({
        where: { id: resetToken.userId },
        data: { hashedPassword },
      });

      // Delete the used token
      await prisma.passwordResetToken.delete({
        where: { token },
      });

      return NextResponse.json({ message: "Password reset successfully." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
} 