import EmailConfirmationUI from "@/components/confirmation/EmailConfirmationUI";

export default function EmailConfirmationPage({
  params,
}: {
  params: { token: string };
}) {
  return <EmailConfirmationUI token={params.token} />;
}
