import { formatCurrency } from "@/src/utils";

type AmountPropsType = {
  label: string;
  amount: number;
};

export default function Amount({ label, amount }: AmountPropsType) {
  return (
    <p className="text-2xl font-bold">
      <span>{label}: </span>
      <span className="text-amber-500">{formatCurrency(amount)}</span>
    </p>
  );
}
