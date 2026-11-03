import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { checkoutSchema } from "../../schemas/checkoutSchema";
import { CITIES } from "../../data/cities";

// onSubmit(values, { bot }): values are validated (phone normalized to 03XXXXXXXXX).
// `bot` is true when the hidden honeypot field was filled in (real people never see it).
export default function CheckoutForm({ onSubmit }) {
  const honeypotRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: "", phone: "", address: "", city: "", notes: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit(values, { bot: Boolean(honeypotRef.current?.value) })
      )}
      noValidate
      className="space-y-5"
    >
      {/* Honeypot: hidden from people, bots tend to fill it in */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <Input
        label="Full Name"
        placeholder="e.g. Ali Khan"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />

      <Input
        label="Phone Number"
        type="tel"
        inputMode="numeric"
        placeholder="03001234567"
        autoComplete="tel"
        hint="We'll call this number to confirm your order."
        error={errors.phone?.message}
        {...register("phone")}
      />

      <Select
        label="City"
        placeholder="Select your city"
        options={CITIES}
        error={errors.city?.message}
        {...register("city")}
      />

      <Input
        label="Complete Address"
        as="textarea"
        rows={3}
        placeholder="House / flat no., street, area, landmark"
        autoComplete="street-address"
        error={errors.address?.message}
        {...register("address")}
      />

      <Input
        label="Order Notes (optional)"
        as="textarea"
        rows={2}
        placeholder="Anything we should know?"
        error={errors.notes?.message}
        {...register("notes")}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Placing order...
          </>
        ) : (
          "Place Order (Cash on Delivery)"
        )}
      </Button>
    </form>
  );
}