import { redirect } from "next/navigation";
import { authService } from "@/modules/auth/auth.service";
import { prisma } from "@/lib/prisma";

export async function requireCustomerProfile() {
  const session = await authService.getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "CUSTOMER") {
    if (["SUPER_ADMIN", "ADMIN", "OPERATOR"].includes(session.role)) {
      redirect("/admin/dashboard");
    }
    if (session.role === "HOTEL" || session.role === "AGENCY") {
      redirect("/hotel/dashboard");
    }
    redirect("/");
  }

  const customer = await prisma.customer.findUnique({
    where: { userId: session.userId },
    include: { user: true },
  });

  if (!customer) {
    redirect("/booking");
  }

  return { session, customer };
}
