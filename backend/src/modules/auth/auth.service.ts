import { prisma } from "../../shared/prisma";
import { AppError } from "../../shared/errors";
import { comparePassword } from "../../utils/password";
import { signToken } from "../../utils/jwt";

export async function login(email: string, password: string) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
    transportationCompanyId: user.transportationCompanyId,
    clientId: user.clientId,
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      transportationCompanyId: user.transportationCompanyId,
      clientId: user.clientId,
    },
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      transportationCompanyId: true,
      clientId: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}