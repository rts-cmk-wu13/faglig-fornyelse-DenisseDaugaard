import { checkoutSchema } from "../lib/checkoutSchema";
import { getCart, clearCart, getUser, saveOrder } from "../lib/storage";
import { redirect } from "react-router-dom";

// console.log(checkoutSchema.pick); // function

export async function action({ request }) {
    const form = await request.formData();
    const data = Object.fromEntries(form);
    const step = Number(data.step || 1);
    
    const addressSchema = checkoutSchema.pick({
        firstName: true,
        lastName: true,
        address: true,
        apartment: true,
        city: true,
        country: true,
        zipcode: true,
    });
    
    const shippingSchema = checkoutSchema.pick({
        shipping: true,
    });
    
    const paymentSchema = checkoutSchema.pick({
        payment: true,
        cardName: true,
        cardNumber: true,
        month: true,
        year: true,
        cvv: true,
    });

    console.log(addressSchema.safeParse(data));
    // console.log(shippingSchema.safeParse(data));
    // console.log(paymentSchema.safeParse(data));
    

  let result;
  if (step === 1) result = addressSchema.safeParse(data);
  if (step === 2) result = shippingSchema.safeParse(data);
  if (step === 3) result = paymentSchema.safeParse(data);

  if (!result.success) {
    return Response.json(
      {
        errors: result.error.flatten().fieldErrors,
        values: data,
        step,
      },
      { status: 400 }
    );
  }

  // advance step
  if (step < 3) {
    return Response.json({
      values: data,
      step: step + 1,
    });
  }

  // final step → save order
  const user = getUser();
  if (!user) return redirect("/");

  const cart = getCart();

  saveOrder({
    id: Date.now(),
    userId: user.id,
    customer: data,
    items: cart,
    createdAt: new Date().toISOString(),
  });

  clearCart();
  return redirect("/orders");
}

