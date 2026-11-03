import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { trackOrderSchema } from "../../schemas/trackOrderSchema";

// onSubmit receives { orderNumber } already uppercased.
export default function TrackOrderForm({ defaultValue = "", loading, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(trackOrderSchema),
    defaultValues: { orderNumber: defaultValue },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <Input
          label="Order Number"
          placeholder="ORD-4F9K2X"
          autoComplete="off"
          autoCapitalize="characters"
          error={errors.orderNumber?.message}
          {...register("orderNumber")}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full disabled:opacity-60 sm:mt-[1.7rem] sm:w-auto"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Search size={18} />
        )}
        Track Order
      </Button>
    </form>
  );
}